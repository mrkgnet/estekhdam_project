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

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند اسلایدر را ویرایش کند.",
      };
    }

    const id = formData.get("id") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    
    // اگر فایل جدیدی نیامده بود، مقدار پیش‌فرض همان عکس قبلی است
    let finalImageUrl = existingImageUrl;

    // مدیریت آپلود عکس با سیستم هشینگ (فقط در صورتی که عکس جدید انتخاب شده باشد)
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "mainSlider");
      const savePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });

      let fileExists = false;
      try {
        await fs.access(savePath);
        fileExists = true;
      } catch (error) {
        fileExists = false;
      }

      if (!fileExists) {
        await fs.writeFile(savePath, buffer);
      }

      finalImageUrl = `/images/mainSlider/${filename}`;
    }

    // ۱. دریافت بقیه اطلاعات از FormData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetLink = formData.get("targetLink") as string;

    // تبدیل order به عدد
    const orderRaw = formData.get("order");
    const order = orderRaw ? parseInt(orderRaw as string, 10) : 0;

    // بررسی چک‌باکس
    const isActive = formData.get("isActive") === "on";

    // ۲. اعتبارسنجی
    if (!id) {
      return { success: false, message: "شناسه اسلایدر یافت نشد." };
    }
    
    // اگر کاربر عکس را از فرم پاک کرد و عکس جدیدی هم آپلود نکرد
    if (!finalImageUrl || finalImageUrl.trim() === "") {
      return { success: false, message: "انتخاب تصویر اسلایدر الزامی است." };
    }

    // ۳. آپدیت در دیتابیس
    await db.mainSlider.update({
      where: { id: id },
      data: {
        imageUrl: finalImageUrl.trim(), // ذخیره لینک نهایی (قبلی یا جدید)
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        targetLink: targetLink ? targetLink.trim() : null,
        order: isNaN(order) ? 0 : order,
        isActive: isActive,
      },
    });

    // ۴. به‌روزرسانی کش صفحات
    revalidatePath("/"); 
    revalidatePath("/adminp/mainslider"); 

    return {
      success: true,
      message: "اسلایدر با موفقیت ویرایش شد.",
    };
  } catch (error) {
    console.error("❌ Error in editMainSliderAction:", error);
    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
