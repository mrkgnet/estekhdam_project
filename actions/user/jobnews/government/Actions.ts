"use server";

import { db } from "@/lib/db";

export async function fetchDataUserGovAction(page: number = 1, limit: number = 10, searchQuery: string = "") {
  try {
    const skip = (page - 1) * limit;

    // 🟢 ساخت فیلتر جستجو بر اساس عنوان یا نام سازمان
    const whereClause = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery } },
            { organization: { contains: searchQuery } },
          ],
        }
      : {};

    // 🟢 اجرای همزمان شمارش کل رکوردها و دریافت داده‌های صفحه‌بندی شده
    const [totalRecords, result] = await db.$transaction([
      db.governmentNews.count({ where: whereClause }),
      db.governmentNews.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    if (result.length === 0) {
      return { success: false, message: "هیچ خبری یافت نشد.", data: [], totalPages: 0 };
    }

    const serializedData = result.map((item) => ({
      ...item,
      startAt: item.startAt ? item.startAt.toISOString() : null,
      endAt: item.endAt ? item.endAt.toISOString() : null,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    }));

    return { 
      success: true, 
      data: serializedData, 
      totalPages // 👈 ارسال تعداد کل صفحات به فرانت‌اند
    };

  } catch (error) {
    console.error("❌ Error in fetchDataUserGovAction:", error);
    return { success: false, message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.", data: [], totalPages: 0 };
  }
}
