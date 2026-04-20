"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// اگر در فایل اکشن به enum نیاز داشتید می‌توانید از Prisma ایمپورت کنید
// import { QuestionType } from "@prisma/client";

export default async function addGovQuestion(prevState: any, formData: FormData) {
  const currentUser = await infoCurentUser();

  if (!currentUser || currentUser.role !== "admin") {
    console.log("❌ Access denied: User is not admin");
    return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ایجاد کند." };
  }

  const questionText = formData.get("questionText") as string;
  const answerText = formData.get("answerText") as string;
  const productId = formData.get("productId") as string;

  // 👇 دریافت نوع سوال از فرم (اجباری) 👇
  const questionType = formData.get("questionType") as "SARASARI" | "TALIFI";

  const chapterId = formData.get("chapterId") as string;
  const validChapterId = chapterId && chapterId.trim() !== "" ? chapterId : undefined;

  const oldCorrectAnswer = parseInt(formData.get("correctAnswer") as string);
  const correctAnswer = oldCorrectAnswer + 1;

  const options = [
    formData.get("option_0") as string,
    formData.get("option_1") as string,
    formData.get("option_2") as string,
    formData.get("option_3") as string,
  ];
  const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    await db.question.create({
      data: {
        questionText: questionText,
        options: options,
        answerText: answerText,
        correctAnswer: correctAnswer,
        productId: productId,
        chapterId: validChapterId,
        questionCode: uniqueCode,
        questionType: questionType,
      },
    });

    revalidatePath(`/adminp/questions/${productId}`);

    return { success: true, message: "سوال با موفقیت ثبت شد." };
  } catch (error) {
    console.error("Error creating question:", error);
    return { success: false, message: "خطا در ثبت سوال." };
  }
}
