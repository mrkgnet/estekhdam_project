'use server'
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteChapterSAction(id: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    await db.chapter.delete({
      where: { id }
    });

    // بروزرسانی کش صفحه برای نمایش تغییرات
    revalidatePath(`/adminp/chapter/${id}`);

    return { success: true, message: "فصل با موفقیت حذف شد." };
  } catch (error) {
    console.error("❌ Error in deleteNewsGovAction:", error);
    return { success: false, message: "خطایی در حذف خبر رخ داد." };
  }
}
