
"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// ============================================
// Types
// ============================================

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  reference?: T;
};

type ReferencePayload = {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
};

// ============================================
// Helpers
// ============================================

function cleanSlug(value: string): string {
  return value
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFormString(
  formData: FormData,
  field: string
): string {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
}

async function isAdmin(): Promise<boolean> {
  const currentUser = await infoCurentUser();

  return currentUser?.role === "admin";
}

function serializeReference(reference: {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
}): ReferencePayload {
  return {
    id: reference.id,
    title: reference.title,
    slug: reference.slug,
    isActive: reference.isActive,
    createdAt: reference.createdAt.toISOString(),
  };
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = (error as { code?: unknown }).code;

    if (code === "P2002") {
      return "عنوان یا اسلاگ از قبل وجود دارد.";
    }

    if (code === "P2025") {
      return "رفرنس موردنظر یافت نشد یا قبلاً حذف شده است.";
    }

    if (code === "P2003") {
      return "این رفرنس دارای اطلاعات وابسته است و امکان حذف آن وجود ندارد.";
    }
  }

  return "خطایی در پردازش اطلاعات رخ داد. مجدداً تلاش کنید.";
}

// ============================================
// Get References
// ============================================

export async function getQuestionReferences(
  page: number = 1,
  limit: number = 10,
  searchQuery: string = ""
) {
  const emptyResult = {
    references: [],
    totalPages: 0,
    totalCount: 0,
  };

  try {
    if (!(await isAdmin())) {
      return {
        ...emptyResult,
        error: "دسترسی غیرمجاز.",
      };
    }

    const safePage = Math.max(
      1,
      Number.isFinite(page) ? Math.floor(page) : 1
    );

    const safeLimit = Math.min(
      100,
      Math.max(
        1,
        Number.isFinite(limit) ? Math.floor(limit) : 10
      )
    );

    const query = searchQuery.trim().slice(0, 100);
    const skip = (safePage - 1) * safeLimit;

    const whereClause = query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              slug: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [totalCount, references] = await db.$transaction([
      db.questionReference.count({
        where: whereClause,
      }),

      db.questionReference.findMany({
        where: whereClause,
        skip,
        take: safeLimit,
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      }),
    ]);

    return {
      references,
      totalPages: Math.ceil(totalCount / safeLimit),
      totalCount,
      error: null,
    };
  } catch (error) {
    console.error(
      "Error fetching question references:",
      error
    );

    return {
      ...emptyResult,
      error: "خطا در دریافت رفرنس‌ها.",
    };
  }
}

// ============================================
// Create Reference
// ============================================

export async function createQuestionReferenceAction(
  formData: FormData
): Promise<ActionResult<ReferencePayload>> {
  try {
    if (!(await isAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    const title = getFormString(formData, "title");
    const rawSlug = getFormString(formData, "slug");
    const slug = cleanSlug(rawSlug);

    if (!title || !slug) {
      return {
        success: false,
        message: "عنوان و اسلاگ الزامی هستند.",
      };
    }

    if (title.length > 200 || slug.length > 200) {
      return {
        success: false,
        message: "عنوان و اسلاگ نباید بیشتر از ۲۰۰ کاراکتر باشند.",
      };
    }

    const duplicate = await db.questionReference.findFirst({
      where: {
        OR: [
          { title },
          { slug },
        ],
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      return {
        success: false,
        message: "عنوان یا اسلاگ رفرنس از قبل وجود دارد.",
      };
    }

    const created = await db.questionReference.create({
      data: {
        title,
        slug,
        isActive: true,
      },
    });

    return {
      success: true,
      message: `رفرنس "${title}" با موفقیت ایجاد شد.`,
      reference: serializeReference(created),
    };
  } catch (error) {
    console.error(
      "Error creating question reference:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

// ============================================
// Update Reference
// ============================================

export async function updateQuestionReferenceAction(
  formData: FormData
): Promise<ActionResult<ReferencePayload>> {
  try {
    if (!(await isAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    const id = getFormString(formData, "id");
    const title = getFormString(formData, "title");
    const rawSlug = getFormString(formData, "slug");
    const slug = cleanSlug(rawSlug);

    if (!id) {
      return {
        success: false,
        message: "شناسه رفرنس مشخص نیست.",
      };
    }

    if (!title || !slug) {
      return {
        success: false,
        message: "عنوان و اسلاگ الزامی هستند.",
      };
    }

    if (title.length > 200 || slug.length > 200) {
      return {
        success: false,
        message: "عنوان و اسلاگ نباید بیشتر از ۲۰۰ کاراکتر باشند.",
      };
    }

    const duplicate = await db.questionReference.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          { title },
          { slug },
        ],
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      return {
        success: false,
        message: "عنوان یا اسلاگ با رفرنس دیگری تداخل دارد.",
      };
    }

    const updated = await db.questionReference.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
      },
    });

    return {
      success: true,
      message: "رفرنس با موفقیت ویرایش شد.",
      reference: serializeReference(updated),
    };
  } catch (error) {
    console.error(
      "Error updating question reference:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

// ============================================
// Toggle Reference Status
// ============================================

export async function toggleQuestionReferenceStatusAction(
  id: string,
  nextStatus: boolean
): Promise<ActionResult> {
  try {
    if (!(await isAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    if (!id || typeof nextStatus !== "boolean") {
      return {
        success: false,
        message: "اطلاعات تغییر وضعیت نامعتبر است.",
      };
    }

    await db.questionReference.update({
      where: {
        id,
      },
      data: {
        isActive: nextStatus,
      },
    });

    return {
      success: true,
      message: nextStatus
        ? "رفرنس فعال شد."
        : "رفرنس غیرفعال شد.",
    };
  } catch (error) {
    console.error(
      "Error toggling question reference:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

// ============================================
// Delete Reference
// ============================================

export async function deleteQuestionReferenceAction(
  id: string
): Promise<ActionResult> {
  try {
    if (!(await isAdmin())) {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    if (!id) {
      return {
        success: false,
        message: "شناسه رفرنس نامعتبر است.",
      };
    }

    // جلوگیری از حذف رفرنسی که سؤال دارد
    const reference = await db.questionReference.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!reference) {
      return {
        success: false,
        message: "رفرنس موردنظر یافت نشد.",
      };
    }

    if (reference._count.questions > 0) {
      return {
        success: false,
        message:
          "این رفرنس دارای سؤال است. ابتدا ارتباط سؤال‌ها را بررسی کنید.",
      };
    }

    await db.questionReference.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "رفرنس با موفقیت حذف شد.",
    };
  } catch (error) {
    console.error(
      "Error deleting question reference:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
