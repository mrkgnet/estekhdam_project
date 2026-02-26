// actions/order.ts
"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/auth";

type ClientItem = { productId: string; quantity: number };

export async function createCompletedOrderFromLocalCart(items: ClientItem[]) {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false as const, reason: "AUTH_REQUIRED" as const, message: "ابتدا وارد شوید." };
  }

  const clean = (items || [])
    .filter((i) => i?.productId && Number.isFinite(i.quantity) && i.quantity > 0)
    .map((i) => ({ productId: i.productId, quantity: Math.floor(i.quantity) }));

  if (clean.length === 0) {
    return { ok: false as const, reason: "EMPTY_CART" as const, message: "سبد خرید خالی است." };
  }

  const products = await db.product.findMany({
    where: { id: { in: clean.map((i) => i.productId) } },
    select: { id: true, title: true, price: true, images: true },
  });

  const map = new Map(products.map((p) => [p.id, p]));

  for (const it of clean) {
    if (!map.has(it.productId)) {
      return { ok: false as const, reason: "PRODUCT_NOT_FOUND" as const, message: "یکی از محصولات یافت نشد." };
    }
  }

  const orderItems = clean.map((it) => {
    const p = map.get(it.productId)!;
    return {
      productId: p.id,
      quantity: it.quantity,
      priceAtTimeOfPurchase: p.price,
    };
  });

  const totalPrice = orderItems.reduce((sum, it) => sum + it.priceAtTimeOfPurchase * it.quantity, 0);

  const order = await db.order.create({
    data: {
      userId,
      status: "COMPLETED",
      totalPrice,
      items: { create: orderItems },
    },
    select: { id: true, totalPrice: true, createdAt: true },
  });

  return { ok: true as const, orderId: order.id, totalPrice: order.totalPrice, createdAt: order.createdAt };
}



// actions/order.ts



export async function getMyOrders(params?: { page?: number; pageSize?: number }) {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false as const, reason: "AUTH_REQUIRED" as const };
  }

  // مقادیر پیش‌فرض برای صفحه‌بندی
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10; // یک مقدار پیش‌فرض معقول

  try {
    // از تراکنش برای گرفتن همزمان "تعداد کل" و "لیست صفحه‌بندی شده" استفاده می‌کنیم
    const [totalOrders, orders] = await db.$transaction([
      // ۱. شمارش کل سفارشات کاربر برای محاسبه تعداد کل صفحات
      db.order.count({
        where: { userId },
      }),
      // ۲. واکشی سفارشات فقط برای صفحه فعلی
      db.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: { select: { title: true } }, // فقط عنوان محصول را برای نمایش لازم داریم
            },
          },
        },
        orderBy: { createdAt: "desc" }, // جدیدترین سفارشات در بالا
        skip: (page - 1) * pageSize, // ✨ جادو: از چند آیتم باید بگذریم
        take: pageSize,              // ✨ جادو: چه تعداد آیتم باید برداریم
      }),
    ]);

    return {
      ok: true as const,
      orders,
      totalPages: Math.ceil(totalOrders / pageSize), // محاسبه تعداد کل صفحات
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to get my orders:", error);
    return { ok: false as const, reason: "SERVER_ERROR" as const, message: "خطا در واکشی سفارشات" };
  }
}
