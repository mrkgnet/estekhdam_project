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

    // محاسبه تعداد آیتم‌هایی که باید رد شوند (برای صفحه‌بندی)
    const skip = (page - 1) * limit;

    // ایجاد شرط جستجو
    const whereClause: any = {
      categoryIds: {
        has: category.id
      }
    };

    // اصلاح نام فیلد جستجو از title به name
    if (query) {
      whereClause.name = {
        contains: query,
        mode: "insensitive" // برای جستجوی بدون حساسیت به حروف بزرگ و کوچک
      };
    }

    // گرفتن محصولات و تعداد کل آن‌ها به صورت همزمان
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

    // totalPages برای استفاده در کامپوننت Pagination در صورت نیاز برگشت داده می‌شود
    return { 
      success: true, 
      data: resultData,
      totalPages: Math.ceil(totalCount / limit) 
    };
    
  } catch (error) {
    console.error("Error fetching category products:", error);
    return { success: false, data: null };
  }
}
