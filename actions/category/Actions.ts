import { db } from "@/lib/db";
import { CategoryType } from "@prisma/client";

/**
 * تابع اول: دریافت تمام دسته‌بندی‌ها بدون شرط parentId
 */
export async function getDataCategory(type?: CategoryType) {
  try {
    const categories = await db.category.findMany({
      where: type ? { type } : undefined,
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!categories || categories.length === 0) {
      return {
        success: false,
        message: "داده‌ای یافت نشد",
        data: [],
      };
    }

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return {
      success: false,
      data: [],
      error: "خطایی در دریافت دسته‌بندی‌ها رخ داد.",
    };
  }
}

/**
 * تابع دوم: دریافت دسته‌بندی‌های اصلی (اصلی‌ها parentId ندارند) به همراه فرزندانشان (children)
 */
export async function GetCategoriDataAction(type?: CategoryType) {
  try {
    const categoriesWithChildren = await db.category.findMany({
      where: {
        ...(type ? { type } : {}),
        parentId: null, // فقط دسته‌های والد/اصلی واکشی می‌شوند
      },
      include: {
        children: { // واکشی زیرمجموعه‌ها طبق اسم رابطه در Prisma
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!categoriesWithChildren || categoriesWithChildren.length === 0) {
      return {
        success: false,
        message: "داده‌ای یافت نشد",
        data: [],
      };
    }

    return {
      success: true,
      data: categoriesWithChildren,
    };
  } catch (error) {
    console.error("❌ Error fetching categories with children:", error);
    return {
      success: false,
      data: [],
      error: "خطایی در دریافت دسته‌بندی‌ها و زیرمجموعه‌ها رخ داد.",
    };
  }
}