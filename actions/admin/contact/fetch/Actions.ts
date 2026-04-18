"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataContactAction() {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return [];
    }

    // ۲. دریافت مستقیم اطلاعات از دیتابیس
    const contactsData = await db.contact.findMany({
      include: {
        // دریافت اطلاعات کاربری که پیام داده (در صورت لاگین بودن)
        user: {
          select: {
            email: true,
            phoneNumber: true, // فرض بر این است که فیلد موبایل یا ایمیل دارید
          },
        },
      },
      orderBy: {
        createdAt: "desc", // جدیدترین پیام‌ها در ابتدا
      },
    });

    return contactsData;
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت پیام‌های تماس با ما: ", error);
    return [];
  }
}
