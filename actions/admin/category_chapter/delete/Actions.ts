'use server'

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCategoryChapter(id: number) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی حذف کند." 
      };
    }

    // بررسی وجود دسته‌بندی
    const existingCategory = await db.categoryChapter.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return { 
        success: false, 
        message: "دسته‌بندی مورد نظر یافت نشد." 
      };
    }

    // حذف دسته‌بندی
    await db.categoryChapter.delete({
      where: { id }
    });

    // بروزرسانی کش صفحه
    revalidatePath("/adminp/category_chapter");

    return { 
      success: true, 
      message: `دسته‌بندی "${existingCategory.name}" با موفقیت حذف شد.`,
      deletedId: id
    };
  } catch (error) {
    console.error("❌ Error in deleteCategoryChapter:", error);
    return { 
      success: false, 
      message: "خطایی در حذف دسته‌بندی رخ داد." 
    };
  }
}
