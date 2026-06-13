import { db } from "@/lib/db";
import { CategoryType } from "@prisma/client";

export async function getDataCategoriMainResource(type?: CategoryType) {
  try {
    const categories = await db.category.findMany({
      where: {
        ...(type ? { type: type } : {}), 
        // ❌ فیلتر parentId حذف شد تا هم والدها و هم فرزندان با یک درخواست واکشی شوند
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!categories || categories.length === 0) {
      return {
        success: false,
        message: "داده‌ای یافت نشد",
        data: [],
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
      error: "خطایی در دریافت دسته‌بندی‌ها رخ داد.",
    };
  }
}