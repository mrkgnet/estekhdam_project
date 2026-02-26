// actions/get_products.ts

"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";



export async function getProducts() {
  try {
    const products = await db.product.findMany({
      // محصولات جدیدتر را اول نمایش بده
      orderBy: {
        createdAt: 'desc',
      },
    });
   

    return products;
  } catch (error) {
    console.error("Database Error: Failed to fetch products.", error);
    // در صورت خطا، یک آرایه خالی برگردان تا صفحه خراب نشود
    return [];
  }
}

// این یک نوع پیشرفته است که به ما کمک می‌کند نوع داده خروجی را به طور خودکار داشته باشیم
export type FetchedProducts = Prisma.PromiseReturnType<typeof getProducts>;
