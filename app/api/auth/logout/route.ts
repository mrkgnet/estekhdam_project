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

    // ۱. پاک کردن رفرش توکن از دیتابیس (باطل کردن سشن در بک‌اند)
    if (tokenValue) {
      // الف: پیدا کردن کاربری که این توکن را در آرایه توکن‌هایش دارد
      const user = await db.user.findFirst({
        where: {
          refreshTokens: {
            has: tokenValue, // در Prisma برای جستجو داخل آرایه از has استفاده می‌شود
          },
        },
      });

      if (user) {
        // ب: فیلتر کردن (حذف) توکن فعلی از لیست توکن‌های کاربر
        const updatedTokens = user.refreshTokens.filter(
          (token) => token !== tokenValue
        );

        // ج: آپدیت کردن دیتابیس با لیست جدید توکن‌ها
        await db.user.update({
          where: { id: user.id },
          data: { 
            refreshTokens: updatedTokens 
          },
        });
      }
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
