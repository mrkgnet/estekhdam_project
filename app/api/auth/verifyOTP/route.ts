import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import crypto from "crypto";

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
      where: { phoneNumber: phone },
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

    // 5️⃣ ساخت JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
    const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_secret");

    // 🟢 اکسس توکن (۱۵ دقیقه)
    const accessToken = await new SignJWT({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(secret);

    // 🟢 رفرش توکن (۳۰ روز)
    const refreshToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(refreshSecret);

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
    const refreshExpiresAt = new Date(Date.now() + THIRTY_DAYS_IN_MS);

    // 6️⃣ ذخیره رفرش‌توکن + پاک کردن OTP
    await db.$transaction([
      db.user.update({
        where: { phoneNumber: phone },
        data: {
          otpCode: null,
          otpExpires: null,
        },
      }),
      db.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: refreshTokenHash,
          expiresAt: refreshExpiresAt,
        },
      }),
    ]);

    // 7️⃣ محدودیت تعداد سشن‌ها (مثلاً حداکثر 5)
    const MAX_SESSIONS = 5;
    const tokens = await db.refreshToken.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (tokens.length > MAX_SESSIONS) {
      const toDelete = tokens.slice(MAX_SESSIONS).map((t) => t.id);
      await db.refreshToken.deleteMany({ where: { id: { in: toDelete } } });
    }

    // 8️⃣ پاسخ + ست کوکی‌ها
    const response = NextResponse.json({
      status: "success",
      message: "ورود موفقیت آمیز بود",
      accessToken,
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 15 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
    const expirationDate = new Date(Date.now() + THIRTY_DAYS_IN_SECONDS * 1000);

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: THIRTY_DAYS_IN_SECONDS,
      expires: expirationDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("verify error:", error);
    return NextResponse.json({ error: "مشکل داخلی سرور:لطفا چند دقیقه دیگر مجددامتحان کنید" }, { status: 500 });
  }
}
