import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

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
