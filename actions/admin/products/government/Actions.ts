"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function fetchDataProduct(page: number = 1, limit: number = 10, searchQuery: string = "") {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { products: [], totalPages: 0, totalCount: 0 };
    }

    const skip = (page - 1) * limit;

    // ساخت شرط جستجو مدرن و بهینه برای واکشی فیلتر شده
    const whereClause = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } }, 
            { 
              categories: { 
                some: { catName: { contains: searchQuery, mode: "insensitive" as const } } 
              } 
            }, 
          ],
        }
      : {};

    // انجام عملیات همزمان در دیتابیس برای بهینه‌سازی سرعت
    const [totalCount, products] = await db.$transaction([
      db.product.count({ where: whereClause }),
      db.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          categories: {
            select: { id: true, catName: true, catSlug: true }
          }
        }
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { products, totalPages, totalCount };
  } catch (error) {
    console.error("🚨 خطای سرور در دریافت محصولات از دیتابیس: ", error);
    return { products: [], totalPages: 0, totalCount: 0 };
  }
}



export default async function addProductAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند محصول ایجاد کند." };
    }

    // دریافت مستقیم لینک تصویر
    const externalImageUrl = (formData.get("externalImageUrl") as string || formData.get("imageUrl") as string || "").trim();

    const rawData = Object.fromEntries(formData.entries()) as Record<string, string>;
    const { name = "", slug: rawSlug = "", oldPrice: oldPriceStr = "", newPrice: newPriceStr = "", description = "", type = "MAIN" } = rawData;

    const productType = type as ProductType;
    const categoryIdsFromForm = formData.getAll("categories") as string[];
    const features = formData.getAll("features") as string[];
    
    // 🟢 استخراج downloadUrl
    const downloadUrl = formData.get("downloadUrl") as string | null;

    if (!name || !rawSlug) {
      return { success: false, message: "نام و اسلاگ محصول الزامی هستند." };
    }
    if (productType === "MAIN" && !newPriceStr) {
      return { success: false, message: "برای محصولات اصلی وارد کردن قیمت الزامی است." };
    }
    // 🟢 اعتبارسنجی downloadUrl برای منابع رایگان
    if (productType === "FREE_RESOURCE" && (!downloadUrl || downloadUrl.trim() === "")) {
      return { success: false, message: "برای منابع دانلودی وارد کردن آدرس فایل الزامی است." };
    }

    const newPrice = productType === "FREE_RESOURCE" ? 0 : parseInt(newPriceStr, 10);
    const oldPrice = productType === "FREE_RESOURCE" ? 0 : (oldPriceStr ? parseInt(oldPriceStr, 10) : 0);
    const slug = rawSlug.trim().replace(/\s+/g, "-").toLowerCase();

    const existingProduct = await db.product.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existingProduct) {
      return { success: false, message: "نام یا اسلاگ محصول تکراری است." };
    }

    await db.$transaction(async (tx) => {
      await tx.product.create({
        data: {
          name,
          slug,
          type: productType,
          oldPrice,
          newPrice,
          imageUrl: externalImageUrl || "",
          description,
          features,
          // 🟢 ذخیره downloadUrl در دیتابیس
          downloadUrl: productType === "FREE_RESOURCE" ? (downloadUrl?.trim() || null) : null,
          categories: {
            connect: categoryIdsFromForm.map((catId) => ({ id: catId })),
          },
        },
      });
    });

    revalidatePath("/adminp/products/government/addproduct");
    return { success: true, message: `محصول "${name}" با موفقیت اضافه شد.` };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "خطایی در سرور رخ داد." };
  }
}



export async function editDataProductAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "شما دسترسی لازم برای این کار را ندارید" };
    }

    const rawData = Object.fromEntries(formData);
    const {
      id = "",
      name = "",
      slug: rawSlug = "",
      type = "MAIN",
      oldPrice: oldPriceStr = "",
      newPrice: newPriceStr = "",
      description = "",
      existingImageUrl = "",
      isActive: isActiveStr = "true",
    } = rawData as Record<string, string>;

    if (!id) return { success: false, message: "آیدی محصول یافت نشد" };

    const productType = type as ProductType;

    if (productType === "MAIN" && !newPriceStr) {
      return { success: false, message: "برای محصولات اصلی وارد کردن قیمت جدید الزامی است." };
    }

    const downloadUrl = formData.get("downloadUrl") as string | null;
    if (productType === "plus_RESOURCE" && (!downloadUrl || downloadUrl.trim() === "")) {
      return { success: false, message: "برای منابع دانلودی وارد کردن آدرس فایل الزامی است." };
    }

    const externalImageUrl = formData.get("externalImageUrl") as string | null;
    let finalImageUrl = existingImageUrl;

    if (externalImageUrl && externalImageUrl.trim() !== "") {
      finalImageUrl = externalImageUrl.trim();
    }

    const categoryIds = formData.getAll("categoryIds") as string[];
    const features = formData.getAll("features") as string[];
    const newPrice = productType === "plus_RESOURCE" ? 0 : (newPriceStr ? parseInt(newPriceStr, 10) : 0);
    const oldPrice = productType === "plus_RESOURCE" ? 0 : (oldPriceStr ? parseInt(oldPriceStr, 10) : 0);
    const slug = rawSlug.trim().replace(/\s+/g, "-").toLowerCase();
    const isActive = isActiveStr === "true";

    await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        type: productType,
        newPrice,
        oldPrice,
        imageUrl: finalImageUrl,
        description,
        features,
        isActive,
        downloadUrl: productType === "FREE_RESOURCE" ? (downloadUrl?.trim() ?? null) : null,
        categories: {
          set: categoryIds.map((catId) => ({ id: catId })),
        },
      },
    });

    revalidatePath("/adminp/products/government");
    return { success: true, message: "محصول با موفقیت ویرایش شد" };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return { success: false, message: "خطا در ارتباط با دیتابیس یا مقادیر تکراری (مثل اسلاگ)" };
  }
}





export  async function deleteProductAction(id: string) {
  try {
    // ۱. بررسی دسترسی کاربر
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      console.log("❌ Access denied: User is not admin");
      
      // 👈 رفع مشکل سوم: برگرداندن آبجکت استاندارد به جای آرایه خالی
      return { 
        success: false, 
        message: "دسترسی غیرمجاز: شما ادمین نیستید." 
      };
    }

    // ۲. حذف از دیتابیس
    const res = await db.product.delete({
        where: { // 👈 رفع مشکل دوم: اضافه کردن دونقطه (:)
            id: id
        }
    });

    // ۳. ایجاد تاخیر مصنوعی (برای دیدن انیمیشن لودینگ - در حالت واقعی می‌توانید حذفش کنید)
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 👈 رفع مشکل چهارم: پاک کردن کش صفحه بعد از حذف موفق
    // مسیر داخل پرانتز باید دقیقاً مسیر صفحه‌ای باشد که لیست محصولات در آن نمایش داده می‌شود
    revalidatePath('/adminp/products/government/editproduct'); 

    return {
        success: true, 
        message: 'محصول با موفقیت حذف شد.'
    };

  } catch (error) {
    console.error("خطا در حذف محصول:", error);
    return { 
        success: false, 
        message: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' 
    };
  }
}



export async function getDataEditProduct(id: string) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "شما دسترسی لازم برای این کار را ندارید", product: null };
    }

    const productData = await db.product.findUnique({
      where: { id: id },
      include: {
        categories: {
          select: {
            id: true,
            catName: true
          }
        }
      }
    });

    if (!productData) {
      return { success: false, message: "محصول مورد نظر یافت نشد", product: null };
    }

    const formattedProduct = {
      ...productData,
      categoryIds: productData.categories.map(cat => cat.id)
    };

    return { success: true, message: "اطلاعات با موفقیت دریافت شد", product: formattedProduct };
  } catch (error) {
    console.error("❌ Error fetching product data:", error);
    return { success: false, message: "خطا در ارتباط با دیتابیس", product: null };
  }
}
