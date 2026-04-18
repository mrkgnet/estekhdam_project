"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export default async function editCategoryAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    // 🟢 دریافت آیدی دسته برای ویرایش
    const id = formData.get("id") as string;
    const catName = formData.get("catName") as string;
    const rawCatSlug = formData.get("catSlug") as string;
    const catSlug = rawCatSlug ? rawCatSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    // 🟢 دریافت شناسه والد از فرم
    const rawParentId = formData.get("parentId") as string;
    // اگر فرم خالی ارسال شد (دسته اصلی)، مقدار null را پاس می‌دهیم تا اگر قبلا والد داشت، ارتباطش قطع شود
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : null;

    if (!id || !catName || !catSlug) {
      return { success: false, message: "تمامی فیلدهای ضروری الزامی هستند." };
    }

    // 🟢 بررسی تکراری بودن (به جز خود دسته‌ای که در حال ویرایش آن هستیم)
    const existingCategory = await db.category.findFirst({
      where: {
        id: { not: id }, // خود این آیدی را نادیده بگیر
        OR: [{ catName: catName }, { catSlug: catSlug }],
      },
    });

    if (existingCategory) {
      if (existingCategory.catName === catName) {
        return { success: false, message: "این نام دسته‌بندی قبلاً توسط دسته دیگری ثبت شده است." };
      }
      if (existingCategory.catSlug === catSlug) {
        return { success: false, message: "این اسلاگ قبلاً توسط دسته دیگری ثبت شده است." };
      }
    }

    // 🟢 اعتبارسنجی سمت سرور: یک دسته نمی‌تواند والد خودش باشد
    if (parentId === id) {
        return { success: false, message: "یک دسته‌بندی نمی‌تواند والد خودش باشد." };
    }

    // مدیریت آپلود عکس
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "categories");
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
      
      finalImageUrl = `/images/categories/${filename}`;
    }

    // 🟢 آماده‌سازی دیتای آپدیت
    const updateData: any = {
        catName: catName,
        catSlug: catSlug,
        parentId: parentId, // 🟢 اضافه شدن والد جدید به داده‌های آپدیت
    };
    
    // (اگر عکس جدیدی آپلود نشده، عکس قبلی را دست نزن)
    if (finalImageUrl) {
        updateData.imageUrl = finalImageUrl;
    }

    // آپدیت در دیتابیس
    const result = await db.category.update({
      where: { id: id },
      data: updateData,
    });

    revalidatePath("/adminp/categories");

    return {
      success: true,
      message: `دسته‌بندی "${result.catName}" با موفقیت ویرایش شد.`,
    };
  } catch (error) {
    console.error("Error editing category:", error);
    return { success: false, error: "خطایی در هنگام ویرایش رخ داد." };
  }
}
