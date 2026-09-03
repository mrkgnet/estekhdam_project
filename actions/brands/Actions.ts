// actions/brands/Actions.ts
'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const SHOW_BRANDS_KEY = 'show_brands_section';

// واکشی وضعیت کلی نمایش سکشن برندها از جدول Setting
export async function getBrandsSectionSetting(): Promise<boolean> {
  try {
    const setting = await db.setting.findUnique({
      where: { key: SHOW_BRANDS_KEY },
    });
    return setting ? setting.value === 'true' : true;
  } catch (error) {
    console.error("خطا در واکشی تنظیمات سکشن برندها:", error);
    return true;
  }
}

// تغییر وضعیت نمایش سکشن برندها
export async function toggleBrandsSectionSetting(currentStatus: boolean) {
  const nextStatus = !currentStatus;

  await db.setting.upsert({
    where: { key: SHOW_BRANDS_KEY },
    update: { value: String(nextStatus) },
    create: { key: SHOW_BRANDS_KEY, value: String(nextStatus) },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true, isVisible: nextStatus };
}

// واکشی برندهای فعال مخصوص کاربران سایت
export async function getActiveBrands() {
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
}

// ۱. واکشی همه برندها (مخصوص پنل ادمین)
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

// ۲. ایجاد برند جدید
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

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۳. ویرایش برند
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

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۴. حذف برند
export async function deleteBrand(id: number) {
  await db.brand.delete({
    where: { id },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

// ۵. تغییر وضعیت تک‌برند
export async function toggleBrandStatus(id: number, currentStatus: boolean) {
  await db.brand.update({
    where: { id },
    data: { isActive: !currentStatus },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}