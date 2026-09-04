'use server';

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

const SHOW_BRANDS_KEY = 'show_brands_section';

// ۱. واکشی وضعیت کلی نمایش سکشن برندها (کش‌شده روی سرور)
const getCachedBrandsSectionSetting = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const setting = await db.setting.findUnique({
        where: { key: SHOW_BRANDS_KEY },
      });
      return setting ? setting.value === 'true' : true;
    } catch (error) {
      console.error("خطا در واکشی تنظیمات سکشن برندها:", error);
      return true;
    }
  },
  ['brands-setting-cache-key'],
  {
    tags: ['brands-setting-tag'],
    revalidate: 60 * 60 * 24, // ۲۴ ساعت
  }
);

export async function getBrandsSectionSetting(): Promise<boolean> {
  return await getCachedBrandsSectionSetting();
}

// ۲. واکشی برندهای فعال مخصوص کاربران سایت (کش‌شده روی سرور)
const getCachedActiveBrands = unstable_cache(
  async () => {
    try {
      const brands = await db.brand.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      });
      return brands;
    } catch (error) {
      console.error("خطا در واکشی برندهای فعال:", error);
      return [];
    }
  },
  ['active-brands-cache-key'],
  {
    tags: ['brands-tag'],
    revalidate: 60 * 60 * 24,
  }
);

export async function getActiveBrands() {
  return await getCachedActiveBrands();
}

// ۳. تغییر وضعیت نمایش کل سکشن برندها
export async function toggleBrandsSectionSetting(currentStatus: boolean) {
  const nextStatus = !currentStatus;

  await db.setting.upsert({
    where: { key: SHOW_BRANDS_KEY },
    update: { value: String(nextStatus) },
    create: { key: SHOW_BRANDS_KEY, value: String(nextStatus) },
  });

  revalidateTag('brands-setting-tag');
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true, isVisible: nextStatus };
}

// ۴. واکشی همه برندها (مخصوص پنل ادمین - بدون کش سروری)
export async function getBrands() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: brands };
  } catch (error) {
    console.error("خطا در واکشی برندها:", error);
    return { success: false, data: [] };
  }
}

// ۵. ایجاد برند جدید
export async function createBrand(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const isActive = formData.get("isActive") === "on";

  if (!title || !imageUrl) {
    throw new Error("عنوان و آدرس تصویر الزامی است");
  }

  await db.brand.create({
    data: { title, imageUrl, isActive },
  });

  revalidateTag('brands-tag');
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۶. ویرایش برند
export async function updateBrand(id: number, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const isActive = formData.get("isActive") === "on";

  if (!title || !imageUrl) {
    throw new Error("عنوان و آدرس تصویر الزامی است");
  }

  await db.brand.update({
    where: { id },
    data: { title, imageUrl, isActive },
  });

  revalidateTag('brands-tag');
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۷. حذف برند
export async function deleteBrand(id: number) {
  await db.brand.delete({
    where: { id },
  });

  revalidateTag('brands-tag');
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۸. تغییر وضعیت تک‌برند
export async function toggleBrandStatus(id: number, currentStatus: boolean) {
  await db.brand.update({
    where: { id },
    data: { isActive: !currentStatus },
  });

  revalidateTag('brands-tag');
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}