import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. متد GET برای دریافت اطلاعات اولیه جهت پر کردن فرم ویرایش
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 403 });
    }
    
    const { id } = await params;


    // نکته مهم: نام مدل (product) را بر اساس فایل schema.prisma خود تنظیم کنید
    // اگر نام جدول governmentNews است، آن را جایگزین کنید، اما معمولا برای محصول، product است.
    const product = await db.product.findUnique({
      where: { id: id }
      
    });

    



    if (!product) {
      return NextResponse.json({ success: false, message: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "خطا در دریافت اطلاعات محصول" }, { status: 500 });
  }
}

// 2. متد PUT برای ذخیره تغییرات و آپدیت محصول
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const { name, slug, oldPrice, newPrice, imageUrl, description, selectedCategories } = body;

    // آپدیت اطلاعات در دیتابیس
    const updatedProduct = await db.product.update({
      where: { id: id },
      data: {
        name,
        slug,
        oldPrice: oldPrice ? oldPrice.toString() : null, // تبدیل به تایپ صحیح براساس دیتابیس
        newPrice: newPrice.toString(),
        imageUrl,
        description,
        // منطق آپدیت رابطه‌های چند-به-چند (دسته‌بندی‌ها)
        categories: {
          set: [], // ابتدا تمام دسته‌بندی‌های قبلی متصل به این محصول را پاک می‌کند
          connect: selectedCategories.map((catName: string) => ({
            name: catName // سپس دسته‌بندی‌های جدید را بر اساس نام متصل می‌کند
          }))
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "ویرایش محصول با موفقیت انجام شد",
      product: updatedProduct
    });

  } catch (error) {
    console.error("خطا در ویرایش محصول:", error);
    return NextResponse.json({ success: false, message: "خطا در ویرایش محصول در سرور" }, { status: 500 });
  }
}
