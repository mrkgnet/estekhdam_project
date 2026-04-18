import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    // 1️⃣ بررسی ورودی‌ها
    if (!phone || !code) {
      return NextResponse.json({ error: "شماره و کد الزامی است" }, { status: 400 });
    }

    // 2️⃣ یافتن کاربر
    const user = await db.user.findUnique({
      where: {
        phoneNumber: phone,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربری با این شماره یافت نشد" }, { status: 404 });
    }

    // 3️⃣ بررسی صحت کد
    if (user.otpCode !== code) {
      return NextResponse.json({ error: "کد وارد شده اشتباه است" }, { status: 400 });
    }

    // 4️⃣ بررسی انقضا
    const now = Date.now();
    const expiryTime = user.otpExpires ? user.otpExpires.getTime() : 0;

    if (now > expiryTime) {
      return NextResponse.json({ error: "کد منقضی شده است" }, { status: 400 });
    }

    // 5️⃣ ساخت JWT (اکسس توکن و رفرش توکن)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
    // برای امنیت بیشتر بهتر است در .env یک متغیر JWT_REFRESH_SECRET هم بسازید، فعلا از همان سکرت استفاده میکنیم
    const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_secret");

    // 🟢 الف) ساخت اکسس توکن (فقط 15 دقیقه اعتبار دارد - حاوی اطلاعات کامل)
    const accessToken = await new SignJWT({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,  
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m") // 🟢 اعتبار ۱۵ دقیقه
      .sign(secret);

    // 🟢 ب) ساخت رفرش توکن (30 روز اعتبار دارد - فقط حاوی آیدی کاربر)
    const refreshToken = await new SignJWT({
      userId: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // 🟢 اعتبار ۳۰ روز
      .sign(refreshSecret);


    // 6️⃣ ذخیره رفرش توکن در دیتابیس + پاک کردن OTP مصرف شده
    await db.user.update({
      where: { phoneNumber: phone },
      data: {
        otpCode: null,
        otpExpires: null,
        // 🟢 رفرش توکن جدید را به آرایه رفرش توکن‌های کاربر اضافه می‌کنیم
        refreshTokens: {
          push: refreshToken
        }
      },
    });

    const response = NextResponse.json({
      status: "success",
      message: "ورود موفقیت آمیز بود",
      // توکن‌های جدید را به فرانت‌اند هم می‌دهیم (هرچند تو کوکی هم ست میشن)
      accessToken,
    });

    // 7️⃣ تنظیم کوکی‌ها برای هر دو توکن

    // 🟢 کوکی Access Token (۱۵ دقیقه)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 15 * 60, // ۱۵ دقیقه به ثانیه
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 🟢 کوکی Refresh Token (۳۰ روز)
    const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
    const expirationDate = new Date(Date.now() + THIRTY_DAYS_IN_SECONDS * 1000); 
    
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // بسیار مهم برای امنیت
      path: "/",
      maxAge: THIRTY_DAYS_IN_SECONDS, 
      expires: expirationDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("verify error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
