"use server";

import { db } from "@/lib/db";

export async function fetchTopicProductAction(catSlug) {
  try {
    const result = await db.product.findMany({
      where: { 
        categories: {
          some: { catSlug: catSlug }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      
      // 👇 این بخش اضافه می‌شود
      include: {
        categories: {
          select: {
            catName: true, // استخراج نام دسته‌بندی
            catSlug: true, // (اختیاری) استخراج اسلاگ
          }
        }
      }
    });

    if (!result) return { success: false, data: [] };
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [] };
  }
}
