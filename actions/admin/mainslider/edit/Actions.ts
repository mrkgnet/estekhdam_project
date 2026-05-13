// file: editMainSliderAction.ts

"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

export async function editMainSliderAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, message: "شناسه اسلایدر یافت نشد." };
    }

    const existingImageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("imageFile") as File | null;
    const externalImageUrl = formData.get("externalImageUrl") as string | null;
    
    // مقدار پیش‌فرض همان عکس قبلی است
    let finalImageUrl = existingImageUrl;

    // ۱. اولویت با لینک خارجی جدید
    if (externalImageUrl && externalImageUrl.trim().startsWith('http')) {
        finalImageUrl = externalImageUrl.trim();
    }
    // ۲. اگر لینک جدیدی نبود، فایل آپلود شده جدید را بررسی کن
    else if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "mainSlider");
      const savePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });

      try {
        await fs.access(savePath);
      } catch {
        await fs.writeFile(savePath, buffer);
      }

      finalImageUrl = `/images/mainSlider/${filename}`;
    }
    // ۳. اگر کاربر لینک را پاک کرده ولی فایلی هم آپلود نکرده باشد
    else if (externalImageUrl !== null && externalImageUrl.trim() === '' && (!imageFile || imageFile.size === 0)) {
        finalImageUrl = ''; // خالی کردن لینک
    }

    if (!finalImageUrl) {
        return { success: false, message: "تصویر اسلایدر نمی‌تواند خالی باشد." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetLink = formData.get("targetLink") as string;
    const orderRaw = formData.get("order");
    const order = orderRaw ? parseInt(orderRaw as string, 10) : 0;
    const isActive = formData.get("isActive") === "on";

    await db.mainSlider.update({
      where: { id: id },
      data: {
        imageUrl: finalImageUrl.trim(),
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        targetLink: targetLink ? targetLink.trim() : null,
        order: isNaN(order) ? 0 : order,
        isActive: isActive,
      },
    });

    revalidatePath("/"); 
    revalidatePath("/admin/mainslider"); // مسیر را متناسب با پروژه خود تغییر دهید

    return {
      success: true,
      message: "اسلایدر با موفقیت ویرایش شد.",
    };
  } catch (error) {
    console.error("❌ Error in editMainSliderAction:", error);
    return {
      success: false,
      message: "خطایی در سرور رخ داد.",
    };
  }
}
