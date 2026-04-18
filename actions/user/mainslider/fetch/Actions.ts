"use server";

import { db } from "@/lib/db";

export async function fetchMainSliderUserAction() {
  try {
    const result = await db.mainSlider.findMany({
      // ۱. فقط اسلایدرهای فعال واکشی شوند
      where: {
        isActive: true,
      },
      // ۲. مرتب‌سازی بر اساس فیلد order (صعودی: ۱، ۲، ۳...)
      orderBy: {
        order: "asc", 
      },
      // ۳. فقط فیلدهایی که سمت کاربر نیاز داریم انتخاب شوند (بهینه‌سازی)
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true,
        targetLink: true, // برای قابلیت کلیک روی اسلایدر
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error fetching user main slider:", error);
    return { success: false, data: [] };
  }
}
