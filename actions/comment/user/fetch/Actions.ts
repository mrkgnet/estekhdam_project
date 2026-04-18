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
            email: true,
          },
        },
        replies: {
          include: {
            user: {
              select:{
                email:true
              }
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: comments };
  } catch (error: any) {
    return { success: false, data: [], error: error.message }; // پیغام خطا را به کلاینت بفرستید
  }
}
