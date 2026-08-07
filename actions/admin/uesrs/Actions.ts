// actions/admin/uesrs/Actions.ts
"use server";

import { db } from "@/lib/db"; // مسیر فایل Prisma Client پروژه شما

export async function fetchDataUserAction(
  currentPage: number = 1,
  limit: number = 10,
  searchQuery: string = ""
) {
  try {
    const skip = (currentPage - 1) * limit;

    const where = searchQuery
      ? {
          OR: [
            { phoneNumber: { contains: searchQuery } },
            { email: { contains: searchQuery } },
            { firstName: { contains: searchQuery } },
            { lastName: { contains: searchQuery } },
          ],
        }
      : {};

    const [data, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          phoneNumber: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          // 🟢 واکشی همزمان اشتراک‌های کاربر
          subscriptions: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              startDate: true,
              endDate: true,
              isActive: true,
              createdAt: true,
              plan: {
                select: {
                  title: true,
                  durationDays: true,
                  price: true,
                },
              },
              order: {
                select: {
                  pricePaid: true,
                  refId: true,
                  status: true,
                },
              },
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data,
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      data: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}