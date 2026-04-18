import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataQuestion(id: string) {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      // به جای NextResponse، یک آرایه خالی برمی‌گردانیم تا UI دچار خطا نشود
      return [];
    }

    // ۲. دریافت مستقیم اطلاعات از دیتابیس (سریع‌ترین روش ممکن)
    const questionData = await db.question.findMany({
      where: {
        productId: id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        // 👇 این بخش اضافه شد تا اطلاعات سرفصل هم واکشی شود 👇
        chapter: {
          select: {
            id: true,
            title: true,
            order: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ۳. برگرداندن مستقیم دیتا
    return questionData;
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت سوالات از دیتابیس: ", error);
    return []; // در صورت خطا، آرایه خالی برمی‌گردانیم
  }
}
