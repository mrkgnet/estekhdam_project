"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function addMainSliderAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند اسلایدر اضافه کند.",
      };
    }

    // ۱. دریافت اطلاعات از FormData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetLink = formData.get("targetLink") as string;
    const imageFile = formData.get("imageFile") as File | null;

    // ۲. اعتبارسنجی (عکس اجباری است)
    if (!imageFile || imageFile.size === 0) {
      return {
        success: false,
        message: "انتخاب تصویر برای اسلایدر الزامی است.",
      };
    }

    // ۳. مدیریت آپلود عکس با سیستم هشینگ
    let finalImageUrl = "";

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const extension = path.extname(imageFile.name) || ".jpg";
    const filename = `${hash}${extension}`;

    // مسیر ذخیره‌سازی (بهتر است پوشه مجزا برای اسلایدرها داشته باشید)
    const uploadDir = path.join(process.cwd(), "public", "images", "mainSlider");
    const savePath = path.join(uploadDir, filename);

    // ساخت پوشه در صورت عدم وجود
    await fs.mkdir(uploadDir, { recursive: true });

    let fileExists = false;
    try {
      await fs.access(savePath);
      fileExists = true;
    } catch (error) {
      fileExists = false;
    }

    // اگر فایلی با این هش وجود نداشت، آن را ذخیره کن
    if (!fileExists) {
      await fs.writeFile(savePath, buffer);
    }

    finalImageUrl = `/images/mainSlider/${filename}`;

    // ۴. ذخیره در دیتابیس
    await db.mainSlider.create({
      data: {
        imageUrl: finalImageUrl,
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        targetLink: targetLink ? targetLink.trim() : null,
      },
    });

    // ۵. به‌روزرسانی کش صفحاتی که اسلایدر در آن‌ها نمایش داده می‌شود
    revalidatePath("/"); // صفحه اصلی سایت
    revalidatePath("/adminp/mainslider/history"); // صفحه تاریخچه

    return {
      success: true,
      message: "اسلایدر با موفقیت ایجاد و منتشر شد.",
    };
  } catch (error) {
    console.error("❌ Error in addMainSliderAction:", error);

    return {
      success: false,
      message: "خطایی در برقراری ارتباط با سرور یا آپلود فایل رخ داد.",
    };
  }
}
