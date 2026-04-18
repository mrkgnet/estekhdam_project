import { cookies } from "next/headers";
import { jwtVerify } from "jose";

type JwtUser = {
  userId: string;
  role: string;
};

export async function getCurrentUser(): Promise<JwtUser | null> {
  const cookieStore = await cookies();
  
  // ۱. تغییر نام کوکی از token به accessToken
  const accessToken = cookieStore.get("accessToken")?.value;

  // اگر اکسس توکن وجود نداشت، یعنی کاربر لاگین نیست یا توکنش پاک شده
  if (!accessToken) return null;

  // ۲. استفاده از سکرت مربوط به اکسس توکن
  // اگر برای اکسس توکن و رفرش توکن سکرت‌های جداگانه دارید (مثلا ACCESS_TOKEN_SECRET) نام آن را اینجا تغییر دهید
  const secret = process.env.JWT_SECRET; 

  if (!secret) {
    throw new Error("JWT_SECRET not found");
  }

  try {
    // ۳. اعتبارسنجی اکسس توکن
    const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(secret));

    return {
      userId: payload.userId as string,
      role: payload.role as string,
    };
  } catch (err: any) {
    // ۴. اگر توکن منقضی (Expired) شده باشد یا دستکاری شده باشد، می‌آید اینجا
    // لاگ را کمی خواناتر می‌کنیم تا در دیباگ کمک کند
    console.log("Access Token validation failed (likely expired):", err.message);
    
    // برگرداندن null باعث می‌شود سرور اکشن شما کاربر را احراز هویت نشده در نظر بگیرد
    // در این حالت، فرانت‌اند باید به مسیر رفرش توکن درخواست بفرستد تا توکن جدید بگیرد
    return null;
  }
}

export async function infoCurentUser(): Promise<JwtUser | null> {
  return await getCurrentUser();
}
