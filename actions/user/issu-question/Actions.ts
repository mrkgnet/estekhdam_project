"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function addIssueQuestionUser(prevState: any, formData: FormData) {
  const questionId = (formData.get("questionId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  

  const errors: Record<string, string> = {};
  if (!questionId) errors.questionId = "شناسه سوال الزامی است";
  if (!description) errors.description = "توضیحات الزامی است";

  if (Object.keys(errors).length) {
    return { success: false, message: "خطا در اعتبارسنجی", errors };
  }

  const user = await infoCurentUser();
  if (!user) {
    return { success: false, message: "ابتدا وارد حساب شوید.", errors: {} };
  }

  try {
    const q = await db.question.findFirst({ where: { questionCode: questionId } });
    if (!q) return { success: false, message: "سوال یافت نشد", errors: {} };

   const newQuessIssu=  await db.questionIssue.create({
      data: {
        questionId: q.id,
        description,
      },
    });


    await db.notification.create({
      data: {
        type: "NEW_QPROBLEM", 
        message: `یک پیغام برای بخش مشکل سوالات `, // تغییر subject به title
        referenceId: newQuessIssu.id, // گرفتن آیدی از کانتکتی که بالا ساخته شد
        isRead: false
      }
    });


  

    

    revalidatePath("/"); // اگر لازم بود مسیر مخصوص سوال را بزن

    return { success: true, message: "گزارش با موفقیت ثبت شد.", errors: {} };
  } catch (error) {
    console.error("Error creating issue:", error);
    return { success: false, message: "خطا در ثبت گزارش.", errors: {} };
  }
}
