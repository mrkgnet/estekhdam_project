import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const news = await db.governmentNews.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      news,
    });

  } catch (error) {
    console.log("DB ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
