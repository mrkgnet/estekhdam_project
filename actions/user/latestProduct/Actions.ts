"use server";

import { db } from "@/lib/db";

// تغییر به ۴ آیتم در هر صفحه تا دقیقاً یک ردیف کامل باشد
const PAGE_SIZE = 4;

export async function fetchPaginatedProductsAction(page: number = 1) {
  try {
    const targetSlugs = [
      "بانک-سوالات",
      "دفترچه-های-استخدامی",
      encodeURI("بانک-سوالات"),
      encodeURI("دفترچه-های-استخدامی"),
    ];

    const whereClause = {
      type: "MAIN" as const,
      isActive: true,
      categories: {
        some: {
          parent: {
            catSlug: {
              in: targetSlugs,
            },
            parentId: null,
          },
        },
      },
    };

    // واکشی دقیقاً ۴ آیتم
    const [items, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    return {
      success: true,
      data: items,
      currentPage: page,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("❌ Error fetching paginated products:", error);
    return {
      success: false,
      data: [],
      currentPage: page,
      totalPages: 1,
      totalCount: 0,
    };
  }
}