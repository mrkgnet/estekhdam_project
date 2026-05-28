"use server";

import { db } from "@/lib/db";

export async function fetchMainSliderUserAction() {
  try {
    const result = await db.governmentNews.findMany({
      // ۱. فقط اخبار فعال و آن‌هایی که اسلایدر اصلی هستند واکشی شوند
      where: {
        isActive: true,
        isMainSlider: true,
      },
      // ۲. مرتب‌سازی بر اساس جدیدترین‌ها
      orderBy: {
        createdAt: "desc",
      },
      // ۳. انتخاب فیلدهای مورد نیاز (اضافه شدن description و endAt)
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true, // اضافه شد برای نمایش در اسلایدر
        registerUrl: true, 
        slugNews: true,    
        endAt: true,       // اضافه شد برای محاسبه تایمر معکوس
      },
    });

    // ۴. نگاشت دیتای دیتابیس به ساختار مورد انتظار کامپوننت کلاینت
    const formattedSliders = result.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl || "", 
      title: item.title,
      description: item.description,
      targetLink: item.registerUrl || `/news/${item.slugNews}`, 
      endAt: item.endAt ? item.endAt.toISOString() : null, // تبدیل تاریخ به فرمت رشته استاندارد ISO
    }));

    return { success: true, data: formattedSliders };
  } catch (error) {
    console.error("❌ Error fetching user main slider:", error);
    return { success: false, data: [] };
  }
}