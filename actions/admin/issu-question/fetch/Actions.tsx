"use server";

import { db } from "@/lib/db";

export default async function fetchIssueQuestionAdmin() {
  try {
    const issues = await db.questionIssue.findMany({
      where: {
        isRead: false, // فیلتر برای دریافت موارد خوانده‌نشده
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            questionCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: issues };
  } catch (error) {
    console.error("Error fetching issues:", error);
    return { success: false, message: "خطا در دریافت گزارش‌ها." };
  }
}
