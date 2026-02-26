// actions/get_product_by_slug.ts

"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// این تابع یک محصول را بر اساس اسلاگ پیدا می‌کند
export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        slug: slug,
      },
    });
    return product;
  } catch (error) {
    console.error("Database Error: Failed to fetch product.", error);
    return null;
  }
}

// این نوع، داده خروجی را برای ما Type-Safe می‌کند
export type FetchedProduct = Prisma.PromiseReturnType<typeof getProductBySlug>;
