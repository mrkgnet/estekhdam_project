// file: addMainSliderAction.ts

"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function addMainSliderAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز.",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetLink = formData.get("targetLink") as string;
    const imageFile = formData.get("imageFile") as File | null;
    const externalImageUrl = formData.get("externalImageUrl") as string | null;

    let finalImageUrl = "";

    // ۱. اولویت با لینک خارجی
    if (externalImageUrl && externalImageUrl.trim().startsWith('http')) {
        finalImageUrl = externalImageUrl.trim();
    } 
    // ۲. اگر لینک خارجی نبود، فایل را بررسی کن
    else if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "mainSlider");
      const savePath = path.join(uploadDir, filename);
      
      await fs.mkdir(uploadDir, { recursive: true });

      // برای جلوگیری از نوشتن مجدد فایل موجود
      try {
        await fs.access(savePath);
      } catch {
        await fs.writeFile(savePath, buffer);
      }
      
      finalImageUrl = `/images/mainSlider/${filename}`;
    }

    // ۳. اعتبارسنجی نهایی
    if (!finalImageUrl) {
      return {
        success: false,
        message: "لطفاً یک تصویر آپلود کنید یا لینک معتبر آن را وارد نمایید.",
      };
    }

    // ۴. ذخیره در دیتابیس
    await db.mainSlider.create({
      data: {
        imageUrl: finalImageUrl,
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        targetLink: targetLink ? targetLink.trim() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/mainslider");

    return {
      success: true,
      message: "اسلایدر با موفقیت ایجاد شد.",
    };
  } catch (error) {
    console.error("❌ Error in addMainSliderAction:", error);
    return {
      success: false,
      message: "خطایی در سرور رخ داد.",
    };
  }
}
