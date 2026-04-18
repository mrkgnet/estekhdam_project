"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addAdminReply(commentId: string, replyText: string) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ایجاد کند." };
    }

    if (!replyText.trim()) {
      return { success: false, error: "متن پاسخ نمی‌تواند خالی باشد." };
    }

    // ۱. ابتدا کامنت والد را پیدا میکنیم تا بفهمیم برای کدام محصول است
    const parentComment = await db.comment.findUnique({
      where: { id: commentId },
      select: { productId: true },
    });

    if (!parentComment) {
      return { success: false, error: "کامنت اصلی یافت نشد." };
    }

    // ۲. ثبت پاسخ جدید به عنوان ادمین
    await db.comment.create({
      data: {
        textComment: replyText,
        parentId: commentId,
        productId: parentComment.productId, // ارث‌بری آیدی محصول از کامنت والد
        status: "APPROVED", // پاسخ ادمین نیاز به تایید ندارد
        // userId: adminUserId, // اگر آیدی ادمین را دارید اینجا پاس دهید
      },
    });

    // ۳. آپدیت کردن کش صفحه ادمین
    revalidatePath("/adminp/comments"); // مسیر پنل ادمین شما

    return { success: true };
  } catch (error) {
    console.error("Admin reply error:", error);
    return { success: false, error: "خطا در ثبت پاسخ سرور" };
  }
}
