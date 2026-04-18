// مسیر فرضی: actions/admin/support/fetch/Actions.ts
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataTicketADAction() {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return [];
    }

    // ۲. دریافت لیست تمامی تیکت‌ها از دیتابیس
    const tickets = await db.ticket.findMany({
      orderBy: {
        createdAt: "desc", // مرتب‌سازی: جدیدترین‌ها در ابتدا
      },
      include: {
        user: {
          select: {
            phoneNumber: true,    // فرض بر اینکه در مدل User فیلد name دارید
            email: true,   // فرض بر اینکه فیلد email دارید
          },
        },
        // اگر می‌خواهید تعداد پیام‌های هر تیکت را هم نشان دهید:
        _count: {
          select: { messages: true },
        },
      },
    });

    // ۳. برگرداندن مستقیم دیتا
    return tickets;
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت تیکت‌ها از دیتابیس: ", error);
    return []; // در صورت خطا، آرایه خالی برمی‌گردانیم
  }
}
