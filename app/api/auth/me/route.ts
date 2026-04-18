import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is not defined in .env.local");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const cookieStore = await cookies();
    // 🟢 تغییر نام کوکی به accessToken
    const tokenCookie = cookieStore.get("accessToken");

    // 🟢 اگر توکن نبود، حتما 401 برمی‌گردانیم تا AuthContext متوجه شود و ریکوئست رفرش بزند
    if (!tokenCookie) {
      return NextResponse.json({ error: "Access token missing" }, { status: 401 });
    }

    // اعتبارسنجی توکن
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tokenCookie.value, secret);

    const userId = payload.userId as string;
    if (!userId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 401 });
    }

    // گرفتن اطلاعات کاربر از دیتابیس
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // موفقیت
    return NextResponse.json({ isLoggedIn: true, user: user });
  } catch (error: any) {
    // 🟢 هر خطایی مربوط به منقضی شدن یا نامعتبر بودن JWT رخ داد، 401 برمی‌گردانیم
    // console.error("API /me JWT Error:", error.message);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
