"use server"; 

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma, CategoryType } from "@prisma/client"; // 🟢 ایمپورت CategoryType
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export default async function addCategoryAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ایجاد کند." };
    }

    const catName = formData.get("catName") as string;
    const rawCatSlug = formData.get("catSlug") as string;
    const catSlug = rawCatSlug ? rawCatSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    // 🟢 استخراج فیلد Type و تعیین مقدار پیش‌فرض در صورت خالی بودن
    const typeValue = (formData.get("type") as CategoryType) || "MAIN";

    const rawParentId = formData.get("parentId") as string;
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : undefined;
    
    if (!catName || !catSlug) {
      return { success: false, message: "تمامی فیلدها الزامی هستند." };
    }

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

    const externalImageUrl = formData.get("externalImageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    if (externalImageUrl && externalImageUrl.trim() !== "") {
      finalImageUrl = externalImageUrl.trim();
    } else if (imageFile && imageFile.size > 0) {
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

    const result = await db.category.create({
      data: {
        catName: catName,
        catSlug: catSlug,
        type: typeValue, // 🟢 ثبت نوع دسته در دیتابیس
        imageUrl: finalImageUrl, 
        parentId: parentId, 
      },
    });

    revalidatePath("/adminp/categories");

    return {
      success: true,
      message: `دسته‌بندی "${result.catName}" با موفقیت ایجاد شد.`,
      data: {
        name: result.catName,
        slug: result.catSlug,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const fields = (error.meta?.target as string[]).join(", ");
        return { success: false, error: `خطای دیتابیس: فیلد "${fields}" تکراری است.` };
      }
    }
    return { success: false, error: "خطایی در هنگام ثبت دسته رخ داد. لطفاً دوباره تلاش کنید." };
  }
}