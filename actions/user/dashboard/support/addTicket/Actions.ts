"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// در useActionState اکشن باید حتما prevState و formData را دریافت کند
export async function addTicketUserAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری شوید.",
      };
    }

    const userId = currentUser.userId;

    // استخراج مقادیر از فرم
    const subject = formData.get("subject") as string;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH";
    const messageText = formData.get("message") as string;

    // اعتبارسنجی
    if (!subject || !priority || !messageText) {
      return { success: false, message: "تکمیل تمامی فیلدها الزامی است." };
    }

    // 👈 ۱. اصلاح اول: خروجی db.ticket.create را داخل یک متغیر ذخیره می‌کنیم
    const newTicket = await db.ticket.create({
      data: {
        subject: subject,
        priority: priority,
        userId: userId,
        // ثبت متن پیام در جدول TicketMessage
        messages: {
          create: {
            text: messageText,
            userId: userId,
          },
        },
      },
    });

   // 👈 ۲. ثبت نوتیفیکیشن با استفاده از متغیرهای صحیح
    await db.notification.create({
      data: {
        // نکته: اگر در Prisma Enum شما مقدار TICKET است، اینجا را TICKET بنویسید
        type: "NEW_TICKET", 
        message: `شما یک پیام جدید در بخش (تیکت) دارید `, // استفاده از subject به جای title
        referenceId: newTicket.id, // گرفتن آیدی از تیکتی که در بالا ساخته شد
        isRead: false
      }
    });

    // رفرش کردن کش صفحه لیست تیکت‌ها
    revalidatePath("/user/tickets");

    return {
      success: true,
      message: "تیکت شما با موفقیت ثبت شد.",
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      message: "خطایی در ثبت تیکت رخ داد. لطفا دوباره تلاش کنید.",
    };
  }
}
