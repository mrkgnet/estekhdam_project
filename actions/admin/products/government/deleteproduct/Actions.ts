'use server'; // 👈 رفع مشکل اول: اضافه کردن این خط الزامی است

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache"; // 👈 ایمپورت برای پاک کردن کش

export default async function deleteProductAction(id: string) {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      
      // 👈 رفع مشکل سوم: برگرداندن آبجکت استاندارد به جای آرایه خالی
      return { 
        success: false, 
        message: "دسترسی غیرمجاز: شما ادمین نیستید." 
      };
    }

    // ۲. حذف از دیتابیس
    const res = await db.product.delete({
        where: { // 👈 رفع مشکل دوم: اضافه کردن دونقطه (:)
            id: id
        }
    });

    // ۳. ایجاد تاخیر مصنوعی (برای دیدن انیمیشن لودینگ - در حالت واقعی می‌توانید حذفش کنید)
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 👈 رفع مشکل چهارم: پاک کردن کش صفحه بعد از حذف موفق
    // مسیر داخل پرانتز باید دقیقاً مسیر صفحه‌ای باشد که لیست محصولات در آن نمایش داده می‌شود
    revalidatePath('/adminp/products/government/editproduct'); 

    return {
        success: true, 
        message: 'محصول با موفقیت حذف شد.'
    };

  } catch (error) {
    console.error("خطا در حذف محصول:", error);
    return { 
        success: false, 
        message: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' 
    };
  }
}
