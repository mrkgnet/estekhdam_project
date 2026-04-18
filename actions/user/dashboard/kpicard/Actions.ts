"use server" 
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchDataKPIC() {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      console.log("❌ Access denied: User is not logged in");
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
        data: { activeCourses: 0 }
      };
    }

    const userId = currentUser.userId;
    

    // شمارش تعداد سفارش‌های موفق کاربر از دیتابیس
    // نکته: اگر وضعیت تراکنش موفق در دیتابیس شما "PAID" یا چیز دیگری است، کلمه "SUCCESS" را تغییر دهید.
    const successfulOrdersCount = await db.order.count({
      where: {
        userId: userId,
        status: "SUCCESS" 
      }
    });

    return { 
      success: true, 
      data: { activeCourses: successfulOrdersCount } 
    };

  } catch (error) {
    console.error("Error fetching KPI counts:", error);
    return { 
      success: false, 
      data: { activeCourses: 0 } 
    };
  }
}
