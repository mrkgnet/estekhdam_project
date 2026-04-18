"use server";

import { db } from "@/lib/db";

export async function fetchLatestProductAction() {
  try {
    const result = await db.product.findMany({
      // ۱. فقط اسلایدرهای فعال واکشی شوند
    
      // ۲. مرتب‌سازی بر اساس فیلد order (صعودی: ۱، ۲، ۳...)
      orderBy: {
        createdAt: "desc" 
      },
  
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error fetching user main slider:", error);
    return { success: false, data: [] };
  }
}
