"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

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
    // این تابع نباید از Data Cache استفاده کند.
    noStore();

    const latestBanner = await db.topBanner.findFirst({
      where: {
        isActive: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: latestBanner,
    };
  } catch (error) {
    console.error("getLatestActiveBanner error:", error);

    return {
      success: false,
      error: "خطا در واکشی آخرین بنر",
    };
  }
}

export async function createBannerAction(prevState: any, formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim();
    const imageUrlRaw = (formData.get("imageUrl") as string)?.trim();
    const targetUrlRaw = (formData.get("targetUrl") as string)?.trim();
    const newsStatusRaw = formData.get("newsStatus") as string;
    const isActive = formData.get("isActive") === "on";

    // فیلدهای ضروری
    if (!title || !slug) {
      return { error: "لطفاً عنوان و اسلاگ بنر را وارد کنید." };
    }

    // فیلدهای اختیاری
    const imageUrl = imageUrlRaw || null;
    const targetUrl = targetUrlRaw || null;
    const newsStatus = newsStatusRaw && newsStatusRaw !== "NONE" ? newsStatusRaw : null;

    await db.topBanner.create({
      data: {
        title,
        slug,
        imageUrl,
        targetUrl,
        isActive,
        newsStatus,
      },
    });

    revalidatePath("/adminp/top-banner");
    return { success: "بنر با موفقیت ایجاد شد!", clearForm: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "این اسلاگ قبلاً استفاده شده است." };
    }
    return { error: "خطایی در ثبت بنر رخ داد." };
  }
}

export async function updateBannerAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim();
    const imageUrlRaw = (formData.get("imageUrl") as string)?.trim();
    const targetUrlRaw = (formData.get("targetUrl") as string)?.trim();
    const newsStatusRaw = formData.get("newsStatus") as string;
    const isActive = formData.get("isActive") === "on";

    if (!id) {
      return { error: "شناسه بنر نامعتبر است." };
    }

    if (!title || !slug) {
      return { error: "لطفاً عنوان و اسلاگ بنر را وارد کنید." };
    }

    const imageUrl = imageUrlRaw || null;
    const targetUrl = targetUrlRaw || null;
    const newsStatus = newsStatusRaw && newsStatusRaw !== "NONE" ? newsStatusRaw : null;

    await db.topBanner.update({
      where: { id },
      data: {
        title,
        slug,
        imageUrl,
        targetUrl,
        isActive,
        newsStatus,
      },
    });

    revalidatePath("/adminp/top-banner");
    return { success: "تغییرات با موفقیت ذخیره شد!", clearForm: false };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "این اسلاگ قبلاً استفاده شده است." };
    }
    return { error: "خطا در ویرایش بنر" };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await db.topBanner.delete({ where: { id } });
    revalidatePath("/adminp/top-banner");
    return { success: true };
  } catch (error) {
    return { success: false, error: "خطا در حذف بنر" };
  }
}