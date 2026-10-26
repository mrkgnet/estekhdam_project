"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, QuestionType } from "@prisma/client";
const PAGE_SIZE_MAX = 100;
async function checkAdmin() {
  const user = await infoCurentUser();
  return !!user && user.role === "admin";
}
// ============================================
// Fetch Questions
// ============================================
export async function fetchDataQuestion(
  id: string,
  page: number = 1,
  limit: number = 10,
  searchQuery?: string,
  referenceId?: string,
  specialOnly: boolean = false
) {
  const emptyResult = {
    questions: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  };
  try {
    if (!(await checkAdmin())) {
      return emptyResult;
    }
    const safePage =
      Number.isSafeInteger(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isSafeInteger(limit) && limit > 0
        ? Math.min(limit, PAGE_SIZE_MAX)
        : 10;
    const search = searchQuery?.trim().slice(0, 200);
    const where: Prisma.QuestionWhereInput = {
      productId: id,
      ...(specialOnly ? { isSpecial: true } : {}),
    };
    if (referenceId) {
      if (referenceId === "unassigned") {
        where.referenceId = null;
      } else {
        where.referenceId = referenceId;
      }
    }
    if (search) {
      where.OR = [
        {
          questionText: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          answerText: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          studyGuide: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          examPoints: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          questionCode: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          chapter: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          reference: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }
    const [totalCount, questions] = await db.$transaction([
      db.question.count({ where }),
      db.question.findMany({
        where,
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
          reference: {
            select: {
              id: true,
              title: true,
              slug: true,
              isActive: true,
            },
          },
        },
        orderBy: [
          { questionNumber: "desc" },
          { id: "desc" },
        ],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
    ]);
    return {
      questions,
      totalCount,
      currentPage: safePage,
      totalPages: Math.ceil(totalCount / safeLimit),
    };
  } catch (error) {
    console.error("Fetch Questions Error:", error);
    return emptyResult;
  }
}
// ============================================
// Fetch References
// ============================================
export async function fetchQuestionReferencesAction() {
  try {
    if (!(await checkAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
        data: [],
      };
    }
    const references = await db.questionReference.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        isActive: true,
      },
      orderBy: [
        { title: "asc" },
        { id: "asc" },
      ],
    });
    return {
      success: true,
      message: "لیست رفرنس‌ها دریافت شد.",
      data: references,
    };
  } catch (error) {
    console.error("Fetch References Error:", error);
    return {
      success: false,
      message: "خطا در دریافت رفرنس‌ها.",
      data: [],
    };
  }
}
// ============================================
// Update Question Reference
// ============================================
export async function updateQuestionReferenceIdAction(
  questionId: string,
  referenceId: string | null
) {
  try {
    if (!(await checkAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }
    if (!questionId) {
      return {
        success: false,
        message: "شناسه سؤال نامعتبر است.",
      };
    }
    const question = await db.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        productId: true,
        referenceId: true,
      },
    });
    if (!question) {
      return {
        success: false,
        message: "سؤال موردنظر یافت نشد.",
      };
    }
    const normalizedReferenceId = referenceId || null;
    if (normalizedReferenceId) {
      const reference = await db.questionReference.findUnique({
        where: {
          id: normalizedReferenceId,
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
        question.referenceId !== normalizedReferenceId
      ) {
        return {
          success: false,
          message: "امکان انتخاب رفرنس غیرفعال وجود ندارد.",
        };
      }
    }
    const updated = await db.question.update({
      where: {
        id: questionId,
      },
      data: {
        referenceId: normalizedReferenceId,
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
    revalidatePath(`/adminp/questions/${updated.productId}`);
    return {
      success: true,
      message: "رفرنس سؤال با موفقیت ذخیره شد.",
      data: updated,
    };
  } catch (error) {
    console.error("Update Reference Error:", error);
    return {
      success: false,
      message: "خطا در ذخیره رفرنس سؤال.",
    };
  }
}
// ============================================
// Batch Add Questions
// ============================================
interface BatchQuestionInput {
  questionText: string;
  options: string[];
  correctAnswer: number;
  answerText?: string;
  examPoints?: string;
  studyGuide?: string;
  questionType?: QuestionType;
  questionCode?: string;
  referenceId?: string | null;
}
export default async function batchAddQuestionsAction(
  productId: string,
  chapterId: string | null,
  categoryChapterId: number | null,
  questionsData: BatchQuestionInput[]
) {
  try {
    if (!(await checkAdmin())) {
      return {
        success: false,
        message: "عدم دسترسی. شما ادمین نیستید.",
      };
    }
    if (
      !productId ||
      !Array.isArray(questionsData) ||
      questionsData.length === 0
    ) {
      return {
        success: false,
        message: "اطلاعات ارسالی ناقص است.",
      };
    }
    // اعتبارسنجی رفرنس‌های انتخاب‌شده
    const referenceIds = Array.from(
      new Set(
        questionsData
          .map((q) => q.referenceId)
          .filter((value): value is string => !!value)
      )
    );
    if (referenceIds.length > 0) {
      const activeReferences =
        await db.questionReference.findMany({
          where: {
            id: { in: referenceIds },
            isActive: true,
          },
          select: {
            id: true,
          },
        });
      if (activeReferences.length !== referenceIds.length) {
        return {
          success: false,
          message:
            "یک یا چند رفرنس انتخاب‌شده نامعتبر یا غیرفعال هستند.",
        };
      }
    }
    const dataToInsert: Prisma.QuestionCreateManyInput[] =
      questionsData.map((q) => ({
        productId,
        chapterId: chapterId || null,
        categoryChapterId: categoryChapterId ?? null,
        referenceId: q.referenceId || null,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: Number(q.correctAnswer),
        answerText: q.answerText || null,
        examPoints: q.examPoints || null,
        studyGuide: q.studyGuide || null,
        questionType: q.questionType || QuestionType.TALIFI,
        questionCode: q.questionCode || null,
        isActive: true,
      }));
    const created = await db.question.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
    revalidatePath(`/adminp/questions/${productId}`);
    return {
      success: true,
      message: `${created.count} سؤال با موفقیت ثبت شد.`,
    };
  } catch (error) {
    console.error("Batch Add Error:", error);
    return {
      success: false,
      message: "خطایی در ثبت سؤالات رخ داد.",
    };
  }
}

// ============================================
// Update Admin Special Question
// ============================================
export async function updateQuestionSpecialAction(
  questionId: string,
  productId: string,
  isSpecial: boolean
) {
  try {
    if (!(await checkAdmin())) {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    if (!questionId?.trim() || !productId?.trim() || typeof isSpecial !== "boolean") {
      return { success: false, message: "اطلاعات سؤال نامعتبر است." };
    }

    const result = await db.question.updateMany({
      where: { id: questionId, productId },
      data: { isSpecial },
    });

    if (result.count === 0) {
      return { success: false, message: "سؤال موردنظر یافت نشد." };
    }

    revalidatePath(`/adminp/questions/${productId}`);

    return {
      success: true,
      message: isSpecial ? "سؤال ویژه شد." : "سؤال از حالت ویژه خارج شد.",
      isSpecial,
    };
  } catch (error) {
    console.error("Update Special Question Error:", error);
    return { success: false, message: "خطا در ذخیره وضعیت ویژه سؤال." };
  }
}
