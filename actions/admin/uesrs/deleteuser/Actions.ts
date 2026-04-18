"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(id) {
  try {


   

    if (!id) {
      return { success: false, message: "آیدی کاربر یافت نشد." };
    }

   
    // ثبت در دیتابیس
    await db.user.delete({
      where: {
        id: id,
      },
      
    });

    // به‌روزرسانی صفحه
    revalidatePath("/adminp/users");

  return {
      success: true,
      message: ` کاربر حذف شد.`, // 👈 اصلاح متن
    };
  } catch (error) {
    console.error("❌ Error in addUserAction:", error);

    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
