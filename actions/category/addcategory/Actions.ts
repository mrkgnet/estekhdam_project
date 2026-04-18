"use server"; // ⚠️ این خط بسیار مهم است

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// 🟢 ایمپورت‌های مورد نیاز برای هشینگ و سیستم فایل
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export default async function addCategoryAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ایجاد کند." };
    }

    const catName = formData.get("catName") as string;
    const rawCatSlug = formData.get("catSlug") as string;
    const catSlug = rawCatSlug ? rawCatSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    // 🟢 دریافت شناسه والد از فرم
    const rawParentId = formData.get("parentId") as string;
    // اگر فرم خالی ارسال شد، مقدار را undefined قرار می‌دهیم تا در دیتابیس ثبت نشود
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : undefined;
    
    // اعتبارسنجی ساده
    if (!catName || !catSlug) {
      return { success: false, message: "تمامی فیلدها الزامی هستند." };
    }

    // 🟢 بررسی تکراری بودن اطلاعات در دیتابیس
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [{ catName: catName }, { catSlug: catSlug }],
      },
    });

    if (existingCategory) {
      if (existingCategory.catName === catName) {
        return { success: false, message: "این نام دسته‌بندی قبلاً ثبت شده است." };
      }
      if (existingCategory.catSlug === catSlug) {
        return { success: false, message: "این اسلاگ (نامک) قبلاً ثبت شده است." };
      }
    }

    // 🟢 مدیریت آپلود عکس با سیستم هشینگ
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

    // 🟢 ذخیره در دیتابیس (اطلاعات تکراری نیست، عکس پردازش شده و والد اضافه شده)
    const result = await db.category.create({
      data: {
        catName: catName,
        catSlug: catSlug,
        imageUrl: finalImageUrl, 
        parentId: parentId, // 🟢 مقدار والد در دیتابیس ثبت می‌شود
      },
    });

    // پاک کردن کش صفحه لیست دسته‌بندی‌ها
    revalidatePath("/adminp/categories");

    // ارسال پاسخ موفقیت‌آمیز به سمت کلاینت
    return {
      success: true,
      message: `دسته‌بندی "${result.catName}" با موفقیت ایجاد شد.`,
      data: {
        name: result.catName,
        slug: result.catSlug,
      },
    };
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const fields = (error.meta?.target as string[]).join(", ");
        return { success: false, error: `خطای دیتابیس: فیلد "${fields}" تکراری است.` };
      }
    }

    return { success: false, error: "خطایی در هنگام ثبت دسته رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
