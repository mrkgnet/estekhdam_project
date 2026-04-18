// actions/user/dashboard/support/fetch/[id]/Actions.ts
"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchUniqTicketUserAction(ticketId: string) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید.",
        ticket: null,
      };
    }

    // خواندن یک تیکت خاص + پیام‌های داخل آن
    const ticket = await db.ticket.findFirst({
      where: { 
        id: ticketId, 
        userId: currentUser.id // امنیت: حتما تیکت مال همین کاربر باشد
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }, // پیام‌ها از قدیمی به جدید مرتب شوند (مثل چت)
        },
      },
    });

    if (!ticket) {
      return {
        success: false,
        message: "تیکت مورد نظر یافت نشد یا شما دسترسی به آن ندارید.",
        ticket: null,
      };
    }

    return {
      success: true,
      message: "اطلاعات تیکت دریافت شد.",
      ticket: ticket,
    };
  } catch (error) {
    console.error("Error fetching unique ticket:", error);
    return {
      success: false,
      message: "خطایی در دریافت اطلاعات تیکت رخ داد.",
      ticket: null,
    };
  }
}
