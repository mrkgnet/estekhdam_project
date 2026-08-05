"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// تابع کمکی برای پاکسازی اسلاگ در سمت سرور
function cleanSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // تبدیل فاصله‌ها به خط تیره
    .replace(/[^\w\u0600-\u06FF\-]+/g, "") // حذف کاراکترهای غیرمجاز
    .replace(/\-\-+/g, "-"); // جلوگیری از تکرار خط تیره
}

export async function getSubscriptionPlans() {
  try {
    return await db.subscriptionPlan.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw new Error("خطا در دریافت لیست پلن‌ها");
  }
}

export async function createSubscriptionPlan(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const rawSlug = formData.get("slug") as string;
    const slug = cleanSlug(rawSlug);

    const durationDays = parseInt(formData.get("durationDays") as string, 10);
    const price = parseInt(formData.get("price") as string, 10);
    const discountPriceRaw = formData.get("discountPrice") as string;
    const discountPrice = discountPriceRaw ? parseInt(discountPriceRaw, 10) : null;
    const description = (formData.get("description") as string) || null;
    const featuresRaw = formData.get("features") as string;
    const features = featuresRaw
      ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];
    const isPopular = formData.get("isPopular") === "true";
    const isActive = formData.get("isActive") === "true";

    await db.subscriptionPlan.create({
      data: {
        title,
        slug,
        durationDays,
        price,
        discountPrice,
        description,
        features,
        isPopular,
        isActive,
      },
    });

    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Error creating plan:", error);
    return { success: false, error: "خطا در ایجاد پلن (احتمال تکراری بودن اسلاگ)" };
  }
}

export async function updateSubscriptionPlan(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const rawSlug = formData.get("slug") as string;
    const slug = cleanSlug(rawSlug);

    const durationDays = parseInt(formData.get("durationDays") as string, 10);
    const price = parseInt(formData.get("price") as string, 10);
    const discountPriceRaw = formData.get("discountPrice") as string;
    const discountPrice = discountPriceRaw ? parseInt(discountPriceRaw, 10) : null;
    const description = (formData.get("description") as string) || null;
    const featuresRaw = formData.get("features") as string;
    const features = featuresRaw
      ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];
    const isPopular = formData.get("isPopular") === "true";
    const isActive = formData.get("isActive") === "true";

    await db.subscriptionPlan.update({
      where: { id },
      data: {
        title,
        slug,
        durationDays,
        price,
        discountPrice,
        description,
        features,
        isPopular,
        isActive,
      },
    });

    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false, error: "خطا در ویرایش پلن" };
  }
}

export async function deleteSubscriptionPlan(id: string) {
  try {
    await db.subscriptionPlan.delete({
      where: { id },
    });

    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return {
      success: false,
      error: "امکان حذف این پلن وجود ندارد (ممکن است دارای تراکنش یا اشتراک فعال باشد)",
    };
  }
}

// اکشن مخصوص دریافت پلن‌های فعال برای کاربران
export async function GetDataPlansUser() {
  try {
    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        discountPrice: true,
        isPopular: true,
        durationDays: true,
      },
      orderBy: { price: "asc" },
    });

    return { success: true, data: plans };
  } catch (error) {
    console.error("Error fetching user plans:", error);
    return { success: false, error: "خطا در دریافت لیست پلن‌ها", data: [] };
  }
}



export async function GetDataFactorPlansUser(id: string) {
  try {
    if (!id) {
      return { success: false, error: "شناسه پلن معتبر نیست", data: null };
    }

    const plan = await db.subscriptionPlan.findUnique({
      where: {
        id: id,
        isActive: true, // فقط پلن‌های فعال قابل فاکتور شدن هستند
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        discountPrice: true,
        durationDays: true,
        description: true,
      },
    });

    if (!plan) {
      return { success: false, error: "پلن مورد نظر یافت نشد یا غیرفعال است", data: null };
    }

    // نگاشت داده به ساختار مورد نیاز فاکتور
    const productData = {
      id: plan.id,
      name: plan.title,
      oldPrice: plan.price,
      newPrice: plan.discountPrice && plan.discountPrice < plan.price ? plan.discountPrice : plan.price,
      description: plan.description,
      durationDays: plan.durationDays,
    };

    return { success: true, data: productData };
  } catch (error) {
    console.error("Error fetching plan factor data:", error);
    return { success: false, error: "خطا در دریافت اطلاعات فاکتور", data: null };
  }
}