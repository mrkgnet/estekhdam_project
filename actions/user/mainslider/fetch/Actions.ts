"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

// اجرای تابع پریزما در بستر کش سرور Next.js
const getCachedMainSlider = unstable_cache(
  async () => {
    try {
      const result = await db.governmentNews.findMany({
        where: { isActive: true, isMainSlider: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          imageUrl: true,
          title: true,
          description: true,
          registerUrl: true,
          slugNews: true,
          startAt: true,
          endAt: true,
          examAt: true,
          price: true,
          maxAge: true,
          status: true,
        },
      });

      const formattedSliders = result.map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl || "",
        title: item.title,
        description: item.description,
        targetLink: item.registerUrl || `/news/${item.slugNews}`,
        slugNews: item.slugNews,
        startAt: item.startAt ? item.startAt.toISOString() : null,
        endAt: item.endAt ? item.endAt.toISOString() : null,
        examAt: item.examAt ? item.examAt.toISOString() : null,
        price: item.price ?? null,
        maxAge: item.maxAge ?? null,
        status: item.status ?? null,
      }));

      return { success: true, data: formattedSliders };
    } catch (error) {
      console.error("❌ Error fetching user main slider:", error);
      return { success: false, data: [] };
    }
  },
  ["main-slider-cache-key"],
  {
    tags: ["main-slider"],
    revalidate: 60 * 60 * 24, // ۲۴ ساعت به عنوان Fallback
  }
);

// فقط تابع async اکسپورت می‌شود تا خطای Next.js داده نشود
export async function fetchMainSliderUserAction() {
  return await getCachedMainSlider();
}