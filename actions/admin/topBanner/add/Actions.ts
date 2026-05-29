"use server";

import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createBannerAction(prevState, formData) {
  try {
    const title = formData.get("title");
    const imageUrl = formData.get("imageUrl");
    const targetUrl = formData.get("targetUrl");
    const slug = formData.get("slug");
    // اگر چک‌باکس تیک خورده باشد مقدار on برمی‌گرداند
    const isActive = formData.get("isActive") === "on";

    if (!title || !imageUrl || !targetUrl || !slug) {
      return { error: "لطفا تمام فیلدهای ضروری را پر کنید." };
    }

    await db.topBanner.create({
      data: {
        title,
        imageUrl,
        targetUrl,
        slug,
        isActive,
      },
    });

    // رفرش کردن کش صفحه برای نمایش تغییرات جدید
    revalidatePath("/adminp/top-banner"); 

    return { success: "بنر با موفقیت ایجاد شد!", clearForm: true };
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: "این اسلاگ قبلاً استفاده شده است." };
    }
    return { error: "خطایی در ثبت بنر رخ داد." };
  }
}