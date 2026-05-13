"use server"; // <--- این خط حتما باید در خط اول فایل باشد

import { db } from "@/lib/db";

export async function checkUserPurchaseStatus(productId: string, userId: string) {

  if (!productId || !userId) {
    return false;
  }

  try {
    const existingOrder = await db.order.findFirst({
      where: {
        userId: userId,
        productId: productId,
        status: "SUCCESS" 
      }
    });

    return !!existingOrder; 
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}
