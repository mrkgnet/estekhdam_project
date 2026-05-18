'use server';

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteAllQuestionCourseAction(productId: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز: شما ادمین نیستید." 
      };
    }

    // استفاده از deleteMany برای پاک کردن تمام سوالات مرتبط با یک productId
    const res = await db.question.deleteMany({
        where: { 
            productId: productId
        }
    });

    revalidatePath(`/adminp/questions/${productId}`); 

    return {
        success: true, 
        message: `تعداد ${res.count} سوال با موفقیت از این محصول حذف شد.`
    };

  } catch (error) {
    console.error("خطا در حذف سوالات:", error);
    return { 
        success: false, 
        message: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' 
    };
  }
}
