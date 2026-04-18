// فایل اکشن
"use server";

import { db } from "@/lib/db";

export async function fetchDataResource(slug: string) {
  try {
    // دیکد کردن مقدار URL به متن فارسی
    const decodedSlug = decodeURIComponent(slug);

    // ۱. گرفتن اطلاعات محصول بدون include کردن categories
    const product = await db.product.findFirst({
      where: {
        slug: decodedSlug 
      },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!product) {
      return { success: false, message: "هیچ محصولی یافت نشد.", data: null };
    }

    // ۲. گرفتن اطلاعات دسته‌بندی‌های این محصول به صورت دستی و سبک
    let categories = [];
    if (product.categoryIds && product.categoryIds.length > 0) {
      categories = await db.category.findMany({
        where: {
          id: { in: product.categoryIds } // جستجو در لیست آیدی‌ها
        },
        select: {
          id: true,
          catName: true,
          catSlug: true
        }
      });
    }

    // ۳. ترکیب کردن محصول با دسته‌بندی‌هایش برای فرستادن به کلاینت
    const productWithCategories = {
      ...product,
      categories: categories
    };

    return { success: true, data: productWithCategories };
  } catch (error) {
    console.error("❌ Error in fetchDataResource:", error);
    return { success: false, message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.", data: null };
  }
}
