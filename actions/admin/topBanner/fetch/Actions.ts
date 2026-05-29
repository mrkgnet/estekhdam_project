"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ۱. دریافت همه بنرها
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