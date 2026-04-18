"use server"
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser) {
      return { type: 'error', message: "شما وارد سایت نشده‌اید." };
    }

    // استخراج اطلاعات از FormData
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const nationalCode = formData.get('nationalCode') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as string;

    // ----- بررسی دستی یکتایی کد ملی (رفع ارور E11000) -----
    if (nationalCode && nationalCode.trim() !== "") {
      const existingUser = await db.user.findFirst({
        where: { nationalCode: nationalCode }
      });
      
      // اگر کد ملی وجود داشت و آیدی آن شخص با آیدی کاربر فعلی فرق داشت
      if (existingUser && existingUser.id !== currentUser.userId) {
        return { type: 'error', message: "این کد ملی قبلا توسط کاربر دیگری ثبت شده است." };
      }
    }

    // آپدیت اطلاعات در دیتابیس
    await db.user.update({
      where: { id: currentUser.userId },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        nationalCode: nationalCode || null,
        email: email || null,
        gender: gender || 'UNKNOWN',
      }
    });

    // رفرش کردن کش صفحه برای نمایش اطلاعات جدید
    revalidatePath('/user/profile'); // مسیر صفحه پروفایل خود را اینجا قرار دهید

    return { type: 'success', message: "اطلاعات پروفایل با موفقیت بروزرسانی شد." };

  } catch (error) {
    console.error("Update Profile Error:", error);
    return { type: 'error', message: "خطایی در سرور رخ داد. لطفا دوباره تلاش کنید." };
  }
}
