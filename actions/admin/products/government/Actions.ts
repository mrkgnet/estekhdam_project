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

    // 🟢 ۱. ساخت شرط جستجو بر اساس روابط پستگرس
    const whereClause = searchQuery
      ? {
          OR: [
            // جستجو در نام محصول
            { name: { contains: searchQuery, mode: "insensitive" } }, 
            // جستجو در نام دسته‌بندی‌های متصل به این محصول
            { 
              categories: { 
                some: { catName: { contains: searchQuery, mode: "insensitive" } } 
              } 
            }, 
          ],
        }
      : {};

    // 🟢 ۲. واکشی اطلاعات و دسته‌بندی‌ها به صورت همزمان
    const [totalCount, products] = await db.$transaction([
      db.product.count({ where: whereClause }),
      db.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        // جادوی پریزما برای دیتابیس‌های رابطه‌ای: 
        // به جای واکشی دستی، دسته‌بندی‌های هر محصول را خودکار Join و ضمیمه می‌کند
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
