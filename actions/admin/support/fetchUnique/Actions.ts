// مسیر: actions/admin/support/fetchUnique/Actions.ts
"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataUTAAction(ticketId: string) {
  try {

    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied1: User is not admin");
      return null; // برای یک آیتم تکی، در صورت خطا null برمی‌گردانیم
    }

    // ۲. دریافت تیکت خاص همراه با کاربر و پیام‌ها
    const ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        // اطلاعات کاربری که تیکت را ساخته
        user: {
          select: {
            phoneNumber: true,
            email: true,
            // اگر فیلد name در مدل User دارید، اینجا اضافه کنید:
            // name: true, 
          },
        },
        // دریافت تاریخچه پیام‌های این تیکت
        messages: {
          orderBy: {
            createdAt: "asc", // مرتب‌سازی از قدیمی‌ترین به جدیدترین پیام
          },
          include: {
            // اطلاعات نویسنده هر پیام را هم می‌گیریم تا بفهمیم پیام ادمین است یا کاربر
            user: {
              select: {
                role: true, 
                // name: true,
              }
            }
          }
        },
      },
    });


    return ticket;
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت تیکت تکی از دیتابیس: ", error);
    return null; 
  }
}
