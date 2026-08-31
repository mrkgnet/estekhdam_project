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
        isActive: true,
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

    // محاسبه قیمت نهایی با پشتیبانی از قیمت صفر
    const newPrice =
      plan.discountPrice !== null && plan.discountPrice !== undefined && plan.discountPrice < plan.price
        ? plan.discountPrice
        : plan.price;

    const planData = {
      id: plan.id,
      name: plan.title,
      oldPrice: plan.price,
      newPrice: newPrice,
      description: plan.description,
      durationDays: plan.durationDays,
    };

    return { success: true, data: planData };
  } catch (error) {
    console.error("Error fetching plan factor data:", error);
    return { success: false, error: "خطا در دریافت اطلاعات فاکتور", data: null };
  }
}


// ------------------------------------------

export async function getUserSubscriptionsAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, message: "شناسه کاربر ارسال نشده است", data: [] };
    }

    const subscriptions = await db.userSubscription.findMany({
      where: {
        userId: userId,
      },
      include: {
        plan: {
          select: {
            title: true,
            durationDays: true,
            price: true,
          },
        },
        order: {
          select: {
            pricePaid: true,
            refId: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return {
      success: false,
      message: "خطا در دریافت لیست اشتراک‌های کاربر",
      data: [],
    };
  }
}








export async function getUserSubscriptionsActiveAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, message: "شناسه کاربر ارسال نشده است", data: [] };
    }

    const now = new Date();

    const subscriptions = await db.userSubscription.findMany({
      where: {
        userId: userId,
        isActive: true,
        endDate: { gte: now }, // فقط اشتراک‌هایی که تاریخ انقضای آن‌ها نگذشته است
      },
      include: {
        plan: {
          select: {
            title: true,
            durationDays: true,
            price: true,
          },
        },
        order: {
          select: {
            pricePaid: true,
            refId: true,
            status: true,
          },
        },
      },
      orderBy: {
        endDate: "desc",
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error) {
    console.error("Error fetching active user subscriptions:", error);
    return {
      success: false,
      message: "خطا در دریافت لیست اشتراک‌های فعال کاربر",
      data: [],
    };
  }
}










export async function toggleSubscriptionStatusAction(subscriptionId: string, currentStatus: boolean) {
  try {
    await db.userSubscription.update({
      where: { id: subscriptionId },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/adminp/users"); // مسیر صفحه‌ای که لیست در آن است را جایگزین کنید
    return { success: true, message: "وضعیت اشتراک با موفقیت تغییر کرد." };
  } catch (error) {
    console.error("Error toggling subscription:", error);
    return { success: false, message: "خطا در تغییر وضعیت اشتراک." };
  }
}


export async function deleteUserSubscriptionAction(id: string) {
  try {
    if (!id) {
      return { success: false, message: "شناسه اشتراک معتبر نیست", error: "شناسه اشتراک معتبر نیست" };
    }

    await db.userSubscription.delete({
      where: { id },
    });

    revalidatePath("/adminp/users");
    return { success: true, message: "اشتراک کاربر با موفقیت حذف شد" };
  } catch (error) {
    console.error("Error deleting user subscription:", error);
    return { success: false, message: "خطا در حذف اشتراک کاربر", error: "خطا در حذف اشتراک کاربر" };
  }
}


export async function addUserSubscriptionManualAction(userId: string, planId: string) {
  try {
    if (!userId || !planId) {
      return { success: false, message: "اطلاعات ورودی نامعتبر است." };
    }

    // ۱. دریافت اطلاعات پلن
    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return { success: false, message: "پلن مورد نظر یافت نشد." };
    }

    const now = new Date();

    // ۲. بررسی آخرین اشتراک فعال کاربر برای اضافه کردن مدت زمان به انتهای آن
    const activeSub = await db.userSubscription.findFirst({
      where: {
        userId: userId,
        isActive: true,
        endDate: { gte: now },
      },
      orderBy: { endDate: "desc" },
    });

    // مبنای تاریخ انقضا
    const baseTime = activeSub && new Date(activeSub.endDate) > now
      ? new Date(activeSub.endDate)
      : now;

    const daysToAdd = Number(plan.durationDays) || 30;
    const calculatedEndDate = new Date(baseTime.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    // ۳. غیرفعال کردن اشتراک‌های قبلی برای جلوگیری از تداخل
    await db.userSubscription.updateMany({
      where: {
        userId: userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // ۴. ایجاد اشتراک دستی جدید
    await db.userSubscription.create({
      data: {
        userId: userId,
        planId: plan.id,
        startDate: now,
        endDate: calculatedEndDate,
        isActive: true,
      },
    });

    revalidatePath("/adminp/users"); // صفحه‌ای که جدول کاربران در آن قرار دارد
    return { success: true, message: "اشتراک با موفقیت برای کاربر فعال شد." };
  } catch (error) {
    console.error("Error adding manual subscription:", error);
    return { success: false, message: "خطا در ثبت دستی اشتراک." };
  }
}





export async function reduceUserSubscriptionManualAction(userId: string, daysToReduce: number) {
  try {
    if (!userId || !daysToReduce || daysToReduce <= 0) {
      return { success: false, message: "تعداد روزهای درخواستی معتبر نمی‌باشد." };
    }

    const now = new Date();

    // ۱. یافتن آخرین اشتراک فعال کاربر
    const activeSub = await db.userSubscription.findFirst({
      where: {
        userId: userId,
        isActive: true,
        endDate: { gte: now },
      },
      orderBy: { endDate: "desc" },
    });

    if (!activeSub) {
      return { success: false, message: "این کاربر هیچ اشتراک فعالی برای کاهش ندارد." };
    }

    // ۲. محاسبه تاریخ انقضای جدید
    const currentEndDate = new Date(activeSub.endDate);
    const newEndDate = new Date(currentEndDate.getTime() - daysToReduce * 24 * 60 * 60 * 1000);

    // ۳. اگر انقضای جدید گذشته باشد، اشتراک غیرفعال می‌شود
    const shouldDeactivate = newEndDate <= now;

    await db.userSubscription.update({
      where: { id: activeSub.id },
      data: {
        endDate: shouldDeactivate ? now : newEndDate,
        isActive: !shouldDeactivate,
      },
    });

    revalidatePath("/adminp/users");
    return {
      success: true,
      message: shouldDeactivate
        ? "زمان اشتراک کاهش یافت و به دلیل اتمام مهلت، اشتراک غیرفعال شد."
        : `زمان اشتراک با موفقیت ${daysToReduce} روز کاهش یافت.`,
    };
  } catch (error) {
    console.error("Error reducing subscription:", error);
    return { success: false, message: "خطا در کاهش زمان اشتراک." };
  }
}






// actions/user/subscription/checkUserSubscription.ts


export async function checkUserSubscriptionAction(userId: string) {
  if (!userId) {
    return { hasActiveSubscription: false, remainingDays: 0 };
  }

  try {
    const activeSubscription = await db.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: {
          gt: new Date(), // بررسی اینکه تاریخ انقضا نرسیده باشد
        },
      },
      orderBy: {
        endDate: "desc",
      },
    });

    if (!activeSubscription) {
      return { hasActiveSubscription: false, remainingDays: 0 };
    }

    // محاسبه روزهای باقی‌مانده
    const diffTime = activeSubscription.endDate.getTime() - new Date().getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      hasActiveSubscription: true,
      remainingDays,
      endDate: activeSubscription.endDate,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { hasActiveSubscription: false, remainingDays: 0 };
  }
}

//-------------- free action-------------


export async function activateFreeSubscriptionAction(userId: string, planId: string) {
  try {
    if (!userId || !planId) {
      return { success: false, error: "اطلاعات ارسالی نامعتبر است." };
    }

    // ۱. بررسی و قفل روی کاربر
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "حساب کاربری یافت نشد یا غیرفعال است." };
    }

    // ۲. بررسی پلن و اعتبارسنجی صفر بودن قیمت در سمت سرور
    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId, isActive: true },
    });

    if (!plan) {
      return { success: false, error: "پلن مورد نظر یافت نشد یا غیرفعال است." };
    }

    const effectivePrice =
      plan.discountPrice !== null && plan.discountPrice !== undefined
        ? plan.discountPrice
        : plan.price;

    if (effectivePrice !== 0) {
      return {
        success: false,
        error: "این پلن رایگان نیست و نیاز به پرداخت از طریق درگاه دارد.",
      };
    }

    // ۳. بررسی اشتراک‌های فعال فعلی کاربر
    const now = new Date();
    const activeSub = await db.userSubscription.findFirst({
      where: {
        userId: userId,
        isActive: true,
        endDate: { gt: now },
      },
      orderBy: { endDate: "desc" },
    });

    let newStartDate = now;
    let newEndDate = new Date();

    if (activeSub) {
      // محاسبه روزهای باقی‌مانده از اشتراک فعال
      const diffTime = new Date(activeSub.endDate).getTime() - now.getTime();
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // محدودیت امنیتی: تمدید رایگان فقط در صورتی مجاز است که ۳ روز یا کمتر باقی مانده باشد
      if (remainingDays > 3) {
        return {
          success: false,
          error: `شما در حال حاضر دارای اشتراک فعال هستید (${remainingDays} روز باقی مانده). تمدید مجدد پلن رایگان تنها در ۳ روز پایانی اعتبار امکان‌پذیر است.`,
        };
      }

      // تمدید اشتراک با اضافه کردن به تاریخ پایان قبلی
      newStartDate = new Date(activeSub.endDate);
      newEndDate = new Date(activeSub.endDate);
      newEndDate.setDate(newEndDate.getDate() + plan.durationDays);
    } else {
      // ایجاد اشتراک جدید از همین لحظه
      newEndDate.setDate(now.getDate() + plan.durationDays);
    }

    // ۴. ثبت تراکنش امن (Order + Subscription)
    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          subscriptionPlanId: plan.id,
          pricePaid: 0,
          status: "SUCCESS",
          expiresAt: newEndDate,
          isActive: true,
        },
      });

      const subscription = await tx.userSubscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          orderId: order.id,
          startDate: newStartDate,
          endDate: newEndDate,
          isActive: true,
        },
      });

      return { order, subscription };
    });

    return {
      success: true,
      message: "اشتراک رایگان با موفقیت برای شما فعال شد.",
      data: result.subscription,
    };
  } catch (error) {
    console.error("Error in activateFreeSubscriptionAction:", error);
    return { success: false, error: "خطایی در پردازش فعال‌سازی اشتراک رخ داد." };
  }
}

