"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataProduct(page: number = 1, limit: number = 10, searchQuery: string = "") {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { products: [], totalPages: 0, totalCount: 0 };
    }

    const skip = (page - 1) * limit;

    // ساخت شرط جستجو مدرن و بهینه برای واکشی فیلتر شده
    const whereClause = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } }, 
            { 
              categories: { 
                some: { catName: { contains: searchQuery, mode: "insensitive" as const } } 
              } 
            }, 
          ],
        }
      : {};

    // انجام عملیات همزمان در دیتابیس برای بهینه‌سازی سرعت
    const [totalCount, products] = await db.$transaction([
      db.product.count({ where: whereClause }),
      db.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          categories: {
            select: { id: true, catName: true, catSlug: true }
          }
        }
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { products, totalPages, totalCount };
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت محصولات از دیتابیس: ", error);
    return { products: [], totalPages: 0, totalCount: 0 };
  }
}