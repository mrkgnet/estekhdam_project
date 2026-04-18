"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function replyTicketAdminAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    
    // ۱. بررسی لاگین بودن کاربر و ادمین بودن
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. شما ادمین نیستید." };
    }

    // ۲. استخراج داده‌ها از فرم
    const ticketId = formData.get("ticketId") as string;
    const message = formData.get("message") as string;

    if (!ticketId || !message || message.trim() === "") {
      return { success: false, message: "متن پیام نمی‌تواند خالی باشد." };
    }

    // ۳. آپدیت تیکت و ثبت پیام همزمان
    const updatedTicket = await db.ticket.update({
      where: { 
        id: ticketId,
        // نکته مهم: اینجا نباید userId را چک کنیم چون تیکت برای ادمین نیست!
      },
      data: {
        status: "ANSWERED", // چون ادمین پاسخ داده، وضعیت را به حالت "پاسخ داده شده" درمی‌آوریم
        messages: {
          create: {
            text: message,
            userId: currentUser.userId, // آیدی ادمین به عنوان نویسنده این پیام ثبت می‌شود
          }
        }
      }
    });

    // ۴. پاک کردن کش صفحه برای نمایش فوری پیام جدید
    // توجه: مسیر revalidatePath را دقیقاً مطابق با روت پنل ادمین خود تنظیم کنید
    revalidatePath(`/admin/support/tickets/${ticketId}`);

    return { 
      success: true, 
      message: "پاسخ شما با موفقیت ارسال شد.",
      timestamp: Date.now() // برای ریست کردن فرم در کلاینت (اگر نیاز داشتید)
    };

  } catch (error) {
    console.error("Error replying to ticket (Admin):", error);
    return { success: false, message: "خطایی در ارسال پیام رخ داد. مجددا تلاش کنید." };
  }
}
