'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markCommentAsRead(id: string) {
  try {
    await db.comment.update({
      where: { id },
      data: { isRead: true },
    });
    
    // مسیر صفحه ادمین نظرات خود را اینجا قرار دهید تا صفحه رفرش شود
    revalidatePath("/adminp/comments"); 
    
    return { success: true };
  } catch (error) {
    console.error("Error updating read status:", error);
    return { success: false, error: "خطا در بروزرسانی وضعیت" };
  }
}
