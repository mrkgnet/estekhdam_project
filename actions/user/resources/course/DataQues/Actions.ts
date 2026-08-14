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
    // تبدیل قطعی step به عدد برای جلوگیری از خطای مقایسه String
    const currentStep = Number(step) || 1;
    const currentUser = await infoCurentUser();
    let hasActiveSubscription = false;

    // ۱. بررسی دقیق اشتراک فعال کاربر در دیتابیس
    if (currentUser?.id) {
      const now = new Date();
      const activeSub = await db.userSubscription.findFirst({
        where: {
          userId: currentUser.id,
          isActive: true,
          endDate: {
            gt: now, // تاریخ پایان اشتراک باید حتماً بعد از الان باشد
          },
        },
      });

      if (activeSub) {
        hasActiveSubscription = true;
      }
    }

    // ۲. سرفصل‌های دوره
    const chapters = await db.chapter.findMany({
      where: { productId: id },
      orderBy: { order: "asc" },
    });

    // ۳. قفل امنیتی: سوالات بعد از سوال ۵ (۶ به بعد)
    if (currentStep > 5) {
      // حالت اول: کاربر اصلاً لاگین نکرده است
      if (!currentUser) {
        return {
          success: false,
          requiresAuth: true,
          message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
          data: null,
          totalCount: 0,
          hasActiveSubscription: false,
          chapters,
        };
      }

      // حالت دوم: کاربر لاگین کرده اما اشتراک فعال ندارد
      if (!hasActiveSubscription) {
        return {
          success: false,
          requiresSubscription: true,
          message: "برای مشاهده سوالات ۵ به بعد، باید اشتراک فعال تهیه کنید.",
          data: null,
          totalCount: 0,
          hasActiveSubscription: false,
          chapters,
        };
      }
    }

    // ۴. دریافت سوال از دیتابیس (فقط در صورتی که مجاز باشد)
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
      };
    }

    return {
      success: true,
      data: question,
      totalCount,
      hasActiveSubscription,
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
    };
  }
}