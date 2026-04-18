"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteItemCategoryAction(id) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return {
        success: false,
        message: "دسترسی غیرمجاز. ",
      };
    }

   

    if (!id) {
      return { success: false, message: "آیدی کاربر یافت نشد." };
    }

   
    // ثبت در دیتابیس
    await db.category.delete({
      where: {
        id: id,
      },
      
    });

    // به‌روزرسانی صفحه
    revalidatePath("/adminp/categories");

  return {
      success: true,
      message: ` دسته بندی با موفقیت  حذف شد.`, // 👈 اصلاح متن
    };
  } catch (error) {
    console.error("❌ Error in addUserAction:", error);

    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
