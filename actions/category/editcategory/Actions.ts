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

    const id = formData.get("id") as string;
    const catName = formData.get("catName") as string;
    const rawCatSlug = formData.get("catSlug") as string;
    const catSlug = rawCatSlug ? rawCatSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    const rawParentId = formData.get("parentId") as string;
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : null;

    if (!id || !catName || !catSlug) {
      return { success: false, message: "تمامی فیلدهای ضروری الزامی هستند." };
    }

    const existingCategory = await db.category.findFirst({
      where: {
        id: { not: id }, 
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

    if (parentId === id) {
        return { success: false, message: "یک دسته‌بندی نمی‌تواند والد خودش باشد." };
    }

    // 🟢 مدیریت تصویر (اولویت با لینک خارجی است)
    const externalImageUrl = formData.get("externalImageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    if (externalImageUrl && externalImageUrl.trim() !== "") {
        // استفاده از لینک خارجی
        finalImageUrl = externalImageUrl.trim();
    } else if (imageFile && imageFile.size > 0) {
        // آپلود فایل جدید
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

    const updateData: any = {
        catName: catName,
        catSlug: catSlug,
        parentId: parentId,
    };
    
    // اگر عکس یا لینک جدیدی ارسال شده بود آن را آپدیت کن در غیر اینصورت همان عکس قبلی باقی می‌ماند
    if (finalImageUrl) {
        updateData.imageUrl = finalImageUrl;
    }

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
    return { success: false, error: "خطایی در هنگام ویرایش رخ داد." };
  }
}
