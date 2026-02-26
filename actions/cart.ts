// actions/cart.ts
"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * سبد خرید کاربر فعلی را از دیتابیس واکشی می‌کند.
 */
export async function getCart() {
  const userId = await getUserId();
  if (!userId) return null;

  return db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "desc" },
      },
    },
  });
}

/**
 * یک محصول را به سبد خرید کاربر اضافه می‌کند یا اگر از قبل وجود داشت،
 * تعداد آن را افزایش می‌دهد.
 */
export async function upsertCartItem(productId: string) {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false, reason: "AUTH_REQUIRED" as const, message: "برای افزودن محصول به سبد، ابتدا وارد شوید." };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("محصول یافت نشد.");

  let cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId } });
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await db.cartItem.create({
      data: { cartId: cart.id, productId, quantity: 1 },
    });
  }

  revalidatePath("/cart");
}

/**
 * یک آیتم را به طور کامل از سبد خرید حذف می‌کند.
 */
export async function removeCartItem(productId: string) {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false, reason: "AUTH_REQUIRED" as const, message: "برای افزودن محصول به سبد، ابتدا وارد شوید." };
  }

  const item = await db.cartItem.findFirst({
    where: { productId, cart: { userId } },
  });

   if (!item) {
    return { ok: true as const, message: "Item not found in server cart (ignored)" };
  } 

  await db.cartItem.delete({ where: { id: item.id } });

  revalidatePath("/cart");
}

/**
 * ✨ تابع جدید: تعداد یک آیتم مشخص در سبد خرید را آپدیت می‌کند.
 */
export async function updateCartItemQuantity(productId: string, newQuantity: number) {
  const userId = await getUserId();
   if (!userId) {
    return { ok: false, reason: "AUTH_REQUIRED" as const, message: "برای افزودن محصول به سبد، ابتدا وارد شوید." };
  }

  if (newQuantity <= 0) {
    // اگر تعداد صفر یا کمتر شد، آیتم را به کل حذف کن
    return removeCartItem(productId);
  }

  // اطمینان از اینکه آیتم متعلق به سبد خرید همین کاربر است
  const item = await db.cartItem.findFirst({
    where: { productId, cart: { userId } },
  });

    if (!item) {
    return { ok: true as const, message: "Item not found in server cart (ignored)" };
  }

  // آپدیت تعداد
  await db.cartItem.update({
    where: { id: item.id },
    data: { quantity: newQuantity },
  });

  revalidatePath("/cart");
}
