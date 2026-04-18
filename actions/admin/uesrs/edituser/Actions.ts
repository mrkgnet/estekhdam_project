"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editUserAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند کاربر اضافه کند.",
      };
    }

    const rawData = Object.fromEntries(formData.entries());

    const {
      id = "",
      email = "",
      phoneNumber = "",
      role = "",
    } = rawData as {
      id: string;
      email: string;
      phoneNumber: string;
      role: string;
    };

    if (!id) {
      return { success: false, message: "آیدی کاربر یافت نشد." };
    }

    // اعتبارسنجی (نام و نام خانوادگی حذف شد، موبایل و نقش الزامی است)
    if (!phoneNumber || !role) {
      return { success: false, message: "شماره موبایل و نقش کاربر الزامی هستند." };
    }

    // اگر ایمیل خالی بود، آن را تبدیل به null می‌کنیم تا در دیتابیس تداخل ایجاد نکند
    const finalEmail = email.trim() !== "" ? email.trim() : null;

    // ثبت در دیتابیس
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        phoneNumber,
        email: finalEmail,
        role,
      },
    });

    // به‌روزرسانی صفحه
    revalidatePath("/adminp/users");

  return {
      success: true,
      message: `اطلاعات کاربر با شماره "${phoneNumber}" با موفقیت ویرایش شد.`, // 👈 اصلاح متن
    };
  } catch (error) {
    console.error("❌ Error in addUserAction:", error);

    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
