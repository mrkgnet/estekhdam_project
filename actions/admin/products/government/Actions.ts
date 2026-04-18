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

    // 🟢 ۱. اگر سرچی وجود دارد، اول آیدی دسته‌بندی‌هایی که نامشان مطابقت دارد را پیدا می‌کنیم
    let matchedCategoryIds: string[] = [];
    if (searchQuery) {
      const matchedCategories = await db.category.findMany({
        where: { catName: { contains: searchQuery } },
        select: { id: true }
      });
      matchedCategoryIds = matchedCategories.map(c => c.id);
    }

    // 🟢 ۲. ساخت شرط جستجو بر اساس ساختار جدید
    const whereClause = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery } }, 
            // اگر در بین categoryIds محصول، آیدیِ دسته‌بندیِ سرچ شده وجود داشت:
            { categoryIds: { hasSome: matchedCategoryIds } }, 
          ],
        }
      : {};

    // 🟢 ۳. واکشی اطلاعات از دیتابیس (بدون include)
    const [totalCount, rawProducts] = await db.$transaction([
      db.product.count({ where: whereClause }),
      db.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // 🟢 ۴. پیدا کردن اطلاعات دسته‌بندی‌ها برای نمایش در جدول
    // گرفتن تمام آیدی دسته‌بندی‌هایی که محصولات این صفحه دارند (بدون تکرار)
    const allUsedCategoryIds = Array.from(new Set(rawProducts.flatMap(p => p.categoryIds)));
    
    // گرفتن اطلاعات این دسته‌بندی‌ها با یک کوئری سبک
    const relatedCategories = await db.category.findMany({
      where: { id: { in: allUsedCategoryIds } },
      select: { id: true, catName: true, catSlug: true }
    });

    // 🟢 ۵. ترکیب دسته‌بندی‌ها با محصولات (برای ارسال به کلاینت با فرمت دلخواه شما)
    const products = rawProducts.map(product => ({
      ...product,
      categories: relatedCategories.filter(cat => product.categoryIds.includes(cat.id))
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return { products, totalPages, totalCount };
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت محصولات از دیتابیس: ", error);
    return { products: [], totalPages: 0, totalCount: 0 };
  }
}
