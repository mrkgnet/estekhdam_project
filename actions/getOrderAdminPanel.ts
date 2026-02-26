"use server";

import { db } from "@/lib/db";

export async function getAllOrders(params: { page: number; pageSize: number }) {
  try {
    // ✅ sanitize ورودی‌ها (خیلی مهم)
    const pageSize = params.pageSize && params.pageSize > 0 ? Math.floor(params.pageSize) : 5;
    const page = params.page && params.page > 0 ? Math.floor(params.page) : 1;

    const skip = (page - 1) * pageSize;

    const [totalOrders, orders] = await db.$transaction([
      db.order.count(),
      db.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
    ]);

    // ✅ totalPages حداقل 1
    const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));

    // ✅ اگر page بزرگ‌تر از totalPages بود، بهتره صفحه آخر رو برگردونی (اختیاری ولی پیشنهادی)
    if (page > totalPages) {
      const lastPageSkip = (totalPages - 1) * pageSize;
      const lastPageOrders = await db.order.findMany({
        include: {
          user: { select: { id: true, username: true, phoneNumber: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: lastPageSkip,
        take: pageSize,
      });

      return {
        ok: true as const,
        orders: lastPageOrders,
        totalPages,
        currentPage: totalPages,
      };
    }

    return {
      ok: true as const,
      orders,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Database Error (getAllOrders):", error);
    return { ok: false as const, error: "خطا در دریافت اطلاعات سفارشات" };
  }
}
