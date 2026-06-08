"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export default async function addProductAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند محصول ایجاد کند." };
    }

    const imageFile = formData.get("imageFile") as File;
    const externalImageUrl = formData.get("externalImageUrl") as string;
    let finalImageUrl = null;

    if (externalImageUrl && externalImageUrl.trim() !== "") {
      finalImageUrl = externalImageUrl.trim();
    } else if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;
      const uploadDir = path.join(process.cwd(), "public", "images", "products");
      const savePath = path.join(uploadDir, filename);
      await fs.mkdir(uploadDir, { recursive: true });
      let fileExists = false;
      try { await fs.access(savePath); fileExists = true; } catch { fileExists = false; }
      if (!fileExists) await fs.writeFile(savePath, buffer);
      finalImageUrl = `/images/products/${filename}`;
    }

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
          imageUrl: finalImageUrl || "",
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
