"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// دریافت همه بنرها
export async function getAllBanners() {
  try {
    const banners = await db.topBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: banners };
  } catch (error) {
    return { success: false, error: "خطا در واکشی اطلاعات" };
  }
}

// دریافت آخرین بنر فعال ثبت‌شده
export async function getLatestActiveBanner() {
  try {
    const latestBanner = await db.topBanner.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: latestBanner };
  } catch (error) {
    return { success: false, error: "خطا در واکشی آخرین بنر" };
  }
}



export async function createBannerAction(prevState, formData) {
  try {
    const title = formData.get("title");
    const imageUrl = formData.get("imageUrl");
    const targetUrl = formData.get("targetUrl");
    const slug = formData.get("slug");
    // اگر چک‌باکس تیک خورده باشد مقدار on برمی‌گرداند
    const isActive = formData.get("isActive") === "on";

    if (!title || !imageUrl || !targetUrl || !slug) {
      return { error: "لطفا تمام فیلدهای ضروری را پر کنید." };
    }

    await db.topBanner.create({
      data: {
        title,
        imageUrl,
        targetUrl,
        slug,
        isActive,
      },
    });

    // رفرش کردن کش صفحه برای نمایش تغییرات جدید
    revalidatePath("/adminp/top-banner"); 

    return { success: "بنر با موفقیت ایجاد شد!", clearForm: true };
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: "این اسلاگ قبلاً استفاده شده است." };
    }
    return { error: "خطایی در ثبت بنر رخ داد." };
  }
}




export async function updateBannerAction(prevState, formData) {
  try {
    const id = formData.get("id");
    const title = formData.get("title");
    const imageUrl = formData.get("imageUrl");
    const targetUrl = formData.get("targetUrl");
    const slug = formData.get("slug");
    const isActive = formData.get("isActive") === "on";

    await db.topBanner.update({
      where: { id },
      data: { title, imageUrl, targetUrl, slug, isActive },
    });

    revalidatePath("/adminp/top-banner");
    return { success: "تغییرات با موفقیت ذخیره شد!", clearForm: false };
  } catch (error) {
    return { error: "خطا در ویرایش بنر" };
  }
}


export async function deleteBannerAction(id) {
  try {
    await db.topBanner.delete({ where: { id } });
    revalidatePath("/adminp/top-banner");
    return { success: true };
  } catch (error) {
    return { success: false, error: "خطا در حذف بنر" };
  }
}