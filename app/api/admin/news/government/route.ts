import { register } from 'module';
import { infoCurentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

//
export async function POST(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const {
      title,
      slugNews,
      isMainSlider,
      organization,
      description,
      imageUrl,
      registerUrl,
      price,
      maxAge,
      startAt,
      endAt,
      jobs,
      cities,
    } = body;

    if (!title || !organization || !slugNews) {
      return NextResponse.json({ success: false, message: "اطلاعات ناقص است" }, { status: 400 });
    }

    // چک کردن تکراری بودن اسلاگ
    const checkSlug = await db.governmentNews.findFirst({
      where: {
        slugNews: slugNews,
      },
    });

    if (checkSlug) {
      return NextResponse.json({ success: false, message: "این اسلاگ قبلا ثبت شده است" }, { status: 400 });
    }

    const news = await db.governmentNews.create({
      data: {
        title,
        slugNews,
        organization,
        description,
        imageUrl,
        registerUrl,
        price,
        maxAge,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        jobs,
        cities,
        isMainSlider,
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "اطلاعات با موفقیت ثبت شد",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

///

export async function GET(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);

    const skip = (page - 1) * limit;

    const news = await db.governmentNews.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { organization: { contains: search, mode: "insensitive" } },
          { slugNews: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const total = await db.governmentNews.count({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { organization: { contains: search, mode: "insensitive" } },
          { slugNews: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      news,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("DB ERROR:", error);

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

///

export async function DELETE(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    }

    await db.governmentNews.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "خبر با موفقیت حذف شد",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
