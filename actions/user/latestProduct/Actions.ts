"use server";

import { db } from "@/lib/db";

export async function fetchLatestProductAction() {
  try {
    const result = await db.product.findMany({
      // شرط اول: فقط محصولاتی که نوع‌شان MAIN است
      where: {
        type: "MAIN",
      },
      // شمارش تعداد سوالات متصل به هر درس/محصول
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
      // مرتب‌سازی: جدیدترین‌ها اول
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error fetching latest products:", error);
    return { success: false, data: [] };
  }
}
