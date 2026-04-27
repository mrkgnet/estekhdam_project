// app/api/auth/logout/route.ts
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // گرفتن رفرش توکن از کوکی قبل از پاک کردن آن
    const refreshTokenCookie = cookieStore.get("refreshToken");
    const tokenValue = refreshTokenCookie?.value;

    // ۱. پاک کردن رفرش توکن از دیتابیس
    if (tokenValue) {
      // چون رفرش توکن‌ها الان یک جدول مجزا هستند، 
      // باید آن را مستقیماً از جدول RefreshToken حذف کنیم
      await db.refreshToken.deleteMany({
        where: {
          tokenHash: tokenValue, // فرض بر این است که tokenValue در فیلد tokenHash ذخیره شده است
        },
      });
    }

    // ۲. پاک کردن هر دو کوکی از مرورگر کاربر
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Logout error:", error);
    
    // در صورت بروز خطا هم کوکی‌ها را پاک می‌کنیم تا کلاینت دچار مشکل نشود
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
