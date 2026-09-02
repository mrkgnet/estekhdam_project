"use server";

import { db } from "@/lib/db";

export async function dataFooter() {
  try {
    // دسته‌های اصلی (بدون والد) و حداکثر ۶ فرزند برای هر کدام
    const rootCategories = await db.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          take: 6, // 👈 فقط ۶ تا آیتم اول هر زیردسته
          orderBy: {
            createdAt: "asc", // یا بر اساس هر فیلد مرتب‌سازی دلخواه دیگر
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!rootCategories || rootCategories.length === 0) {
      return {
        success: false,
        message: "داده‌ای یافت نشد",
        data: [],
      };
    }

    return {
      success: true,
      data: rootCategories,
    };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return {
      success: false,
      data: [],
      error: "خطایی در دریافت دسته‌بندی‌ها رخ داد.",
    };
  }
}