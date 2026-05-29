"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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