"use server"

import { db } from "@/lib/db";

export async function getDataGlobalNotificationAction() {
  try {
    // واکشی تمام اطلاعات به ترتیب جدیدترین‌ها
    const notifications = await db.globalNotification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(notifications)) 
    };
  } catch (error) {
    console.error("❌ Error fetching global notifications:", error);
    return { success: false, error: "خطایی در دریافت اطلاعات از دیتابیس رخ داد." };
  }
}