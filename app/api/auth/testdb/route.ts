import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // تست ساده: شمارش کاربران
    const usersCount = await db.user.count();

    return NextResponse.json({
      success: true,
      message: "✅ اتصال به دیتابیس برقرار است",
      usersCount,
    });
  } catch (error: any) {
    console.error("DB TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "❌ خطا در اتصال به دیتابیس",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
