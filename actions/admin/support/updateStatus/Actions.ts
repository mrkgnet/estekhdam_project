"use server";
import { db } from "@/lib/db";
// مسیر db خود را جایگزین کنید (مثلاً "@/lib/db" یا "@/prisma/db")

import { revalidatePath } from "next/cache";

export async function updateTicketStatusAction(ticketId: string, newStatus: any) {
  try {
    await db.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });

    // رفرش کردن کش صفحه برای نمایش وضعیت جدید
    revalidatePath(`/adminp/support/tickets/${ticketId}`); 
    return { success: true, message: "وضعیت تیکت با موفقیت تغییر کرد." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطا در تغییر وضعیت تیکت!" };
  }
}
