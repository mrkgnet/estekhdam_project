"use server"
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
      return { questions: [], totalCount: 0 };
    }

    // 🔍 ساخت شرط جستجو
    const searchCondition = searchQuery
      ? {
          OR: [
            { questionText: { contains: searchQuery, mode: "insensitive" as const } },
            { answerText: { contains: searchQuery, mode: "insensitive" as const } },
            { chapter: { title: { contains: searchQuery, mode: "insensitive" as const } } },
          ],
        }
      : {};

    // 📊 محاسبه skip برای پیجینیشن
    const skip = (page - 1) * limit;

    // 🔢 دریافت تعداد کل سوالات (برای محاسبه تعداد صفحات)
    const totalCount = await db.question.count({
      where: {
        productId: id,
        ...searchCondition,
      },
    });

    // 📦 دریافت سوالات با پیجینیشن
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
      orderBy: {
        createdAt: "desc",
      },
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
  questionType?: QuestionType; // ✅ اضافه شدن فیلد نوع سوال
}

export default async function batchAddQuestionsAction(
  productId: string,
  chapterId: string | null,
  categoryChapterId: number | null,
  questionsData: BatchQuestionInput[]
) {
  try {
    if (!productId || !questionsData || questionsData.length === 0) {
      return { success: false, message: "اطلاعات ارسالی ناقص است." };
    }

    // آماده سازی داده ها برای ثبت گروهی
    const dataToInsert = questionsData.map((q) => ({
      productId,
      chapterId: chapterId || null,
      categoryChapterId: categoryChapterId || null,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: Number(q.correctAnswer),
      answerText: q.answerText || "",
      examPoints: q.examPoints || "",
      questionType: q.questionType || "TALIFI", // ✅ اختصاص پیش‌فرض یا مقدار ارسالی از سمت کلاینت
      isActive: true,
    }));

    // ثبت گروهی در دیتابیس با Prisma
    const created = await db.question.createMany({
      data: dataToInsert,
      skipDuplicates: true, // در صورت وجود خطای تکراری، رد شود
    });

    revalidatePath("/admin/products/[id]/questions", "page");

    return { 
      success: true, 
      message: `${created.count} سوال با موفقیت به صورت گروهی اضافه شد.` 
    };

  } catch (error) {
    console.error("Batch Add Error:", error);
    return { success: false, message: "خطایی در ثبت سوالات رخ داد." };
  }
}