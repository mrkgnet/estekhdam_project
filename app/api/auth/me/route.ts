// app/api/auth/me/route.ts

import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // ✨ بلاک try...catch کل تابع را در بر می‌گیرد تا هیچ خطایی از دست نرود
  try {
    // ۱. بررسی وجود متغیر JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is not defined in .env.local");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json({ isLoggedIn: false, user: null });
    }

    // ۲. اعتبارسنجی توکن
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tokenCookie.value, secret);

    const userId = payload.userId as string;
    if (!userId) {
      return NextResponse.json({ isLoggedIn: false, user: null }, { status: 401 });
    }

    // ۳. گرفتن اطلاعات کاربر از دیتابیس
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ isLoggedIn: false, user: null }, { status: 404 });
    }

    // ۴. موفقیت
    return NextResponse.json({ isLoggedIn: true, user: user });
  } catch (error: any) {
    // ۵. گزارش خطای اصلی در ترمینال سرور
    console.error("API /me UNEXPECTED ERROR:", error);

    // بررسی اینکه آیا خطا مربوط به JWT است (مثلا منقضی شده)
    if (error.code === "ERR_JWT_EXPIRED" || error.code === "ERR_JWS_INVALID") {
      return NextResponse.json({ isLoggedIn: false, user: null, error: "Invalid or expired token" }, { status: 401 });
    }

    // برای هر خطای پیش‌بینی نشده دیگر
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
