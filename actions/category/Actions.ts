import { db } from "@/lib/db";
import { CategoryType } from "@prisma/client";

/**
 * مپینگ نگاشت slugهای فارسی/URL به Enumهای واقعی Prisma
 * (در صورت نیاز مقادیر سمت راست را بر اساس Enumهای تعریف شده در schema.prisma خود تنظیم کنید)
 */
const categoryQueryToEnumMap: Record<string, CategoryType> = {
  "بانک-سوالات": CategoryType.QUESTIONS,
  "دفترچه-های-استخدامی": CategoryType.BOOKLETS,
  "free-resources": CategoryType.FREE,
};

/**
 * تابع کمکی جهت تبدیل هر نوع ورودی (String/Slug/Enum) به Enum معتبر Prisma
 */
function resolveCategoryType(typeInput?: string | CategoryType): CategoryType | undefined {
  if (!typeInput) return undefined;

  // ۱. بررسی مپینگ رشته‌های URL به Enum
  if (categoryQueryToEnumMap[typeInput]) {
    return categoryQueryToEnumMap[typeInput];
  }

  // ۲. بررسی اینکه آیا ورودی مستقیماً یک مقدار معتبر از CategoryType Enum است
  if (Object.values(CategoryType).includes(typeInput as CategoryType)) {
    return typeInput as CategoryType;
  }

  // در صورت غیرمعتبر بودن ورودی، undefined برگردانده می‌شود تا کوئری کرش نکند
  return undefined;
}

/**
 * تابع اول: دریافت تمام دسته‌بندی‌ها بدون شرط parentId
 */
export async function getDataCategory(typeInput?: string | CategoryType) {
  try {
    const validCategoryType = resolveCategoryType(typeInput);

    const categories = await db.category.findMany({
      where: validCategoryType ? { type: validCategoryType } : undefined,
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
export async function GetCategoriDataAction(typeInput?: string | CategoryType) {
  try {
    const validCategoryType = resolveCategoryType(typeInput);

    const categoriesWithChildren = await db.category.findMany({
      where: {
        ...(validCategoryType ? { type: validCategoryType } : {}),
        parentId: null, // فقط دسته‌های والد/اصلی واکشی می‌شوند
      },
      include: {
        children: {
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