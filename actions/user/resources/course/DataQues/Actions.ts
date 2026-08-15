"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataQues(
  id: string,
  step: number | string = 1,
  chapterId?: string,
  questionType?: string
) {
  try {
    const currentStep = Number(step) || 1;
    const currentUser = await infoCurentUser();
    const userId = currentUser?.id || (currentUser as any)?.userId;
    let hasActiveSubscription = false;

    // ۱. بررسی اشتراک فعال در دیتابیس
    if (userId) {
      const now = new Date();

      const activeSub = await db.userSubscription.findFirst({
        where: {
          userId: String(userId),
          isActive: true,
          endDate: {
            gt: now, // تاریخ انقضا نگذشته باشد
          },
        },
        orderBy: {
          endDate: "desc",
        },
      });

      if (activeSub) {
        hasActiveSubscription = true;
      }
    }

    // ۲. دریافت سرفصل‌ها
    const chapters = await db.chapter.findMany({
      where: { productId: id },
      orderBy: { order: "asc" },
    });

    // ۳. بررسی دسترسی از سوال ۶ به بعد (بیش از ۵ سوال رایگان)
    if (currentStep > 5) {
      if (!userId) {
        return {
          success: false,
          requiresAuth: true,
          message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
          data: null,
          totalCount: 0,
          hasActiveSubscription: false,
          hasPurchased: false,
          chapters,
        };
      }

      if (!hasActiveSubscription) {
        return {
          success: false,
          requiresSubscription: true,
          message: "برای مشاهده سوالات بعد از سوال ۵، نیاز به اشتراک فعال دارید.",
          data: null,
          totalCount: 0,
          hasActiveSubscription: false,
          hasPurchased: false,
          chapters,
        };
      }
    }

    // ۴. دریافت سوال
    const whereCondition = {
      productId: id,
      ...(chapterId ? { chapterId } : {}),
      ...(questionType ? { questionType } : {}),
    };

    const totalCount = await db.question.count({
      where: whereCondition,
    });

    const question = await db.question.findFirst({
      where: whereCondition,
      orderBy: [
        { createdAt: "asc" },
        { id: "asc" }
      ],
      skip: Math.max(0, currentStep - 1),
    });

    if (!question) {
      return {
        success: false,
        message: "سوالی یافت نشد.",
        data: null,
        totalCount,
        hasActiveSubscription,
        hasPurchased: hasActiveSubscription,
      };
    }

    return {
      success: true,
      data: question,
      totalCount,
      hasActiveSubscription,
      hasPurchased: hasActiveSubscription,
      chapters,
    };
  } catch (error) {
    console.error("❌ Error in fetchDataQues:", error);
    return {
      success: false,
      message: "خطا در برقراری ارتباط با سرور",
      data: null,
      totalCount: 0,
      hasActiveSubscription: false,
      hasPurchased: false,
    };
  }
}