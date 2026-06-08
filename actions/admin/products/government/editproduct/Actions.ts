"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

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
      isActive: isActiveStr = "true",} = rawData as Record<string, string>;

    if (!id) return { success: false, message: "آیدی محصول یافت نشد" };

    const productType = type as ProductType;

    if (productType === "MAIN" && !newPriceStr) {
      return { success: false, message: "برای محصولات اصلی وارد کردن قیمت جدید الزامی است." };
    }

    const downloadUrl = formData.get("downloadUrl") as string | null;
    if (productType === "FREE_RESOURCE" && (!downloadUrl || downloadUrl.trim() === "")) {
      return { success: false, message: "برای منابع دانلودی وارد کردن آدرس فایل الزامی است." };
    }

    const imageFile = formData.get("imageFile") as File | null;
    const externalImageUrl = formData.get("externalImageUrl") as string | null;
    let finalImageUrl = existingImageUrl;

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

    const categoryIds = formData.getAll("categoryIds") as string[];
    const features = formData.getAll("features") as string[];
    const newPrice = productType === "FREE_RESOURCE" ? 0 : (newPriceStr ? parseInt(newPriceStr, 10) : 0);
    const oldPrice = productType === "FREE_RESOURCE" ? 0 : (oldPriceStr ? parseInt(oldPriceStr, 10) : 0);
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
