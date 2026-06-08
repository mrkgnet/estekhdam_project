import { db } from "@/lib/db";
import { CategoryType } from "@prisma/client"; // ایمپورت تایپ از پریزما

// پارامتر type را به صورت اختیاری تعریف می‌کنیم
export async function getDataCategory(type?: CategoryType) {
  try {
    const categories = await db.category.findMany({
      where: type ? { type: type } : undefined, // فیلتر هوشمند سمت دیتابیس
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!categories || categories.length === 0) {
      return {
        success: false,
        message: "داده‌ای یافت نشد",
        data: []
      };
    }

    return {
      success: true,
      data: categories,
    };

  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return { 
      success: false, 
      data: [], 
      error: "خطایی در دریافت دسته‌بندی‌ها رخ داد." 
    };
  }
}