"use server";

import { db } from "@/lib/db";
import { infoCurentUser } from "@/lib/auth"; 

export type ActionState = {
  success: boolean;
  message: string;
};

export async function addContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;

    if (!title || !message) {
      return { success: false, message: "لطفاً تمامی فیلدها را پر کنید." };
    }

    const currentUser = await infoCurentUser();

    // 👈 ۱. نتیجه ذخیره در دیتابیس را داخل یک متغیر می‌ریزیم تا به آیدی آن دسترسی پیدا کنیم
    const newContact = await db.contact.create({
      data: {
        title,
        message,
        userId: currentUser ? currentUser.userId : undefined, 
      },
    });

    // 👈 ۲. ثبت نوتیفیکیشن با استفاده از متغیرهای صحیح
    await db.notification.create({
      data: {
        type: "NEW_CONTACT", 
        message: `پیام جدید (تماس با ما) با عنوان "${title}" ثبت شد.`, // تغییر subject به title
        referenceId: newContact.id, // گرفتن آیدی از کانتکتی که بالا ساخته شد
        isRead: false
      }
    });

    return { success: true, message: "پیام شما با موفقیت ارسال شد!" };
  } catch (error) {
    console.error("Error creating contact:", error);
    return { success: false, message: "خطایی در ارسال پیام رخ داد. لطفاً مجدداً تلاش کنید." };
  }
}
