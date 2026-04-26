"use server";

import { db } from "@/lib/db";

export async function getApprovedComments(productId: string) {
  try {
    const comments = await db.comment.findMany({
      where: {
        productId: productId,
        status: "APPROVED", // موقتا کامنت کنید تا مطمئن شویم دیتابیس خالی نیست
        parentId: null,
      },
      include: {
        user: {
          select: {
            role: true,
            phoneNumber: true, // <--- اضافه شد
            email: true, // <--- اضافه شد
          },
        },
        replies: {
          include: {
            user: {
              select: {
                role: true,
                phoneNumber: true, // <--- اضافه شد
                email: true, // <--- اضافه شد
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(comments);
    return { success: true, data: comments };
  } catch (error: any) {
    return { success: false, data: [], error: error.message }; // پیغام خطا را به کلاینت بفرستید
  }
}
