import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const news = await db.governmentNews.findUnique({
      where: {
        id: id,
      },
    });

    if (!news) {
      return NextResponse.json({ success: false, message: "News not found" }, { status: 404 });
    }

    

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.log("DB ERROR:", error);

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
