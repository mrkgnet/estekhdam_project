"use server";

import { db } from "@/lib/db";

export async function fetchNumberQuestoinAction() {
  try {
    // استفاده از count برای شمارش کل سوالات با شرط مورد نظر
    const count = await db.question.count({
      
    });

    return { success: true, data: count };
  } catch (error) {
    console.error("❌ Error fetching questions count:", error);
    return { success: false, data: 0 };
  }
}