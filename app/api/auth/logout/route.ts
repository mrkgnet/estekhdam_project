// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // اگر هنگام login کوکی را با path "/" ست کرده‌ای، اینجا هم همان را استفاده کن
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",          // خیلی مهم
    expires: new Date(0) // انقضا در گذشته
  });

  // یا اگر مطمئنی delete با path درست کار می‌کند:
  // cookieStore.delete({ name: "token", path: "/" });

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
