import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { infoCurentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }
    const { id } = await params;

    const news = await db.governmentNews.findUnique({
      where: {
        id: id,
      },
    });

    if (!news) {
      return NextResponse.json({ success: false, message: "خبر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false, message: "خطا در دریافت خبر" }, { status: 500 });
  }
}

/// POST

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const { id } = await params;

    const body = await req.json();

    const updatedNews = await db.governmentNews.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        slugNews: body.slugNews,
        organization: body.organization,
        price: body.price,
        maxAge: body.maxAge,
        description: body.description,
        imageUrl: body.imageUrl,
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
        isMainSlider: body.isMainSlider,
        jobs: body.jobs,
        cities: body.cities,
      },
    });

    return NextResponse.json({
      success: true,
      message: "خبر با موفقیت ویرایش شد",
      news: updatedNews,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false, message: "خطا در ویرایش خبر" }, { status: 500 });
  }
}
