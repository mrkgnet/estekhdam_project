"use server";

import { db } from "@/lib/db";
// مسیر ایمپورت پریزمای خود را چک کنید

export async function productByCatAction() {
  try {
    // ۱. واکشی دسته‌های اصلی (parentId: null) به همراه زیردسته‌ها و محصولاتشان
    const categoriesWithProducts = await db.category.findMany({
      where: {
        parentId: null, // فقط دسته‌های اصلی
      },
      include: {
        products: {
          // 🟢 اضافه شدن واکشی محصولات مستقیمِ دسته اصلی
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        children: {
          include: {
            products: {
              take: 10,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!categoriesWithProducts || categoriesWithProducts.length === 0) {
      return { success: true, data: [] };
    }

    // ۲. 🟢 مهم‌ترین بخش: تبدیل خروجی پریزما به JSON ساده برای رفع خطای Date در کلاینت Next.js
    const safeData = JSON.parse(JSON.stringify(categoriesWithProducts));

    return {
      success: true,
      data: safeData,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [], message: "خطا در دریافت اطلاعات" };
  }
}
