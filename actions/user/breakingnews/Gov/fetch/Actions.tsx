"use server";

import { db } from "@/lib/db";

export async function fetchBreakingNewsAction() {
  try {
    const result = await db.governmentNews.findMany({
      where: {
        isActive: true, // فقط اخبار فعال
      },
      orderBy: {
        createdAt: "desc", // جدیدترین‌ها اول باشند
      },
      take: 10, // نمایش ۱۰ خبر آخر (اختیاری، قابل تغییر)
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true, // تاریخ ثبت
        slugNews: true, // برای ساخت لینک خبر
        endAt:true,
        status:true
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error fetching breaking news:", error);
    return { success: false, data: [] };
  }
}
