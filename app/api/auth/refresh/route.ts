import { db } from "@/lib/db";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto"; // اضافه کردن ماژول crypto

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_secret");
    const { payload } = await jwtVerify(refreshTokenCookie.value, refreshSecret);

    const userId = payload.userId as string;
    if (!userId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 401 });
    }

    // بررسی وجود کاربر
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🟢 هش کردن توکن دریافتی از کوکی برای مقایسه با دیتابیس
    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(refreshTokenCookie.value)
      .digest("hex");

    // 🟢 چک کردن اینکه آیا این رفرش توکن در دیتابیس وجود دارد و منقضی نشده باشد
    const tokenInDb = await db.refreshToken.findFirst({
      where: {
        userId: user.id,
        tokenHash: incomingTokenHash,
      },
    });

    if (!tokenInDb) {
      return NextResponse.json({ error: "Refresh token revoked or not found" }, { status: 401 });
    }

    if (tokenInDb.expiresAt.getTime() < Date.now()) {
      // پاک کردن توکن منقضی شده از دیتابیس (اختیاری)
      await db.refreshToken.delete({ where: { id: tokenInDb.id } });
      return NextResponse.json({ error: "Refresh token expired in DB" }, { status: 401 });
    }

    // ساخت اکسس توکنِ جدید
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
    const newAccessToken = await new SignJWT({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,  
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m") // اکسس توکن جدید برای 15 دقیقه
      .sign(secret);

    const response = NextResponse.json({ status: "success", message: "Token refreshed successfully" });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 15 * 60, // ۱۵ دقیقه
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;

  } catch (error: any) {
    console.error("Refresh Token Error:", error.message);
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}
