"use server" 
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db"; // یا prisma

export async function fetchDataProfileAction() {
  try {
    const currentUser = await infoCurentUser();

    // بررسی لاگین بودن کاربر
    if (!currentUser || currentUser.role !== "user") {
      return { success: false, message: "دسترسی غیرمجاز.", data: null };
    }

    // دریافت اطلاعات کاربر از دیتابیس
    const user = await db.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        nationalCode: true,
        email: true,
        gender: true,
        // birthDate: true,
      }
    });

    if (!user) {
      return { success: false, message: "کاربر یافت نشد.", data: null };
    }

    return { success: true, data: user };

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, message: "خطای سرور.", data: null };
  }
}
