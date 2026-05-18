"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function fetchCategoryChapter() {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند دسته‌بندی‌ها را مشاهده کند.",
        data: []
      };
    }

    // دریافت تمام دسته‌بندی‌ها با ترتیب نزولی بر اساس تاریخ ایجاد
    const categories = await db.categoryChapter.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { 
      success: true, 
      message: "دسته‌بندی‌ها با موفقیت دریافت شدند.",
      data: categories
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { 
      success: false, 
      message: "خطایی در دریافت دسته‌بندی‌ها رخ داد.",
      data: []
    };
  }
}
