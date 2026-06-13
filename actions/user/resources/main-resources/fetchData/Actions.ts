"use server";

import { db } from "@/lib/db";

// 🟢 اضافه شدن پارامترهای صفحه‌بندی
export async function fetchDataMainResources(categorySlugs?: string[], page: number = 1, limit: number = 12) {
  try {
    const skip = (page - 1) * limit;

    const whereClause = {
      type: "MAIN",
      isActive: true,
      ...(categorySlugs && categorySlugs.length > 0 
        ? {
            categories: {
              some: {
                catSlug: {
                  in: categorySlugs,
                },
              },
            },
          }
        : {}),
    } as any;

    // 🟢 اجرای موازی واکشی داده‌ها و گرفتن تعداد کل
    const [freeProducts, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          categories: {
            select: {
              id: true,
              catName: true,
              catSlug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: skip,
        take: limit, // 🟢 محدود کردن نتایج (Limit)
      }),
      db.product.count({ where: whereClause })
    ]);

    return { success: true, data: freeProducts, totalCount };
  } catch (error) {
    console.error("❌ Error fetching free resources:", error);
    return { success: false, data: [], totalCount: 0, error: "خطا در دریافت منابع رایگان" };
  }
}