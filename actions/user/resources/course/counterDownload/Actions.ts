"use server";

import { db } from "@/lib/db";

export async function incrementDownloadCountAction(productId: string) {
  try {
    if (!productId) {
      return { success: false, message: "شناسه محصول نامعتبر است." };
    }

    // 🟢 افزایش ۱ واحدی فیلد downloadCount در دیتابیس
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    return { 
      success: true, 
      downloadCount: updatedProduct.downloadCount 
    };
  } catch (error) {
    console.error("❌ Error incrementing download count:", error);
    return { success: false, message: "خطا در ثبت آمار دانلود." };
  }
}