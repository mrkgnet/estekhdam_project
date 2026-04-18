import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z, { success } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "نام محصول باید حداقل ۲ کاراکتر باشد"),
  slug: z.string().min(2, "اسلاگ محصول الزامی است"),
  // قیمت‌ها ممکن است از فرانت‌اند به صورت استرینگ یا عدد بیایند، ما هر دو را قبول می‌کنیم
  oldPrice: z.union([z.string(), z.number()]).optional().nullable(),
  newPrice: z.union([z.string(), z.number()]),
  imageUrl: z.string().optional(),
  selectedCategories: z.array(z.string()).min(1, "انتخاب حداقل یک دسته‌بندی الزامی است"),
  description: z.string().optional(),
});

// POST METHOD

export async function POST(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const validatedData = productSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "داده‌های ارسالی نامعتبر است",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, slug, oldPrice, newPrice, imageUrl, selectedCategories, description } = validatedData.data;

    const formattedSlug = slug.trim().replace(/\s+/g, "-").toLowerCase();

    const existingProduct = await db.product.findUnique({
      where: {
        slug: formattedSlug, // 👈 استفاده از متغیر جدید
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "محصولی با این اسلاگ (لینک) از قبل وجود دارد. لطفاً اسلاگ دیگری انتخاب کنید." },
        { status: 409 }, // 409 Conflict
      );
    }

    // ۵. ثبت امن در دیتابیس
    const newProduct = await db.product.create({
      data: {
        name,
        slug:formattedSlug,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        newPrice: Number(newPrice),
        imageUrl: imageUrl || "", // اصلاح نام فیلد به imagesUrl بر اساس دیتابیس شما
        categories: selectedCategories,
        description: description || "",
      },
    });

    // بازگشت پاسخ موفقیت‌آمیز
    return NextResponse.json(
      {
        success: true,
        message: "محصول با موفقیت در دیتابیس ثبت شد!",
        product: newProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("PRISMA ERROR ===> ", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطای داخلی سرور رخ داد. لطفا کنسول سرور را بررسی کنید.",
      },
      { status: 500 },
    );
  }
}
