'use server'

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getMainSliderDataAction() {
  try {
    const currentUser = await infoCurentUser();

    // ۱. بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز.",
        data: [] 
      };
    }

    // ۲. دریافت اطلاعات اسلایدرها از دیتابیس (مرتب شده بر اساس جدیدترین)
    const sliders = await db.mainSlider.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      message: "اطلاعات با موفقیت دریافت شد.",
      data: sliders
    };

  } catch (error) {
    console.error("Error fetching sliders:", error);
    return { 
      success: false, 
      message: "خطایی در دریافت اطلاعات اسلایدرها رخ داد.",
      data: []
    };
  }
}
