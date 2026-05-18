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
    const chapterIdEdit = formData.get("chapterId") as string;
    const validChapterIdEdit = chapterIdEdit === "" ? null : chapterIdEdit;
    const text = formData.get("questionText") as string;
    
    // ✅ دریافت و تبدیل categoryChapterId به Int
    const categoryChapterId = formData.get("categoryChapterId") as string;
    const validCategoryChapterId = 
      categoryChapterId && categoryChapterId.trim() !== "" 
        ? parseInt(categoryChapterId, 10) 
        : null;
    
    // دریافت نوع سوال از فرم ویرایش
    const questionTypeEdit = formData.get("questionType") as "SARASARI" | "TALIFI";
    
    // دریافت گزینه‌ها
    const option_0 = formData.get("option_0") as string;
    const option_1 = formData.get("option_1") as string;
    const option_2 = formData.get("option_2") as string;
    const option_3 = formData.get("option_3") as string;

    const oldCorrectAnswer = parseInt(formData.get("correctAnswer") as string);
    const correctAnswer = oldCorrectAnswer + 1;

    // دریافت توضیحات و نکات کنکوری (Rich Text Editor)
    const explanations = formData.get("answerText") as string;
    const examPoints = formData.get("examPoints") as string; 

    // اعتبارسنجی اولیه
    if (!id || !text || isNaN(correctAnswer)) {
      return { success: false, message: "اطلاعات ناقص است." };
    }

    const options = [option_0, option_1, option_2, option_3];

    // دریافت اطلاعات فعلی سوال برای بررسی تغییر فصل
    const existingQuestion = await db.question.findUnique({
      where: { id: id },
    });

    if (!existingQuestion) {
      return { success: false, message: "سوال یافت نشد." };
    }

    // محاسبه مجدد شماره سوال در صورت تغییر فصل
    let finalChapterOrder = existingQuestion.chapterOrder;

    if (existingQuestion.chapterId !== validChapterIdEdit) {
      if (validChapterIdEdit) {
        // اگر به فصل جدیدی منتقل شده، برود به عنوان سوال آخر آن فصل
        const countInNewChapter = await db.question.count({
          where: { chapterId: validChapterIdEdit },
        });
        finalChapterOrder = countInNewChapter + 1;
      } else {
        // اگر کلا از فصل خارج شده (بدون فصل شده)
        finalChapterOrder = null;
      }
    }

    // آپدیت در دیتابیس
    await db.question.update({
      where: { id: id },
      data: {
        questionText: text,
        chapterId: validChapterIdEdit, 
        categoryChapterId: validCategoryChapterId, // ✅ اضافه شد
        chapterOrder: finalChapterOrder,
        questionType: questionTypeEdit,
        options: options,
        correctAnswer: correctAnswer,
        answerText: explanations, 
        examPoints: examPoints, 
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
