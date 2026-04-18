"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addNewCommentUser(prevState: any, formData: FormData) {
  try {
    const text = formData.get("newComment") as string;
    const productId = formData.get("productId") as string;
    const parentId = formData.get("parentId") as string | null;

    if (!text || text.length < 2) {
      return { error: "متن کامنت خیلی کوتاه است." };
    }

    // بررسی کاربر لاگین شده (بدون ایجاد خطا برای کاربران مهمان)
    let userId = null;
    let userName = "کاربر مهمان";

    try {
      const userToken = await infoCurentUser();
      if (userToken && userToken.userId) {
        userId = userToken.userId;
        // در صورت نیاز نام کاربر را هم دریافت کنید
      }
    } catch (e) {
      // کاربر لاگین نیست، مشکلی نیست عبور میکنیم
    }

    const newComment = await db.comment.create({
      data: {
        textComment: text,
        productId: productId,
        userId: userId, // اگر لاگین نباشد null ثبت میشود
        parentId: parentId ? parentId : null,
        status: "APPROVED", // اگر نیاز دارید کامنت‌ها در لحظه تایید شوند این خط را فعال کنید
      },
      // دریافت اطلاعات کامنت ثبت شده برای نمایش لحظه‌ای در کلاینت
      include: {
        user: { select: { email: true } },
      },
    });

    // --- اصلاحیه: فقط اگر کامنت پاسخ بود، والد را آپدیت کن ---
    if (parentId) {
      await db.comment.update({
        where: { id: parentId },
        data: { updatedAt: new Date() }, 
      });
    }
    // --------------------------------------------------------



   // 👈 ۲. ثبت نوتیفیکیشن با استفاده از متغیرهای صحیح
    await db.notification.create({
      data: {
        // نکته: اگر در Prisma Enum شما مقدار TICKET است، اینجا را TICKET بنویسید
        type: "NEW_COMMENT", 
        message: `شما یک پیام جدید در بخش (کامنت) دارید `, // استفاده از subject به جای title
        referenceId: newComment.id, // گرفتن آیدی از تیکتی که در بالا ساخته شد
        isRead: false
      }
    });




    revalidatePath(`/resources/course/${productId}`);

    return {
      success: true,
      message: "دیدگاه با موفقیت ثبت شد.",
      data: newComment,
      isReply: !!parentId,
    };
  } catch (error) {
    console.error("Comment Error:", error);
    return { error: "خطایی در ثبت دیدگاه رخ داد." };
  }
}
