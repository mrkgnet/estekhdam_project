"use server"; // حتما باید در خط اول باشد

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// دریافت لیست همه نوتیفیکیشن‌ها
export async function getAllNotifications() {
  try {
    return await db.notification.findMany({
      orderBy: { createdAt: "desc" }, 
      take: 50, 
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

// تغییر وضعیت به خوانده شده
export async function markAsRead(id?: string) {
  try {
    if (id) {
      await db.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } else {
      await db.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }
    // به Next.js می‌گوییم که دیتای این صفحه تغییر کرده و باید از نو کش شود
    revalidatePath("/adminp/notifications");
  } catch (error) {
    console.error(error);
  }
}
