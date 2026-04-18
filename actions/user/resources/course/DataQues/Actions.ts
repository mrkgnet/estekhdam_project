"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataQues(id: string, step: number = 1, chapterId?: string, questionType?: string) {
  try {
    const currentUser = await infoCurentUser();

    let hasPurchased = false;

    // بررسی اینکه آیا کاربر این دوره را قبلا خریده/ثبت‌نام کرده است؟
    if (currentUser) {
      const order = await db.order.findFirst({
        where: {
          userId: currentUser.id,
          productId: id,
          // نکته مهم: وضعیت پرداخت موفق را بر اساس Enum خودتان تنظیم کنید
          // مثلا ممکن است COMPLETED یا SUCCESS یا PAID باشد
          status: "SUCCESS",
        },
      });

      if (order) {
        hasPurchased = true;
      }
    }

    // ۲. واکشی سرفصل‌های مربوط به این دوره (محصول)
    const chapters = await db.chapter.findMany({
      where: { productId: id },
      orderBy: { order: "asc" }, // مرتب‌سازی بر اساس ترتیب سرفصل
    });

    // === مدیریت محدودیت‌های مرحله ۵ به بعد ===
    if (step > 4) {
      if (!currentUser) {
        return {
          success: false,
          requiresAuth: true,
          message: "  لطفا وارد حساب کاربری خود شوید .",
          data: null,
          totalCount: 0,
          hasPurchased: false,
          chapters,
        };
      }
    }

    if (step > 6) {
      // ۲. اگر لاگین است اما دوره را نخریده
      if (!hasPurchased) {
        return {
          success: false,
          requiresPurchase: true, // فلگ جدید برای کلاینت
          message: "برای مشاهده ادامه سوالات، لطفا   دوره را خریداری کنید.",
          data: null,
          totalCount: 0,
          hasPurchased: false,
          chapters,
        };
      }
    }

    const whereCondition = {
      productId: id,
      ...(chapterId ? { chapterId: chapterId } : {}),
      ...(questionType ? { questionType: questionType  } : {}),
    };

    const totalCount = await db.question.count({
      where: whereCondition,
    });

    const question = await db.question.findFirst({
      where: whereCondition,
      orderBy: { createdAt: "asc" },
      skip: step - 1,
    });

    if (!question) {
      return { success: false, message: "سوالی یافت نشد.", data: null, totalCount, hasPurchased };
    }

    return {
      success: true,
      data: question,
      totalCount,
      hasPurchased, // ارسال این مقدار به کلاینت برای مدیریت دکمه "بعدی"
      chapters,
    };
  } catch (error) {
    console.error("❌ Error in fetchDataQues:", error);
    return {
      success: false,
      message: "خطا در برقراری ارتباط با دیتابیس",
      data: null,
      totalCount: 0,
      hasPurchased: false,
    };
  }
}
