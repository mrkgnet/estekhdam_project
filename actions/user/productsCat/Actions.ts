"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function fetchAllProductDataAction(
  page = 1,
  limit = 10,
  searchQuery = "",
  categoryQuery = "",
) {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = { type: "MAIN" };

    if (searchQuery) {
      whereClause.name = { contains: decodeURIComponent(searchQuery) };
    }

    if (categoryQuery) {
      const slugs = categoryQuery
        .split(",")
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean);

      const cats = await db.category.findMany({
        where: { catSlug: { in: slugs } },
        include: { children: true },
      });

      if (!cats.length) return { success: true, data: [], totalPages: 0, totalCount: 0 };

      whereClause.categories = {
        some: {
          id: {
            in: cats.flatMap((c) => [c.id, ...c.children.map((ch) => ch.id)]),
          },
        },
      };
    }

    const [data, totalCount] = await Promise.all([
      db.product.findMany({ where: whereClause, orderBy: { createdAt: "desc" }, skip, take: limit }),
      db.product.count({ where: whereClause }),
    ]);

    return { success: true, data, totalPages: Math.ceil(totalCount / limit), totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], totalPages: 0, totalCount: 0 };
  }
}

export async function fetchMainCategoriesAction() {
  try {
    const data = await db.category.findMany({
      where: { type: "MAIN" },
      select: { id: true, catName: true, catSlug: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return { success: false, data: [], message: "خطا در دریافت دسته‌بندی‌ها" };
  }
}
