import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataChapterAction(id: string) {
  try {
   
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      // به جای NextResponse، یک آرایه خالی برمی‌گردانیم تا UI دچار خطا نشود
      return [];
    }

    // ۲. دریافت مستقیم اطلاعات از دیتابیس (سریع‌ترین روش ممکن)
    const questionData = await db.chapter.findMany({
      where: {
        productId: id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ۳. برگرداندن مستقیم دیتا (بدون نیاز به fetch یا ساخت کوکی)
    return questionData;
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت محصولات از دیتابیس: ", error);
    return []; // در صورت خطا، آرایه خالی برمی‌گردانیم
  }
}
