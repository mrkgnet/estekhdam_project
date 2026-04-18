import { db } from "@/lib/db";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 🟢 تغییر به POST چون در AuthContext درخواست axios.post می‌زنید
export async function POST() {
  try {
    const cookieStore = await cookies();
    // 1️⃣ دریافت رفرش توکن (نه اکسس توکن)
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    // 2️⃣ اعتبارسنجی رفرش توکن (دقت کنید سکرت مربوط به رفرش توکن باشد)
    const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_secret");
    const { payload } = await jwtVerify(refreshTokenCookie.value, refreshSecret);

    const userId = payload.userId as string;
    if (!userId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 401 });
    }

    // 3️⃣ یافتن کاربر برای اطمینان از وجود او و گرفتن اطلاعات جدید
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🟢 (اختیاری) اگر رفرش توکن‌ها را در دیتابیس ذخیره کرده‌اید، می‌توانید چک کنید که آیا این توکن در دیتابیس هست یا قبلا باطل شده
    if (!user.refreshTokens.includes(refreshTokenCookie.value)) {
       return NextResponse.json({ error: "Refresh token revoked" }, { status: 401 });
    }

    // 4️⃣ ساخت اکسس توکنِ جدید
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

    // 5️⃣ ست کردن کوکیِ جدید و ارسال رسپانس
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
