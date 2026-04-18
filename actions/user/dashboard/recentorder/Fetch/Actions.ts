"use server" 
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataROUAction() {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      console.log("❌ Access denied: User is not logged in");
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
        data: [] 
      };
    }

    const userId = currentUser.userId;

    // دریافت لیست تمامی سفارش‌های اخیر کاربر (بدون فیلتر وضعیت خاص)
    const recentOrders = await db.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true // برای دریافت نام دوره‌ای که خریداری شده
      },
      orderBy: {
        createdAt: 'desc' // جدیدترین سفارش‌ها اول باشند
      },
      take: 5 // نمایش ۵ سفارش آخر در داشبورد
    });

    return { 
      success: true, 
      data: recentOrders 
    };

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { 
      success: false, 
      data: [] 
    };
  }
}
