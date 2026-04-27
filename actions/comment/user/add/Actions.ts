"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addNewCommentUser(prevState: any, formData: FormData) {
  try {
    const text = formData.get("newComment") as string;
    const targetId = formData.get("targetId") as string;
    const targetType = formData.get("targetType") as string; // مثلا "product", "governmentNews", "blog"
    const parentId = formData.get("parentId") as string | null;
    const pathname = formData.get("pathname") as string; // گرفتن مسیر صفحه برای رفرش داینامیک
    console.log(targetId , " ----------" , targetType, '--------' , pathname)

    if (!text || text.length < 2) {
      return { error: "متن کامنت خیلی کوتاه است." };
    }

    let userId = null;
    try {
      const userToken = await infoCurentUser();
      if (userToken && userToken.userId) {
        userId = userToken.userId;
      }
    } catch (e) {
      // کاربر لاگین نیست
    }

    // تولید نام فیلد دیتابیس به صورت داینامیک (مثلا productId یا blogId)
    const fieldName = `${targetType}Id`;

    const commentData: any = {
      textComment: text,
      userId: userId,
      parentId: parentId ? parentId : null,
      status: "APPROVED",
      section:targetType,
      [fieldName]: targetId, // تخصیص داینامیک آیدی به فیلد مربوطه در دیتابیس
    };

    const newComment = await db.comment.create({
      data: commentData,
      include: {
        user: { select: { email: true } },
      },
    });

    if (parentId) {
      await db.comment.update({
        where: { id: parentId },
        data: { updatedAt: new Date() }, 
      });
    }

    await db.notification.create({
      data: {
        type: "NEW_COMMENT", 
        message: `شما یک پیام جدید در بخش کامنت‌های (${targetType}) دارید`,
        referenceId: newComment.id,
        isRead: false
      }
    });

    // رفرش کردن مسیر به صورت کاملا داینامیک
    if (pathname) {
      revalidatePath(pathname);
    }

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
