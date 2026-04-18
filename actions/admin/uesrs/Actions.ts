"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// 👇 پارامترهای صفحه، تعداد در صفحه و متن جستجو را دریافت می‌کنیم
export async function fetchDataUserAction(
  page: number = 1,
  limit: number = 10,
  searchQuery: string = ""
) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند لیست کاربران را مشاهده کند.",
      };
    }

    // محاسبه نقطه‌ی شروع (Skip)
    const skip = (page - 1) * limit;

    // ساخت شروط جستجو برای دیتابیس (اگر متنی سرچ شده باشد)
    const whereCondition: any = {};
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      // تبدیل کلمات فارسی به نقش‌های دیتابیس
      let roleSearch = undefined;
      if (query.includes("مدیر")) roleSearch = "admin";
      else if (query.includes("کاربر")) roleSearch = "user";

      whereCondition.OR = [
        { phoneNumber: { contains: query } },
        { email: { contains: query } },
        ...(roleSearch ? [{ role: roleSearch }] : []),
      ];
    }

    // 👇 اجرای همزمان دو کوئری: 1. گرفتن تعداد کل کاربران (برای دکمه‌های صفحه‌بندی) 2. گرفتن 10 کاربر این صفحه
    const [totalUsersCount, result] = await db.$transaction([
      db.user.count({ where: whereCondition }),
      db.user.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip: skip, // رد کردن رکوردهای صفحات قبل
        take: limit, // گرفتن فقط به تعداد مشخص شده (مثلا 10 تا)
        select: {
          id: true,
          phoneNumber: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(totalUsersCount / limit);

    return {
      success: true,
      data: result,
      totalCount: totalUsersCount,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("❌ Error in fetchDataUserAction:", error);
    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
