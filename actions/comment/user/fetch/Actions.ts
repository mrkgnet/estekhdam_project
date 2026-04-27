"use server";

import { db } from "@/lib/db";

export async function getApprovedComments(targetId: string, targetType: string) {
  try {
    // تبدیل targetType به نام فیلد در دیتابیس (مثلا product -> productId)
    const fieldName = `${targetType}Id`; 

    const comments = await db.comment.findMany({
      where: {
        [fieldName]: targetId,
        status: "APPROVED", // موقتا کامنت کنید تا مطمئن شویم دیتابیس خالی نیست
        parentId: null,
      },
      include: {
        user: {
          select: {
            role: true,
            phoneNumber: true,
            email: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                role: true,
                phoneNumber: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  
    return { success: true, data: comments };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}
