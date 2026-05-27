"use server";

import { db } from "@/lib/db";

// ۱. سرور اکشن برای ایجاد اعلان همگانی جدید (استفاده در فرم اکشن)
export async function addGlobalNotificationAction(formData: FormData) {
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;

  // اعتبارسنجی اولیه داده‌ها
  if (!title?.trim() ) {
    return { success: false, error: "عنواننمی‌تواند خالی باشد." };
  }

  try {
    const newNotification = await db.globalNotification.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        isActive: true,
      },
    });

    // برگرداندن داده به کلاینت (به همراه تبدیل به Plain Object برای جلوگیری از ارورهای Next.js)
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(newNotification)) 
    };
  } catch (error) {
    console.error("❌ Error adding global notification:", error);
    return { success: false, error: "خطایی در ثبت اطلاعات در دیتابیس رخ داد." };
  }
}

// ۲. سرور اکشن برای تغییر وضعیت فعال/غیرفعال بودن اعلان
export async function toggleNotificationStatusAction(id: string, currentStatus: boolean) {
  try {
    const updated = await db.globalNotification.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("❌ Error toggling status:", error);
    return { success: false, error: "خطا در تغییر وضعیت نمایش." };
  }
}

// ۳. سرور اکشن برای حذف کامل اعلان
export async function deleteGlobalNotificationAction(id: string) {
  try {
    await db.globalNotification.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    return { success: false, error: "خطا در حذف اعلان از دیتابیس." };
  }
}