"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function importQuestionsAction(
  productId: string, 
  categoryChapterId: number
) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین." };
    }

    // ۱. واکشی سوالات منبع
    const sourceQuestions = await db.question.findMany({
      where: { categoryChapterId: categoryChapterId },
    });

    if (sourceQuestions.length === 0) {
      return { success: false, message: "هیچ سوالی در این دسته‌بندی برای کپی کردن یافت نشد." };
    }

    // ۲. واکشی سوالات فعلی محصول برای جلوگیری از تکرار
    const existingQuestions = await db.question.findMany({
      where: { productId: productId },
      select: { questionText: true }
    });

    // ایجاد یک Set از متن سوالات برای جستجوی سریع‌تر
    const existingTexts = new Set(existingQuestions.map(q => q.questionText));

    // ۳. فیلتر کردن سوالاتی که از قبل وجود ندارند
    const newQuestions = sourceQuestions.filter(q => !existingTexts.has(q.questionText));

    if (newQuestions.length === 0) {
      return { success: true, message: "تمام سوالات این دسته‌بندی از قبل در این محصول وجود دارند. سوال جدیدی یافت نشد." };
    }

    // ۴. آماده‌سازی داده‌های جدید
    const newQuestionsData = newQuestions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      answerText: q.answerText,
      examPoints: q.examPoints,
      questionType: q.questionType,
      isActive: q.isActive,
      questionCode: Math.random().toString(36).substring(2, 8).toUpperCase(), 
      productId: productId,
      categoryChapterId: categoryChapterId,
      chapterId: q.chapterId, // اگر می‌خواهید سرفصل هم منتقل شود
    }));

    // ۵. درج سوالات جدید
    const insResult = await db.question.createMany({
      data: newQuestionsData,
    });

    // ۶. رفرش کش
    revalidatePath(`/adminp/questions/${productId}`);

    return { 
      success: true, 
      message: `${insResult.count} سوال جدید با موفقیت به این محصول اضافه شد.` 
    };

  } catch (error) {
    console.error("خطا در ایمپورت سوالات:", error);
    return { success: false, message: "خطایی در دیتابیس رخ داد." };
  }
}
