"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db"; // مسیر دیتابیس خود را تنظیم کنید
import { revalidatePath } from "next/cache";

export async function addChapterAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      // به جای NextResponse، یک آرایه خالی برمی‌گردانیم تا UI دچار خطا نشود
      return [];
    }
    // ۲. دریافت مقادیر از فرم
    const title = formData.get("title") as string;
    const productId = formData.get("productId") as string;
    const orderString = formData.get("order") as string;

    if (!title || !productId || !orderString) {
      return { error: "عنوان سرفصل و شناسه محصول الزامی است." };
    }

    const orderNumber = parseInt(orderString, 10);
    // بررسی اینکه آیا کاربر واقعا عدد وارد کرده است یا خیر
    if (isNaN(orderNumber)) {
      return { error: "شماره سرفصل باید یک عدد معتبر باشد." };
    }

    // ۳. ایجاد سرفصل در دیتابیس
    await db.chapter.create({
      data: {
        title,
        productId,
        order:orderNumber,
      },
    });

    // ۴. بروزرسانی مسیر صحیح (مسیر مدیریت سرفصل‌های همان محصول)
    revalidatePath(`/adminp/chapters/${productId}`);

    return { success: true, message:"سرفصل با موفقیت اضافه شد." };
  } catch (error) {
    console.error("Error creating chapter:", error);
    return { error: "خطا در برقراری ارتباط با پایگاه داده." };
  }
}
