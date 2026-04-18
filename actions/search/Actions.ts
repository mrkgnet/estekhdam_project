// actions/search/Action.ts
"use server"; 

import { db } from "@/lib/db";

export async function getDataSearchMany(query: string) {
  if (!query || query.trim() === "") return [];

  try {
    // استفاده از Promise.all برای اجرای همزمان کوئری‌ها جهت افزایش سرعت
    const [products, governmentNews] = await Promise.all([
      
      // ۱. جستجو در محصولات
      db.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: { id: true, name: true, slug: true },
        take: 3, // مثلا ۳ نتیجه از محصولات
      }),

      // ۲. جستجو در اخبار (نام مدل دیتابیس خود مثلا news یا post را قرار دهید)
      db.governmentNews.findMany({ 
        where: {
          title: { // فرض می‌کنیم فیلد عنوان در خبر title است
            contains: query,
            mode: "insensitive",
          },
        },
        select: { id: true, title: true, slugNews: true },
        take: 3, // مثلا ۳ نتیجه از اخبار
      })

    ]);

    // یکسان‌سازی فرمت داده‌ها و اضافه کردن فیلد type
    const formattedProducts = products.map((item) => ({
      id: item.id,
      title: item.name, // تبدیل name به title تا در فرانت‌اند یکپارچه باشد
      slug: item.slug,
      type: "product", // 👈 برچسب محصول
    }));

    const formattedNews = governmentNews.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slugNews,
      type: "news", // 👈 برچسب خبر
    }));

    // ترکیب هر دو لیست با هم
    const combinedResults = [...formattedProducts, ...formattedNews];

    // در نهایت نهایتاً ۵ مورد از ترکیب هر دو را برمی‌گردانیم (اختیاری)
    return combinedResults.slice(0, 5);

  } catch (error) {
    console.error("خطا در جستجو:", error);
    return [];
  }
}
