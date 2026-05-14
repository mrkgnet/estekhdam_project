"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function replyTicketUserAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    
    // ۱. بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return { success: false, message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید." };
    }

    // ۲. استخراج داده‌ها از فرم
    const ticketId = formData.get("ticketId") as string;
    const message = formData.get("message") as string;

  

    if (!ticketId || !message || message.trim() === "") {
      return { success: false, message: "متن پیام نمی‌تواند خالی باشد." };
    }

    // ۳. بررسی مالکیت تیکت و ثبت پیام همزمان
    // استفاده از آپدیت تیکت برای اطمینان از اینکه تیکت مال این کاربر است
    const updatedTicket = await db.ticket.update({
      where: { 
        id: ticketId,
        userId: currentUser.userId // امنیت: تیکت باید برای همین کاربر باشد
      },
      data: {
        status: "OPEN", // چون کاربر پیام داده، وضعیت را به حالت باز/منتظر پاسخ ادمین درمی‌آوریم
        messages: {
          create: {
            text: message,
            userId: currentUser.userId,
          }
        }
      }
    });

    // ۴. پاک کردن کش صفحه برای نمایش فوری پیام جدید
    revalidatePath(`/ddashboard/support/tickets/${ticketId}`);

    return { 
      success: true, 
      message: "پیام شما با موفقیت ارسال شد.",
      timestamp: Date.now() // برای ریست کردن فرم در کلاینت
    };

  } catch (error) {
    console.error("Error replying to ticket:", error);
    return { success: false, message: "خطایی در ارسال پیام رخ داد. مجددا تلاش کنید." };
  }
}
