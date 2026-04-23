"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function getDataEditProduct(id: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "شما دسترسی لازم برای این کار را ندارید", product: null };
    }

    const productData = await db.product.findUnique({
      where: { id: id },
      // 🟢 include حذف شد زیرا در schema ارتباط relations برای categories وجود ندارد
    });

    if (!productData) {
      return { success: false, message: "محصول مورد نظر یافت نشد", product: null };
    }

    return { success: true, message: "اطلاعات با موفقیت دریافت شد", product: productData };
  } catch (error) {
    console.error("❌ Error fetching product data:", error);
    return { success: false, message: "خطا در ارتباط با دیتابیس", product: null };
  }
}
