"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editCategoryChapter(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // if (!currentUser || currentUser.role !== "admin") {
    //   return { 
    //     success: false, 
    //     message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی ویرایش کند." 
    //   };
    // }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    if (!id) {
      return { success: false, message: "شناسه دسته‌بندی یافت نشد." };
    }

    if (!name || name.trim() === "") {
      return { success: false, message: "نام دسته‌بندی الزامی است." };
    }

    if (!slug || slug.trim() === "") {
      return { success: false, message: "اسلاگ الزامی است." };
    }

    // بررسی وجود دسته‌بندی
    const existingCategory = await db.categoryChapter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return { success: false, message: "دسته‌بندی مورد نظر یافت نشد." };
    }

    // بررسی تکراری بودن نام (به جز خود این دسته)
    const duplicateCategoryByName = await db.categoryChapter.findFirst({
      where: { 
        name: name.trim(),
        NOT: { id: parseInt(id) }
      },
    });

    if (duplicateCategoryByName) {
      return { success: false, message: "این نام دسته‌بندی قبلاً ثبت شده است." };
    }

    // بررسی تکراری بودن اسلاگ (به جز خود این دسته)
    const duplicateCategoryBySlug = await db.categoryChapter.findFirst({
      where: { 
        slug: slug.trim(),
        NOT: { id: parseInt(id) }
      },
    });

    if (duplicateCategoryBySlug) {
      return { success: false, message: "این اسلاگ قبلاً استفاده شده است." };
    }

    // ویرایش دسته‌بندی
    const updatedCategory = await db.categoryChapter.update({
      where: { id: parseInt(id) },
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
      message: `دسته‌بندی "${name}" با موفقیت ویرایش شد.`,
      data: updatedCategory
    };
  } catch (error) {
    console.error("Error editing category:", error);
    return { success: false, message: "خطایی در سرور رخ داد." };
  }
}
