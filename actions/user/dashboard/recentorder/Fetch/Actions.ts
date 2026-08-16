"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export interface FetchOrdersResult {
  success: boolean;
  message?: string;
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

export async function fetchDataROUAction(
  page: number = 1,
  pageSize: number = 5
): Promise<FetchOrdersResult> {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "user") {
      console.log("❌ Access denied: User is not logged in");
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          pageSize,
        },
      };
    }

    const userId = currentUser.userId;
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 5);
    const skip = (safePage - 1) * safePageSize;

    const totalCount = await db.order.count({
      where: {
        userId: userId,
      },
    });

    const orders = await db.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            type: true,
          },
        },
        subscriptionPlan: {
          select: {
            id: true,
            title: true,
            slug: true,
            durationDays: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: safePageSize,
    });

    const calculatedTotalPages = Math.ceil(totalCount / safePageSize);
    const totalPages = calculatedTotalPages === 0 ? 1 : calculatedTotalPages;

    return {
      success: true,
      data: orders,
      pagination: {
        currentPage: safePage,
        totalPages: totalPages,
        totalCount,
        pageSize: safePageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      message: "خطا در دریافت اطلاعات سفارش‌ها",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize,
      },
    };
  }
}
