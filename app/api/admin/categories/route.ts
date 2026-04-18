// این کد را به انتهای فایل app/api/admin/categories/route.ts اضافه کنید

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import z, { success } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = categorySchema.parse(body);

    const existingCategory = await db.category.findFirst({
      where: {
        name: validatedData.name,
      },
    });

    if (existingCategory) {
      return NextResponse.json({ message: "دسته‌بندی با این نام از قبل وجود دارد!" }, { status: 409 });
    }

    const newCategory = await db.category.create({
      data: {
        name: validatedData.name,
      },
    });

    return NextResponse.json({ message: "دسته‌بندی با موفقیت ایجاد شد", category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("خطا در سرور:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "اطلاعات را اشتباه وارد کردید", success: false }, { status: 400 });
    }

    return NextResponse.json({ message: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // گرفتن تمام دسته‌بندی‌ها از دیتابیس به ترتیب حروف الفبا
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    return NextResponse.json({ success: false, message: "خطای سرور در دریافت دسته‌بندی‌ها" }, { status: 500 });
  }
}
