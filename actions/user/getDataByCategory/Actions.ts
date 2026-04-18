"use server" 
import { db } from "@/lib/db";

export async function fetchDataByCategory(slug: string) {
  try {
    // ۱. ابتدا فقط خود دسته‌بندی را پیدا می‌کنیم
    const category = await db.category.findUnique({
      where: { 
        catSlug: slug 
      },
    });

    if (!category) {
      return { success: false, data: null };
    }

    // ۲. حالا محصولاتی را می‌گیریم که آیدی این دسته در آرایه categoryIds آن‌ها وجود دارد
    const products = await db.product.findMany({
      where: {
        categoryIds: {
          has: category.id // 🟢 استفاده از has برای جستجو در آرایه
        }
      },
      // در صورت نیاز به مرتب‌سازی محصولات (مثلا جدیدترین‌ها):
      orderBy: {
        createdAt: 'desc'
      }
    });

    // ۳. داده‌ها را ترکیب می‌کنیم تا ساختاری که فرانت‌اند انتظار دارد (category.products) حفظ شود
    const resultData = {
      ...category,
      products: products
    };

    return { success: true, data: resultData };
    
  } catch (error) {
    console.error("Error fetching category products:", error);
    return { success: false, data: null };
  }
}
