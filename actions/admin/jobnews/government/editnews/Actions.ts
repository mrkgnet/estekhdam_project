"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db"; 
import { revalidatePath } from "next/cache";
import { NewsStatus } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto"; // 👈 ماژول هش کردن اضافه شد

export async function updateDataEditGov(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند اطلاعات را ویرایش کند.",
      };
    }

    // استخراج فایل از فرم‌دیتا
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    // 👈 تغییرات اصلی در این بخش برای هش کردن فایل
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      
      // ساخت هش بر اساس محتوای فایل
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      
      // استخراج پسوند فایل (مثلا .jpg یا .png)
      const extension = path.extname(imageFile.name) || ".jpg";
      
      // اسم فایل حالا ترکیبی از هش و پسوند است
      const filename = `${hash}${extension}`;
      
      const uploadDir = path.join(process.cwd(), "public", "images", "jobnews","government");
      const savePath = path.join(uploadDir, filename);
      
      // ساخت پوشه در صورت عدم وجود
      await fs.mkdir(uploadDir, { recursive: true });

      // بررسی اینکه آیا عکسی با این محتوا از قبل در سرور وجود دارد؟
      let fileExists = false;
      try {
        await fs.access(savePath);
        fileExists = true;
      } catch (error) {
        fileExists = false;
      }

      // فقط در صورتی فایل را روی سرور می‌نویسیم که از قبل وجود نداشته باشد
      if (!fileExists) {
        await fs.writeFile(savePath, buffer);
        console.log("عکس جدید بود و در سرور ذخیره شد.");
      } else {
        console.log("این عکس از قبل در سرور وجود داشت. از همان استفاده شد.");
      }

      // آدرس نهایی برای ذخیره در دیتابیس
      finalImageUrl = `/images/jobnews/government/${filename}`;
    }

    const rawData = Object.fromEntries(formData.entries());

    const {
      id = "",
      title = "",
      slugNews: rawSlugNews = "",
      registerUrl = "",
      organization = "",
      imageUrl = "", // این مقدار همان لینک متنی (عکس قبلی) است
      description = "",
      startAt = "",
      endAt = "",
      price: priceStr = "",
      maxAge: maxAgeStr = "",
      isMainSlider = "false",
      status = "NEWS", 
    } = rawData as Record<string, string>;

    if (!id) {
        return { success: false, message: "آیدی خبر یافت نشد!" };
    }

    const slugNews = rawSlugNews.trim().replace(/\s+/g, "-").toLowerCase();
    const jobs = JSON.parse((formData.get("jobs") as string) || "[]");
    const cities = JSON.parse((formData.get("cities") as string) || "[]");
    const price = priceStr ? parseInt(priceStr) : 0;
    const maxAge = maxAgeStr ? parseInt(maxAgeStr) : 0;
    const isSlider = isMainSlider === "true";

    const validStatuses = ["OPEN", "CARD_RECEIVED", "RESULTS_ANNOUNCED", "NEWS"];
    const finalStatus = validStatuses.includes(status) ? (status as NewsStatus) : "NEWS";

    const checkSlug = await db.governmentNews.findFirst({
      where: { slugNews }
    });

    if (checkSlug && checkSlug.id !== id) {
      return { success: false, message: "نام اسلاگ تکراری است." };
    }



    // ۱. اضافه کردن این خط برای استخراج آیدی محصولات
const productIds = formData.getAll("productIds") as string[];

    // به‌روزرسانی در دیتابیس
    await db.governmentNews.update({
      where: { id: id },
      data: {
        title,
        slugNews,
        registerUrl,
        organization,
        
        // 👈 منطق هوشمندانه شما: اگر عکس جدیدی آپلود شد (یا تکراری کشف شد)، آدرس آن قرار می‌گیرد
        // در غیر این صورت مقدار فیلد متنی (عکس قبلی) حفظ می‌شود
        imageUrl: finalImageUrl ? finalImageUrl : imageUrl, 
        
        description,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        price,
        maxAge,
        isMainSlider: isSlider,
        status: finalStatus,
        jobs, 
        cities,
        productIds: productIds,
      }
    });

    revalidatePath("/adminp/jobnews/government/edit-news");
    revalidatePath("/adminp/jobnews/government"); 

    return { success: true, message: "آگهی استخدام با موفقیت ویرایش شد." };
  } catch (error) {
    console.error("خطا در ثبت آگهی:", error);
    return { success: false, message: "خطایی در ویرایش اطلاعات رخ داد." };
  }
}
