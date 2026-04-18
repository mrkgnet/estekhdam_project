import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { success } from "zod";

export async function getDataCategory() {
  try {
   
 

    // ۲. دریافت داده‌ها از دیتابیس
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if(!categories){
      return{
        success:false,
        message:"Not Data"
      }
    }

    // ۳. تغییر نام فیلدها (Mapping) برای هماهنگی با فرانت‌اند
   

    // ۴. خروجی موفقیت‌آمیز
    return {
      success: true,
      data: categories,
    };

  } catch (error) {
    // ۵. مدیریت خطای سرور
    console.error("❌ Error fetching categories:", error);
    
    // خروجی ساختاریافته در صورت قطعی دیتابیس یا خطای دیگر
    return { 
      success: false, 
      categories: [], 
      error: "خطایی در دریافت دسته‌بندی‌ها رخ داد." 
    };
  }
}
