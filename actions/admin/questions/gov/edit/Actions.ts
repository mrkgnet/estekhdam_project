"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editQuestionAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز" };
    }

    // دریافت داده‌ها از فرم ویرایش
    const id = formData.get("id") as string;
    const productId = formData.get("productId") as string;
    const chapterIdEdit = formData.get("chapterIdEdit") as string;
    const text = formData.get("questionTextEdit") as string;
    
    // 👇 دریافت نوع سوال از فرم ویرایش 👇
    const questionTypeEdit = formData.get("questionTypeEdit") as "SARASARI" | "TALIFI";
    
    // دریافت گزینه‌ها
    const option_0 = formData.get("optionEdit_0") as string;
    const option_1 = formData.get("optionEdit_1") as string;
    const option_2 = formData.get("optionEdit_2") as string;
    const option_3 = formData.get("optionEdit_3") as string;

    const oldCorrectAnswer = parseInt(formData.get("correctAnswerEdit") as string);
    const correctAnswer = oldCorrectAnswer + 1;

    const explanations = formData.get("answerTextEdit") as string;

    // اعتبارسنجی اولیه
    if (!id || !text || isNaN(correctAnswer)) {
      return { success: false, message: "اطلاعات ناقص است." };
    }

    const options = [option_0, option_1, option_2, option_3];

    // آپدیت در دیتابیس
    await db.question.update({
      where: { id: id },
      data: {
        questionText: text,
        chapterId: chapterIdEdit === "" ? null : chapterIdEdit, 
        // 👇 اضافه کردن نوع سوال به دیتای آپدیت 👇
        questionType: questionTypeEdit,
        options: options,
        correctAnswer: correctAnswer,
        answerText: explanations, 
      },
    });

    // بروزرسانی کش صفحه برای نمایش تغییرات
    revalidatePath(`/adminp/questions/${productId}`);

    return { success: true, message: "سوال با موفقیت ویرایش شد." };
  } catch (error) {
    console.error("Error updating question:", error);
    return { success: false, message: "خطا در ویرایش سوال." };
  }
}
