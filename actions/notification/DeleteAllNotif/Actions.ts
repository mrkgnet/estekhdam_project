"use server";

import { db } from "@/lib/db";

// اکشن جدید برای حذف پیام‌های خوانده شده
export async function deleteAllReadNotifications() {
  try {
    // برای حذف چندین رکورد با یک شرط، باید از deleteMany استفاده شود
    const result = await db.notification.deleteMany({
      where: {
        isRead: true, // فقط پیام‌هایی که خوانده شده‌اند
      },
    });

    return { success: true, count: result.count }; 
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    return { success: false, count: 0 }; 
  }
}
