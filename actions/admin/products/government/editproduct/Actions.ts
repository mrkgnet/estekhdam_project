"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
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
      oldPrice: oldPriceStr = "",
      newPrice: newPriceStr = "",
      description = "",
      existingImageUrl = "", // عکس قبلی که از فرم می‌آید
    } = rawData as Record<string, string>;

    if (!id) {
      return { success: false, message: "آیدی محصول یافت نشد" };
    }

    // 🔴 مدیریت آپلود عکس با سیستم هشینگ
    const imageFile = formData.get("imageFile") as File | null;
    let finalImageUrl = existingImageUrl; // به صورت پیش‌فرض عکس قبلی را در نظر می‌گیریم

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "products");
      const savePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });

      let fileExists = false;
      try {
        await fs.access(savePath);
        fileExists = true;
      } catch (error) {
        fileExists = false;
      }

      if (!fileExists) {
        await fs.writeFile(savePath, buffer);
      }
      
      finalImageUrl = `/images/products/${filename}`; // عکس جدید جایگزین شد
    }

    const categoryIds = formData.getAll("categoryIds") as string[];
    const features = formData.getAll("features") as string[];

    const newPrice = newPriceStr ? parseInt(newPriceStr, 10) : 0;
    const oldPrice = oldPriceStr ? parseInt(oldPriceStr, 10) : 0;
    const slug = rawSlug.trim().replace(/\s+/g, "-").toLowerCase();

    await db.product.update({
      where: { id: id },
      data: {
        name,
        slug,
        newPrice,
        oldPrice,
        imageUrl: finalImageUrl, // 🔴 ذخیره آدرس نهایی (چه قبلی، چه جدید)
        description,
        features: features,
       categoryIds: categoryIds,
      },
    });

    revalidatePath("/adminp/products/government");

    return { success: true, message: "محصول با موفقیت ویرایش شد" };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return { success: false, message: "خطا در ارتباط با دیتابیس یا مقادیر تکراری (مثل اسلاگ)" };
  }
}
