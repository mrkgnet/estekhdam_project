'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteAdminComment(id: string) {
  try {
    // حذف کامنت بر اساس آیدی (چه پیام اصلی باشد چه پاسخ)
    await db.comment.delete({
      where: { id },
    });
    
    // رفرش کردن کش صفحه ادمین (مسیر پنل خود را اینجا بنویسید)
    revalidatePath("/adminp/comments"); 
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "ابتدا زیر مجموعه ها رو حذف کنید" };
  }
}
