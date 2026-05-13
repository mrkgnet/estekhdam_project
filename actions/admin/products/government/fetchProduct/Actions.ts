"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getDataEditProduct(id: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "شما دسترسی لازم برای این کار را ندارید", product: null };
    }

    const productData = await db.product.findUnique({
      where: { id: id },
      include: {
        categories: {
          select: {
            id: true,
            catName: true
          }
        }
      }
    });

    if (!productData) {
      return { success: false, message: "محصول مورد نظر یافت نشد", product: null };
    }

    const formattedProduct = {
      ...productData,
      categoryIds: productData.categories.map(cat => cat.id)
    };

    return { success: true, message: "اطلاعات با موفقیت دریافت شد", product: formattedProduct };
  } catch (error) {
    console.error("❌ Error fetching product data:", error);
    return { success: false, message: "خطا در ارتباط با دیتابیس", product: null };
  }
}
