"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchTicketUserAction() {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید.",
        tickets: [] // یک آرایه خالی برمی‌گردانیم تا صفحه ارور ندهد
      };
    }

    // خواندن تیکت‌های کاربر از دیتابیس
    const userTickets = await db.ticket.findMany({
      where: { userId: currentUser.id },
      orderBy: { updatedAt: "desc" }, // جدیدترین‌ها در بالا
    });

    return {
      success: true,
      message: "تیکت‌ها با موفقیت دریافت شدند",
      tickets: userTickets,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return {
      success: false,
      message: "خطایی در دریافت تیکت‌ها رخ داد.",
      tickets: []
    };
  }
}
