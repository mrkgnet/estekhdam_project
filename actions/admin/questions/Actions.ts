"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { QuestionType } from "@prisma/client";

// ================= FETCH DATA QUESTION =================
export async function fetchDataQuestion(
  id: string,
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return { questions: [], totalCount: 0, currentPage: 1, totalPages: 0 };
    }

    // 🔍 ساخت شرط جستجو (شامل متن سوال، پاسخ، درس‌نامه، نکات و کد سوال)
    const searchCondition = searchQuery
      ? {
          OR: [
            { questionText: { contains: searchQuery, mode: "insensitive" as const } },
            { answerText: { contains: searchQuery, mode: "insensitive" as const } },
            { studyGuide: { contains: searchQuery, mode: "insensitive" as const } }, // ✅ اضافه شد
            { examPoints: { contains: searchQuery, mode: "insensitive" as const } }, // ✅ اضافه شد
            { questionCode: { contains: searchQuery, mode: "insensitive" as const } }, // ✅ اضافه شد
            { chapter: { title: { contains: searchQuery, mode: "insensitive" as const } } },
          ],
        }
      : {};

    // 📊 محاسبه skip برای صفحه‌بندی
    const skip = (page - 1) * limit;

    // 🔢 دریافت تعداد کل سوالات
    const totalCount = await db.question.count({
      where: {
        productId: id,
        ...searchCondition,
      },
    });

    // 📦 دریافت سوالات با صفحه‌بندی
    const questionData = await db.question.findMany({
      where: {
        productId: id,
        ...searchCondition,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        categoryChapter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          questionNumber: "desc",
        },
        {
          id: "desc",
        },
      ],
      skip,
      take: limit,
    });

    return {
      questions: questionData,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت سوالات از دیتابیس: ", error);
    return { questions: [], totalCount: 0, currentPage: 1, totalPages: 0 };
  }
}

// ================= BATCH ADD QUESTIONS ACTION =================

interface BatchQuestionInput {
  questionText: string;
  options: string[];
  correctAnswer: number;
  answerText?: string;
  examPoints?: string;
  studyGuide?: string; // ✅ اضافه شدن فیلد درس‌نامه به ورودی ثبت گروهی
  questionType?: QuestionType;
  questionCode?: string;
}

export default async function batchAddQuestionsAction(
  productId: string,
  chapterId: string | null,
  categoryChapterId: number | null,
  questionsData: BatchQuestionInput[]
) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "عدم دسترسی. شما ادمین نیستید." };
    }

    if (!productId || !questionsData || questionsData.length === 0) {
      return { success: false, message: "اطلاعات ارسالی ناقص است." };
    }

    // آماده‌سازی داده‌ها برای ثبت گروهی در دیتابیس
    const dataToInsert = questionsData.map((q) => ({
      productId,
      chapterId: chapterId || null,
      categoryChapterId: categoryChapterId || null,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: Number(q.correctAnswer),
      answerText: q.answerText || null,
      examPoints: q.examPoints || null,
      studyGuide: q.studyGuide || null, // ✅ ذخیره فیلد درس‌نامه
      questionType: q.questionType || "TALIFI",
      questionCode: q.questionCode || null,
      isActive: true,
    }));

    // ثبت گروهی در دیتابیس با Prisma
    const created = await db.question.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });

    revalidatePath(`/adminp/questions/${productId}`);

    return {
      success: true,
      message: `${created.count} سوال با موفقیت به صورت گروهی اضافه شد.`,
    };
  } catch (error) {
    console.error("Batch Add Error:", error);
    return { success: false, message: "خطایی در ثبت سوالات رخ داد." };
  }
}