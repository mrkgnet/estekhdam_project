"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addCategoryChapter(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // if (!currentUser || currentUser.role !== "admin") {
    //   return { 
    //     success: false, 
    //     message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ایجاد کند." 
    //   };
    // }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    if (!name || name.trim() === "") {
      return { success: false, message: "نام دسته‌بندی الزامی است." };
    }

    if (!slug || slug.trim() === "") {
      return { success: false, message: "اسلاگ الزامی است." };
    }

    // بررسی تکراری بودن نام
    const existingCategoryByName = await db.categoryChapter.findFirst({
      where: { name: name.trim() },
    });

    if (existingCategoryByName) {
      return { success: false, message: "این نام دسته‌بندی قبلاً ثبت شده است." };
    }

    // بررسی تکراری بودن اسلاگ
    const existingCategoryBySlug = await db.categoryChapter.findFirst({
      where: { slug: slug.trim() },
    });

    if (existingCategoryBySlug) {
      return { success: false, message: "این اسلاگ قبلاً استفاده شده است." };
    }

    // ایجاد دسته‌بندی جدید
    const newCategory = await db.categoryChapter.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        isActive,
      },
    });

    revalidatePath("/adminp/categories");

    return { 
      success: true, 
      message: `دسته‌بندی "${name}" با موفقیت اضافه شد.`,
      data: newCategory
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "خطایی در سرور رخ داد." };
  }
}
