import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    // 1️⃣ بررسی ورودی‌ها
    if (!phone || !code) {
      return NextResponse.json(
        { error: "شماره و کد الزامی است" },
        { status: 400 }
      );
    }

    // 2️⃣ یافتن کاربر
    const user = await db.user.findUnique({
      where: { phoneNumber: phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این شماره یافت نشد" },
        { status: 404 }
      );
    }

    // 3️⃣ بررسی صحت کد
    if (user.otpCode !== code) {
      return NextResponse.json(
        { error: "کد وارد شده اشتباه است" },
        { status: 400 }
      );
    }

    // 4️⃣ بررسی انقضا
    const now = Date.now();
    const expiryTime = user.otpExpires ? user.otpExpires.getTime() : 0;

    if (now > expiryTime) {
      return NextResponse.json(
        { error: "کد منقضی شده است" },
        { status: 400 }
      );
    }

    // 5️⃣ ساخت JWT (۳۰ روز اعتبار)
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret"
    );

    const token = await new SignJWT({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // ✅ اعتبار توکن ۳۰ روز
      .sign(secret);

    const response = NextResponse.json({
      status: "success",
      message: "ورود موفقیت آمیز بود",
      token,
    });

    // 6️⃣ تنظیم کوکی برای ۳۰ روز
    const THIRTY_DAYS = 60 * 60 * 24 * 30;

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: THIRTY_DAYS, // ✅ ۳۰ روز
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 7️⃣ حذف OTP مصرف شده
    await db.user.update({
      where: { phoneNumber: phone },
      data: {
        otpCode: null,
        otpExpires: null,
      },
    });

    return response;

  } catch (error) {
    console.error("verify error:", error);

    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}