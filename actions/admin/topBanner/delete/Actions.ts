"use server"

import { db } from "@/lib/db";


import { revalidatePath } from "next/cache";

export async function deleteBannerAction(id) {
  try {
    await db.topBanner.delete({ where: { id } });
    revalidatePath("/adminp/top-banner");
    return { success: true };
  } catch (error) {
    return { success: false, error: "خطا در حذف بنر" };
  }
}