import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const products = await db.product.findMany({
      // مرتب‌سازی: محصولات جدیدتر در ابتدای لیست قرار بگیرند
      orderBy: {
        createdAt: "desc",
      },
    });

    // ارسال پاسخ موفقیت‌آمیز به همراه آرایه محصولات
    return NextResponse.json(
      {
        success: true,
        products: products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    // ارسال خطای ۵۰۰ در صورت بروز مشکل در سرور یا دیتابیس
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت لیست محصولات از سرور",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "عدم دسترسی" }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "شناسه محصول ارسال نشده است" }, { status: 400 });
    }

    // ۳. حذف محصول از دیتابیس
    await db.product.delete({
      where: {
        id: id,
      },
    });

    // ۴. ارسال پاسخ موفقیت آمیز به کلاینت
    return NextResponse.json({ success: true, message: "محصول با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "خطا در سرور هنگام حذف محصول" }, { status: 500 });
  }
}
