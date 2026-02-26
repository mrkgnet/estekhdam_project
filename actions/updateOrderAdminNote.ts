// actions/updateOrderAdminNote.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderAdminNote(params: { orderId: string; adminNote: string }) {
  try {
    const { orderId } = params;
    const adminNote = (params.adminNote ?? "").trim();

    await db.order.update({
      where: { id: orderId },
      data: { adminNote },
    });

    // ✅ بعد از ذخیره، صفحه جزئیات و داشبورد کاربر رفرش دیتایی می‌گیرن
    revalidatePath(`/adminp/order-managment/${orderId}`);
    revalidatePath(`/dashboard`);

    return { ok: true as const };
  } catch (error) {
    console.error("Database Error (updateOrderAdminNote):", error);
    return { ok: false as const, error: "DB_ERROR" };
  }
}
