// مسیر: @/actions/admin/chapter/editChapter/Actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function editChapterAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { error: "عدم دسترسی" };
    }

    // دریافت مقادیر از فرم
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const orderString = formData.get("order") as string;
    const productId = formData.get("productId") as string; // برای revalidatePath نیاز داریم
   

    if (!id || !title || !orderString ) {
      return { error: "تمام فیلدها الزامی هستند." };
    }

    const orderNumber = parseInt(orderString, 10);
    if (isNaN(orderNumber)) {
      return { error: "شماره سرفصل باید یک عدد باشد." };
    }

    // به‌روزرسانی سرفصل در دیتابیس
    await db.chapter.update({
      where: { id: id },
      data: {
        title: title,
        order: orderNumber,
      },
    });

    revalidatePath(`/admin/chapter/${productId}`); // مسیر را بروزرسانی می‌کنیم
    return { success: "سرفصل با موفقیت ویرایش شد." };

  } catch (error) {
    console.error("🚨 خطا در ویرایش سرفصل:", error);
    return { error: "خطای سرور" };
  }
}
