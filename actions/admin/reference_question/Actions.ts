"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const REVALIDATE_ROUTE = "/adminp/reference";

/**
 * دریافت لیست رفرنس‌ها با قابلیت صفحه‌بندی و سرچ
 */
export async function getQuestionReferences(page: number = 1, limit: number = 10, searchQuery: string = "") {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { references: [], totalPages: 0, totalCount: 0 };
    }

    const skip = (page - 1) * limit;

    const whereClause = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { slug: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [totalCount, references] = await db.$transaction([
      db.questionReference.count({ where: whereClause }),
      db.questionReference.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { questions: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { references, totalPages, totalCount };
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت رفرنس‌های سوالات: ", error);
    return { references: [], totalPages: 0, totalCount: 0 };
  }
}

/**
 * ثبت رفرنس سوال جدید
 */
export async function createQuestionReferenceAction(formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین مجاز است." };
    }

    const title = (formData.get("title") as string || "").trim();
    const rawSlug = (formData.get("slug") as string || "").trim();

    if (!title || !rawSlug) {
      return { success: false, message: "عنوان و اسلاگ رفرنس الزامی هستند." };
    }

    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF\-]/g, "");

    const existingReference = await db.questionReference.findFirst({
      where: {
        OR: [{ title }, { slug }],
      },
    });

    if (existingReference) {
      return { success: false, message: "عنوان یا اسلاگ رفرنس از قبل تکراری است." };
    }

    const newReference = await db.questionReference.create({
      data: {
        title,
        slug,
        isActive: true,
      },
    });

    revalidatePath(REVALIDATE_ROUTE);
    return { 
      success: true, 
      message: `رفرنس "${title}" با موفقیت ایجاد شد.`,
      reference: newReference
    };
  } catch (error) {
    console.error("🚨 Error creating question reference:", error);
    return { success: false, message: "خطایی در پردازش اطلاعات رخ داد." };
  }
}

/**
 * ویرایش اطلاعات رفرنس
 */
export async function updateQuestionReferenceAction(formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    const id = formData.get("id") as string;
    const title = (formData.get("title") as string || "").trim();
    const rawSlug = (formData.get("slug") as string || "").trim();

    if (!id) return { success: false, message: "شناسه رفرنس یافت نشد." };
    if (!title || !rawSlug) {
      return { success: false, message: "عنوان و اسلاگ الزامی هستند." };
    }

    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF\-]/g, "");

    // بررسی عدم تکراری بودن روی رکوردهای دیگر
    const duplicate = await db.questionReference.findFirst({
      where: {
        id: { not: id },
        OR: [{ title }, { slug }],
      },
    });

    if (duplicate) {
      return { success: false, message: "عنوان یا اسلاگ جدید با رفرنس دیگری تداخل دارد." };
    }

    const updated = await db.questionReference.update({
      where: { id },
      data: {
        title,
        slug,
      },
    });

    revalidatePath(REVALIDATE_ROUTE);
    return { 
      success: true, 
      message: "رفرنس با موفقیت ویرایش شد.",
      reference: updated 
    };
  } catch (error) {
    console.error("🚨 Error updating question reference:", error);
    return { success: false, message: "خطا در برقراری ارتباط با دیتابیس." };
  }
}

/**
 * تغییر وضعیت فعال/غیرفعال بودن رفرنس
 */
export async function toggleQuestionReferenceStatusAction(id: string, nextStatus: boolean) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    await db.questionReference.update({
      where: { id },
      data: { isActive: nextStatus },
    });

    revalidatePath(REVALIDATE_ROUTE);
    return { success: true, message: "وضعیت رفرنس به‌روزرسانی شد." };
  } catch (error) {
    console.error("🚨 Error toggling question reference status:", error);
    return { success: false, message: "خطا در تغییر وضعیت رکورد." };
  }
}

/**
 * حذف رفرنس سوال
 */
export async function deleteQuestionReferenceAction(id: string) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز." };
    }

    await db.questionReference.delete({
      where: { id },
    });

    revalidatePath(REVALIDATE_ROUTE);
    return { success: true, message: "رفرنس موردنظر با موفقیت حذف شد." };
  } catch (error) {
    console.error("🚨 Error deleting question reference:", error);
    return { success: false, message: "خطا در حذف رکورد از دیتابیس." };
  }
}