
"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { QuestionType } from "@prisma/client";

// ============================================
// Helpers
// ============================================

function getFormString(
  formData: FormData,
  name: string
): string {
  const value = formData.get(name);

  return typeof value === "string"
    ? value.trim()
    : "";
}

// ============================================
// Edit Question Action
// ============================================

export async function editGovQuestion(
  prevState: any,
  formData: FormData
) {
  try {
    // ========================================
    // Authorization
    // ========================================

    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    // ========================================
    // Basic Fields
    // ========================================

    const id =
      getFormString(formData, "id") ||
      getFormString(formData, "questionId");

    const productId = getFormString(
      formData,
      "productId"
    );

    const questionText = getFormString(
      formData,
      "questionText"
    );

    const chapterId =
      getFormString(formData, "chapterId") || null;

    const rawCategoryChapterId = getFormString(
      formData,
      "categoryChapterId"
    );

    const categoryChapterId = rawCategoryChapterId
      ? Number(rawCategoryChapterId)
      : null;

    // ========================================
    // Reference Field
    // ========================================

    const referenceFieldExists =
      formData.has("referenceId");

    const rawReferenceId = getFormString(
      formData,
      "referenceId"
    );

    const selectedReferenceId =
      rawReferenceId || null;

    // ========================================
    // Question Type
    // ========================================

    const rawQuestionType = getFormString(
      formData,
      "questionType"
    );

    const questionType =
      rawQuestionType || QuestionType.TALIFI;

    // ========================================
    // Options
    // ========================================

    const options = [
      getFormString(formData, "option_0"),
      getFormString(formData, "option_1"),
      getFormString(formData, "option_2"),
      getFormString(formData, "option_3"),
    ];

    const rawCorrectAnswer = getFormString(
      formData,
      "correctAnswer"
    );

    const oldCorrectAnswer = Number(
      rawCorrectAnswer
    );

    // فرم فعلی از اندیس صفر استفاده می‌کند
    const correctAnswer = oldCorrectAnswer + 1;

    // ========================================
    // Additional Fields
    // ========================================

    const answerText = getFormString(
      formData,
      "answerText"
    );

    const examPoints = getFormString(
      formData,
      "examPoints"
    );

    const studyGuide = getFormString(
      formData,
      "studyGuide"
    );

    // ========================================
    // Validation
    // ========================================

    if (!id || !productId || !questionText) {
      return {
        success: false,
        message: "اطلاعات اصلی سؤال ناقص است.",
      };
    }

    if (
      rawCorrectAnswer === "" ||
      !Number.isInteger(oldCorrectAnswer) ||
      oldCorrectAnswer < 0 ||
      oldCorrectAnswer >= options.length
    ) {
      return {
        success: false,
        message: "پاسخ صحیح سؤال نامعتبر است.",
      };
    }

    if (
      categoryChapterId !== null &&
      (!Number.isInteger(categoryChapterId) ||
        categoryChapterId <= 0)
    ) {
      return {
        success: false,
        message: "دسته‌بندی انتخاب‌شده نامعتبر است.",
      };
    }

    if (
      questionType !== QuestionType.TALIFI &&
      questionType !== QuestionType.SARASARI
    ) {
      return {
        success: false,
        message: "نوع سؤال نامعتبر است.",
      };
    }

    // ========================================
    // Existing Question
    // ========================================

    const existingQuestion =
      await db.question.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          productId: true,
          chapterId: true,
          chapterOrder: true,
          referenceId: true,
        },
      });

    if (!existingQuestion) {
      return {
        success: false,
        message: "سؤال موردنظر یافت نشد.",
      };
    }

    if (existingQuestion.productId !== productId) {
      return {
        success: false,
        message: "شناسه محصول با سؤال مطابقت ندارد.",
      };
    }

    // ========================================
    // Reference Validation
    // ========================================

    // سازگاری با فرم‌های قدیمی:
    // اگر referenceId ارسال نشده باشد،
    // رفرنس قبلی سؤال بدون تغییر باقی می‌ماند.
    const finalReferenceId = referenceFieldExists
      ? selectedReferenceId
      : existingQuestion.referenceId;

    if (finalReferenceId) {
      const reference =
        await db.questionReference.findUnique({
          where: {
            id: finalReferenceId,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

      if (!reference) {
        return {
          success: false,
          message: "رفرنس انتخاب‌شده وجود ندارد.",
        };
      }

      if (
        !reference.isActive &&
        existingQuestion.referenceId !== finalReferenceId
      ) {
        return {
          success: false,
          message:
            "امکان انتخاب رفرنس غیرفعال وجود ندارد.",
        };
      }
    }

    // ========================================
    // Chapter Order
    // ========================================

    let finalChapterOrder =
      existingQuestion.chapterOrder;

    if (existingQuestion.chapterId !== chapterId) {
      if (chapterId) {
        const countInNewChapter =
          await db.question.count({
            where: {
              chapterId,
              productId,
            },
          });

        finalChapterOrder = countInNewChapter + 1;
      } else {
        finalChapterOrder = null;
      }
    }

    // ========================================
    // Update Database
    // ========================================

    const updatedQuestion = await db.question.update({
      where: {
        id,
      },
      data: {
        questionText,

        chapterId,
        categoryChapterId,
        chapterOrder: finalChapterOrder,

        questionType: questionType as QuestionType,

        options,
        correctAnswer,

        answerText,
        examPoints,
        studyGuide,

        // ذخیره رفرنس انتخاب‌شده
        referenceId: finalReferenceId,
      },

      select: {
        id: true,
        productId: true,
        referenceId: true,

        reference: {
          select: {
            id: true,
            title: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    // ========================================
    // Revalidation
    // ========================================

    revalidatePath(
      `/adminp/questions/${updatedQuestion.productId}`
    );

    return {
      success: true,
      message: "سؤال با موفقیت ویرایش شد.",
      data: updatedQuestion,
    };
  } catch (error) {
    console.error("Error updating question:", error);

    return {
      success: false,
      message: "خطا در ویرایش سؤال.",
    };
  }
}
