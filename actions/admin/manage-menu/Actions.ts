// مسیر فایل: مثلاً '@/actions/menu/fetchMenu/Actions.ts'
import { db } from "@/lib/db";

export async function getDataMenuClient() {
  try {
    const menus = await db.menuClient.findMany({
      orderBy: [
        { order: "desc" },      // 🟢 اولویت اول: فیلد ترتیب (از کوچک به بزرگ 0, 1, 2...)
        { createdAt: "desc" }  // 🟢 اولویت دوم: جدیدترین‌ها (اگر ترتیب‌ها برابر بود)
      ],
    });

    if (!menus || menus.length === 0) {
      return {
        success: false,
        message: "هیچ منویی یافت نشد"
      };
    }

    return {
      success: true,
      data: menus,
    };

  } catch (error) {
    console.error("❌ Error fetching menus:", error);
    
    return { 
      success: false, 
      data: [], 
      error: "خطایی در دریافت منوها از دیتابیس رخ داد." 
    };
  }
}
