"use server" 
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataMDAction() {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      console.log("❌ Access denied: User is not logged in");
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
        data: [] // برگرداندن آرایه خالی
      };
    }

    const userId = currentUser.userId;

    // دریافت لیست سفارش‌های موفق کاربر به همراه اطلاعات محصول (دوره)
    const successfulOrders = await db.order.findMany({
      where: {
        userId: userId,
        status: "SUCCESS" // مطمئن شوید وضعیت تراکنش موفق در دیتابیس همین مقدار است
      },
      include: {
        product: true // 👈 واکشی اطلاعات دوره‌ای که خریداری شده
      },
      orderBy: {
        createdAt: 'desc' // مرتب‌سازی از جدیدترین به قدیمی‌ترین
      },
     
    });

    return { 
      success: true, 
      data: successfulOrders 
    };

  } catch (error) {
    console.error("Error fetching user courses:", error);
    return { 
      success: false, 
      data: [] 
    };
  }
}
