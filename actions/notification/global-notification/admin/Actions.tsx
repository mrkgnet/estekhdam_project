"use server";

import { db } from "@/lib/db";

// این یک Server Action است که مستقیماً با دیتابیس صحبت می‌کند
export async function getUnreadNotificationsCount() {
  try {
    const unreadCount = await db.notification.count({
      where: {
        isRead: false,
      },
    });

    return unreadCount; // فقط عدد را برمی‌گردانیم، نه NextResponse
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0; // در صورت خطا، صفر برمی‌گردانیم
  }
}
