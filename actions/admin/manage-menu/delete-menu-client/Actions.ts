"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteItemMenuAction(id: string) {
  try {
    if (!id) {
      return { success: false, message: "آیدی منو یافت نشد." };
    }

    await db.menuClient.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/adminp/menus");

    return {
      success: true,
      message: `منو با موفقیت حذف شد.`,
    };
  } catch (error) {
    console.error("❌ Error in delete menu action:", error);

    return {
      success: false,
      message: "خطایی در برقراری ارتباط با پایگاه داده رخ داد.",
    };
  }
}
