"use server";

import { db } from "@/lib/db";

export async function getFreeResourceCategoriesAction() {
  try {
    const freeCategories = await db.category.findMany({
      where: {
        type: "FREE_RESOURCE",
        parentId: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 8, // 🟢 فقط 8 آیتم اول
    });

    if (!freeCategories || freeCategories.length === 0) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(freeCategories)),
    };
  } catch (error) {
    console.error("Error fetching free categories:", error);
    return { success: false, data: [], message: "خطا در دریافت اطلاعات" };
  }
}
