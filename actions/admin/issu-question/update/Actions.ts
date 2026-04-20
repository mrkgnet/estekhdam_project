"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function markAllIssuesRead() {
  try {
    await db.questionIssue.updateMany({
      where: { isRead: false }, // فقط آنهایی که خوانده نشده‌اند را آپدیت کن
      data: { isRead: true },
    });

    // کش آدرس را پاک کن (حتماً باید قبل از return باشد)
    revalidatePath("/adminp/question-issu");

    return { success: true };
  } catch (error) {
    console.error("Error marking all issues as read:", error);
    return { success: false, message: "خطا در بروزرسانی وضعیت." };
  }
}
