// actions/getAdminComments.ts
"use server"

import { db } from "@/lib/db";

export async function getAdminComments({
  query = "",
  page = 1,
  limit = 10,
  unreadOnly = false,
}: {
  query?: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      parentId: null,
    };

    // سرچ در متن کامنت یا شماره تلفن یا ایمیل کاربر
    if (query) {
      whereCondition.OR = [
        { textComment: { contains: query, mode: "insensitive" } },
        { user: { phoneNumber: { contains: query, mode: "insensitive" } } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ];
    }

    // 🔴 فیلتر منطقی پیام‌های خوانده نشده
    // کامنت والد خوانده نشده باشد، *یا* پاسخی در آن وجود داشته باشد که خوانده نشده باشد
    if (unreadOnly) {
      whereCondition.OR = [
        ...(whereCondition.OR || []), // اگر از قبل کوئری سرچ بود نگه دار
        { isRead: false },
        { replies: { some: { isRead: false } } }
      ];
    }

    const totalCount = await db.comment.count({
      where: whereCondition,
    });

    const comments = await db.comment.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        // 🔴 دیتای مورد نیاز UI را ضمیمه کنید
        user: { select: { phoneNumber: true, email: true } },
        product: { select: { name: true } },
        _count: { select: { replies: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
             user: { select: { phoneNumber: true, email: true } }
          }
        }, 
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      comments,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("خطا در دریافت نظرات");
  }
}
