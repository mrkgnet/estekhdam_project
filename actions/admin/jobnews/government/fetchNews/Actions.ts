'use server'
import { db } from "@/lib/db";

export async function getDataEditNewsGov(id: string) {
  try {
    if (!id) {
      return { success: false, message: "شناسه آگهی نامعتبر است" };
    }

    const product = await db.governmentNews.findUnique({
      where: { id: id },
    });

    if (!product) {
      return { success: false, message: "آگهی یافت نشد" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("خطا در دریافت اطلاعات آگهی:", error);
    return { success: false, message: "خطایی در دریافت اطلاعات دیتابیس رخ داد" };
  }
}