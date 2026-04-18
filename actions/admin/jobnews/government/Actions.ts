"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// واکشی لیست اخبار
export async function fetchDataNewsGovAction() {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند لیست اخبار را مشاهده کند." 
      };
    }

    const result = await db.governmentNews.findMany({
        orderBy: { createdAt: "desc" },
    });

    if (result.length === 0) {
        return { success: false, message: "هیچ خبری یافت نشد.", data: [] };
    }

    return { success: true, data: result };

  } catch (error) {
    console.error("❌ Error in fetchDataNewsGovAction:", error);
    return { success: false, message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد." };
  }
}

// اکشن حذف خبر
