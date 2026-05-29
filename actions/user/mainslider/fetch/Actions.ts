"use server";

import { db } from "@/lib/db";

export async function fetchMainSliderUserAction() {
  try {
    const result = await db.governmentNews.findMany({
      where: {
        isActive: true,
        isMainSlider: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true, 
        registerUrl: true, 
        slugNews: true,    
        endAt: true,       
      },
    });

    const formattedSliders = result.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl || "", 
      title: item.title,
      description: item.description,
      targetLink: item.registerUrl || `/news/${item.slugNews}`, 
      slugNews: item.slugNews, // ✅ این خط فراموش شده بود!
      endAt: item.endAt ? item.endAt.toISOString() : null,
    }));

    return { success: true, data: formattedSliders };
  } catch (error) {
    console.error("❌ Error fetching user main slider:", error);
    return { success: false, data: [] };
  }
}