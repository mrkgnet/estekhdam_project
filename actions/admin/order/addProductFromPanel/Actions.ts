// actions/admin/products/government/Actions.ts
'use server'
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function addProductToUser(userId: string, productIds: string[]) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند این عملیات را انجام دهد." };
    }

    // بررسی معتبر بودن دیتای ورودی
    if (!userId || !productIds || productIds.length === 0) {
      return { success: false, message: "کاربر یا محصولات انتخاب نشده‌اند." };
    }

    // --- محاسبه تاریخ انقضا (مثلاً ۹۰ روز بعد از الان) ---
    const durationInDays = 90; 
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + durationInDays);
    // ----------------------------------------------------

    // آماده‌سازی داده‌ها برای جدول Order
    // چون ادمین دستی اضافه می‌کند، مبلغ پرداختی را 0 در نظر می‌گیریم
    const ordersData = productIds.map((productId) => ({
      userId: userId,
      productId: productId,
      pricePaid: 0,
      status: "SUCCESS", // اگر Enum شما وضعیتی مثل موفق/تکمیل‌شده دارد، آن را تنظیم کنید
      expiresAt: expirationDate, // <--- اضافه شدن تاریخ انقضا به دیتابیس
      isActive: true // (اختیاری) چون در مدل دیفالت true است، اما نوشتنش خوانایی را بالا می‌برد
    }));

    // ثبت گروهی سفارشات در دیتابیس
    await db.order.createMany({
      data: ordersData,
    });

    // رفرش کردن کش صفحه کاربران
    revalidatePath("/adminp/users");

    return { success: true, message: "محصولات با موفقیت همراه با محدودیت ۳ ماهه به کاربر تخصیص داده شد." };
  } catch (error) {
    console.error("Error adding product to user:", error);
    return { success: false, message: "خطایی در سمت سرور رخ داد." };
  }
}
