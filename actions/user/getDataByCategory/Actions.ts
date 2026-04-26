"use server" 
import { db } from "@/lib/db";

export async function fetchDataByCategory(
  slug: string, 
  query: string = "", 
  page: number = 1, 
  limit: number = 10
) {
  try {
    const category = await db.category.findUnique({
      where: { 
        catSlug: slug 
      },
    });

    if (!category) {
      return { success: false, data: null };
    }

    const skip = (page - 1) * limit;

    // ایجاد شرط جستجو برای رابطه چند به چند متناسب با Prisma و PostgreSQL
    const whereClause: any = {
      categories: {
        some: {
          id: category.id
        }
      }
    };

    if (query) {
      whereClause.name = {
        contains: query,
        mode: "insensitive" 
      };
    }

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: skip,
        take: limit,
      }),
      db.product.count({
        where: whereClause
      })
    ]);

    const resultData = {
      ...category,
      products: products
    };

    return { 
      success: true, 
      // حل مشکل سریالایز شدن Date
      data: JSON.parse(JSON.stringify(resultData)),
      totalPages: Math.ceil(totalCount / limit) 
    };
    
  } catch (error) {
    console.error("Error fetching category products:", error);
    return { success: false, data: null };
  }
}
