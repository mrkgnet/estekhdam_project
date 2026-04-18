import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🟢 گرفتن هر دو توکن از کوکی‌ها
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
  // اگر در فایل .env متغیر JWT_REFRESH_SECRET نساختید، فعلا از همان سکرت اصلی استفاده می‌کند
  const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_secret");

  // مسیرهای نیازمند احراز هویت
  const protectedRoutes = ["/ddashboard", "/adminp"];

  // اگر مسیر فعلی در فهرست محافظت‌شده بود
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // ==========================================
  // ۱. بررسی Access Token (توکن ۱۵ دقیقه‌ای)
  // ==========================================
  if (accessToken) {
    try {
      // بررسی اعتبار اکسس توکن
      const { payload } = await jwtVerify(accessToken, secret);
      const role = payload.role;

      // اگر ادمین بود
      if (role === "admin") {
        if (pathname.startsWith("/auth") || pathname.startsWith("/ddashboard")) {
          return NextResponse.redirect(new URL("/adminp", request.url));
        }
      }

      // اگر کاربر عادی بود و رفت به ادمین
      if (role !== "admin" && pathname.startsWith("/adminp")) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // اگر کاربر عادی بود و رفت به لاگین
      if (role === "user") {
        if (pathname.startsWith("/auth")) {
          return NextResponse.redirect(new URL("/ddashboard", request.url));
        }
      }

      // اگر همه‌چیز اوکی بود
      return NextResponse.next();
    } catch (err) {
      // ⚠️ اکسس توکن منقضی یا خراب شده است. به جای ریدایرکت، اجازه می‌دهیم برود مرحله بعد (چک کردن رفرش توکن)
      // کنسول لاگ برای دیباگ (اختیاری)
      // console.log("Access token expired, checking refresh token...");
    }
  }

  // ==========================================
  // ۲. بررسی Refresh Token (توکن ۳۰ روزه)
  // ==========================================
  if (refreshToken) {
    try {
      // بررسی امضا و انقضای رفرش توکن (نیاز به چک کردن دیتابیس در میدل‌ویر نیست)
      await jwtVerify(refreshToken, refreshSecret);
      
      // اگر کاربر رفرش توکن معتبر دارد و در صفحه لاگین است، او را به داشبورد می‌فرستیم 
      // تا در آنجا ریکوئست ساخت اکسس توکن جدید زده شود
      if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/ddashboard", request.url));
      }

      // اجازه می‌دهیم درخواست رد شود. 
      // (در سمت کلاینت کدهای AuthContext متوجه نبودن اکسس توکن می‌شوند و API رفرش را صدا می‌زنند)
      return NextResponse.next();
    } catch (err) {
      // ⚠️ رفرش توکن هم نامعتبر یا منقضی شده است
    }
  }

  // ==========================================
  // ۳. کاربر هیچ توکن معتبری ندارد
  // ==========================================
  if (isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
