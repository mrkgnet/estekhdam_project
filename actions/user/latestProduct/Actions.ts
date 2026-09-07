"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export interface ProductType {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string | null;
  _count?: {
    questions?: number;
  };
}

const PAGE_SIZE = 4;

const TARGET_SLUGS = [
  "بانک-سوالات",
  "دفترچه-های-استخدامی",
  encodeURI("بانک-سوالات"),
  encodeURI("دفترچه-های-استخدامی"),
];

// لایه کش سروری با Data Cache (تعریف درون تابع یا مستقل)
const fetchProductsWithCache = (page: number) =>
  unstable_cache(
    async () => {
      const whereClause = {
        type: "MAIN" as const,
        isActive: true,
        categories: {
          some: {
            parent: {
              catSlug: {
                in: TARGET_SLUGS,
              },
              parentId: null,
            },
          },
        },
      };

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
        items,
        totalPages,
        totalCount,
      };
    },
    [`paginated-products-page-${page}`],
    {
      revalidate: 3600,
      tags: ["products", `products-page-${page}`],
    }
  )();

// تبدیل صریح به یک async function برای برطرف شدن ارور کامپایلر Next.js
export async function getCachedPaginatedProducts(page: number = 1) {
  return await fetchProductsWithCache(page);
}

// سرور اکشن فراخوانی‌شونده توسط کلاینت
export async function fetchPaginatedProductsAction(page: number = 1) {
  try {
    const data = await getCachedPaginatedProducts(page);

    return {
      success: true,
      data: data.items,
      currentPage: page,
      totalPages: data.totalPages,
      totalCount: data.totalCount,
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