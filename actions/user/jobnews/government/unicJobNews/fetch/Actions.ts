// actions/news.ts
"use server";
import { db } from "@/lib/db";

export async function fetchDataUnicJobNews(slug: string) {
  try {
    const news = await db.governmentNews.findUnique({
      where: { slugNews: slug },
      // با استفاده از include به پریزما می‌گوییم که جدول محصولات متصل را هم بیاور
      include: {
        products: {
          // با استفاده از select فقط فیلدهایی از محصول را می‌گیریم که نیاز داریم (برای سبکی دیتای ارسالی)
          select: {
            id: true,
            name: true,      // اگر در مدل Product شما title است، اینجا title بنویسید
            slug: true,
            oldPrice: true,  // در صورت وجود در مدل
            newPrice: true,  // اگر در مدل Product شما price است، اینجا price بنویسید
            imageUrl: true,
          },
        },
      },
    });

    return news; // حالا news به طور خودکار شامل آرایه products هم هست!
  } catch (error) {
    console.error("DB ERROR:", error);
    return null;
  }
}
