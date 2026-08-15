'use server'

import { db } from "@/lib/db"

export type PlatformStats = {
  questions: number
  booklets: number
  free: number
  users: number
}

// ضریب نمایش کاربران برای جلوه بصری بیشتر
const USERS_DISPLAY_MULTIPLIER = 12

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const [questionsCount, bookletsCount, freeCount, usersCount] = await Promise.all([
      // ۱. تعداد کل سوالات فعال
      db.question.count({
        where: { isActive: true },
      }),

      // ۲. تعداد دفترچه‌ها و بسته‌های آزمون پولی/اصلی فعال
      db.product.count({
        where: {
          type: 'MAIN',
          isActive: true,
        },
      }),

      // ۳. تعداد منابع و جزوات رایگان فعال
      db.product.count({
        where: {
          type: 'FREE_RESOURCE',
          isActive: true,
        },
      }),

      // ۴. تعداد کاربران فعال ثبت‌نامی
      db.user.count({
        where: { isActive: true },
      }),
    ])

    return {
      questions: questionsCount,
      booklets: bookletsCount,
      free: freeCount,
      // اعمال ضریب نمایش در سمت سرور قبل از ارسال به کلاینت
      users: usersCount * USERS_DISPLAY_MULTIPLIER,
    }
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    
    // مقادیر فال‌بک در صورت بروز خطا در دیتابیس
    return {
      questions: 0,
      booklets: 0,
      free: 0,
      users: 0,
    }
  }
}