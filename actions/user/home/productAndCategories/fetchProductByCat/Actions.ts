// فایل: actions/user/home/productAndCategories/fetch/Actions.ts
"use server";

import { db } from "@/lib/db";

export async function productByCatAction() {
  try {
    // 🟢 ۱. واکشی دسته‌های اصلی به همراه زیردسته‌هایشان (بدون products)
    const rootCategories = await db.category.findMany({
      where: {
        OR: [{ parentId: null }, { parentId: { isSet: false } }],
      },
      include: {
        children: true, // فقط زیردسته‌ها را می‌گیریم
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (rootCategories.length === 0) {
      return { success: true, data: [] };
    }

    // 🟢 ۲. استخراج تمام آیدی‌ها (دسته‌های اصلی + زیردسته‌ها) برای واکشی محصولات
    const allCategoryIds = new Set<string>();
    rootCategories.forEach((cat) => {
      allCategoryIds.add(cat.id);
      cat.children.forEach((child) => allCategoryIds.add(child.id));
    });

    // 🟢 ۳. واکشی تمام محصولات جدیدی که متعلق به این دسته‌بندی‌ها هستند
    const products = await db.product.findMany({
      where: {
        categoryIds: { hasSome: Array.from(allCategoryIds) },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 🟢 تابع کمکی: فیلتر کردن محصولات برای یک آیدی خاص (حداکثر ۱۰ تا)
    const getProductsForCategory = (categoryId: string) => {
      return products
        .filter((p) => p.categoryIds.includes(categoryId))
        .slice(0, 10);
    };

    // 🟢 ۴. ترکیب محصولات با دسته‌بندی‌ها در ساختاری که فرانت‌اند نیاز دارد
    const categoriesWithProducts = rootCategories.map((cat) => ({
      ...cat,
      // متصل کردن محصولات دسته اصلی
      products: getProductsForCategory(cat.id), 
      
      // متصل کردن محصولات به هر زیردسته
      children: cat.children.map((child) => ({
        ...child,
        products: getProductsForCategory(child.id),
      })),
    }));

    return {
      success: true,
      data: categoriesWithProducts,
    };
  } catch (error) {
    console.error("Error fetching nested categories and products:", error);
    return {
      success: false,
      data: [],
      message: "خطا در برقراری ارتباط با دیتابیس",
    };
  }
}
