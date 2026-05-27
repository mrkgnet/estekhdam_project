// @/actions/notification/global-notification/user/fetch/Actions.ts
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ۱. واکشی اعلان‌ها برای کاربر خاص
export async function getDataGlobalNotificationUserAction(userId: string) {
  try {
    const notifications = await db.globalNotification.findMany({
      where: {
        isActive: true,
        // اعلان‌هایی که کاربر قبلاً آن‌ها را حذف نکرده باشد
        readBy: {
          none: {
            userId: userId,
            isDeleted: true
          }
        }
      },
      include: {
        // چک می‌کنیم آیا این کاربر خاص اعلان را خوانده یا نه
        readBy: {
          where: { userId: userId }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // مپ کردن داده‌ها برای فهم راحت‌تر در سمت کلینت
    const formattedNotifs = notifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      createdAt: notif.createdAt,
      isRead: notif.readBy.length > 0 // اگر ردیفی بود یعنی خوانده شده
    }));

    return { success: true, data: formattedNotifs };
  } catch (error) {
    return { success: false, error: "خطا در دریافت اطلاعات." };
  }
}

// ۲. خوانده شدن یک یا همه اعلان‌ها
export async function markAsReadAction(userId: string, notificationIds: string[]) {
  try {
    for (const notifId of notificationIds) {
      await db.userNotificationRead.upsert({
        where: { userId_globalNotificationId: { userId, globalNotificationId: notifId } },
        update: { readAt: new Date() },
        create: { userId, globalNotificationId: notifId }
      });
    }
    revalidatePath('/'); // رفرش کردن دیتا در سمت سرور
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ۳. حذف اعلان برای کاربر جاری
export async function deleteNotificationAction(userId: string, notificationId: string) {
  try {
    await db.userNotificationRead.upsert({
      where: { userId_globalNotificationId: { userId, globalNotificationId: notificationId } },
      update: { isDeleted: true },
      create: { userId, globalNotificationId: notificationId, isDeleted: true }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}