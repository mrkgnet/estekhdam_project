"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 10; // تعداد تیکت‌ها در هر صفحه

export async function fetchTicketUserAction(page: number = 1) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید.",
        tickets: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          pageSize: PAGE_SIZE,
        },
      };
    }

    const validPage = Math.max(1, Number(page) || 1);
    const skip = (validPage - 1) * PAGE_SIZE;

    // واکشی هم‌زمان تعداد کل و رکوردهای صفحه جاری
    const [totalCount, userTickets] = await Promise.all([
      db.ticket.count({
        where: { userId: currentUser.id },
      }),
      db.ticket.findMany({
        where: { userId: currentUser.id },
        orderBy: { updatedAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    return {
      success: true,
      message: "تیکت‌ها با موفقیت دریافت شدند",
      tickets: userTickets,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalCount,
        pageSize: PAGE_SIZE,
      },
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return {
      success: false,
      message: "خطایی در دریافت تیکت‌ها رخ داد.",
      tickets: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }
}

// 🔴 اکشن حذف تیکت توسط کاربر
export async function deleteTicketUserAction(ticketId: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "user") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید.",
      };
    }

    if (!ticketId) {
      return {
        success: false,
        message: "شناسه تیکت نامعتبر است.",
      };
    }

    // بررسی وجود تیکت و تطابق با کاربر جاری برای امنیت
    const existingTicket = await db.ticket.findFirst({
      where: {
        id: ticketId,
        userId: currentUser.id,
      },
    });

    if (!existingTicket) {
      return {
        success: false,
        message: "تیکت مورد نظر یافت نشد یا شما دسترسی حذف آن را ندارید.",
      };
    }

    // حذف تیکت (در صورت نیاز رکوردهای پیام وابسته نیز اگر cascade نباشد با transaction حذف می‌شوند)
    await db.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    revalidatePath("/ddashboard/support/tickets");

    return {
      success: true,
      message: "تیکت با موفقیت حذف شد.",
    };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return {
      success: false,
      message: "خطایی در حذف تیکت رخ داد. لطفاً مجدداً تلاش کنید.",
    };
  }
}