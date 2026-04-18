"use server";

import { db } from "@/lib/db";

export async function fetchDataCartUserAction(productId: string) {
  try {
    // گرفتن اطلاعات محصول از دیتابیس بر اساس آیدی
    const result = await db.product.findUnique({
      where: {
        id: productId,
      },
      // اگر نیاز دارید فیلدهای خاصی رو بگیرید می‌تونید select اضافه کنید
    });

    if (!result) {
       return { success: false, data: null };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error fetching product cart:", error);
    return { success: false, data: null };
  }
}
