"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// تایپ Enum را ایمپورت کنید
import { NewsStatus } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function createNewsGovermentAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند آگهی اضافه کند.",
      };
    }

    const rawData = Object.fromEntries(formData.entries());

    // 1. استخراج فایل از فرم‌دیتا
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    // 2. مدیریت آپلود عکس با سیستم هشینگ (جلوگیری از آپلود تکراری)
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // ساخت هش بر اساس محتوای فایل
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");

      // استخراج پسوند فایل (مثلا .jpg یا .png)
      const extension = path.extname(imageFile.name) || ".jpg";

      // اسم فایل ترکیبی از هش محتوا و پسوند آن است
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "jobnews", "government");
      const savePath = path.join(uploadDir, filename);

      // اطمینان از وجود پوشه
      await fs.mkdir(uploadDir, { recursive: true });

      // بررسی اینکه آیا عکسی با این محتوا از قبل در سرور وجود دارد؟
      let fileExists = false;
      try {
        await fs.access(savePath);
        fileExists = true;
      } catch (error) {
        fileExists = false;
      }

      // فقط در صورتی فایل را در هارد می‌نویسیم که از قبل وجود نداشته باشد
      if (!fileExists) {
        await fs.writeFile(savePath, buffer);
        console.log("عکس جدید بود و در سرور ذخیره شد.");
      } else {
        console.log("این عکس از قبل در سرور وجود داشت. از همان استفاده شد.");
      }

      finalImageUrl = `/images/jobnews/government/${filename}`;
    }

    // 3. استخراج داده‌های متنی
    const {
      title = "",
      slugNews: rawSlugNews = "",
      registerUrl = "",
      organization = "",
      description = "",
      startAt = "",
      endAt = "",
      price: priceStr = "",
      maxAge: maxAgeStr = "",
      isMainSlider = "false",
      status = "NEWS",
    } = rawData as Record<string, string>;

    const slugNews = rawSlugNews.trim().replace(/\s+/g, "-").toLowerCase();
    
    // پارس کردن آرایه‌ها (با fallback امن)
    const jobs = JSON.parse((formData.get("jobs") as string) || "[]");
    const cities = JSON.parse((formData.get("cities") as string) || "[]");
    const productIds = JSON.parse((formData.get("productIds") as string) || "[]");

    const price = priceStr ? parseInt(priceStr) : 0;
    const maxAge = maxAgeStr ? parseInt(maxAgeStr) : 0;
    const isSlider = isMainSlider === "true";

    const validStatuses = ["OPEN", "CARD_RECEIVED", "RESULTS_ANNOUNCED", "NEWS"];
    const finalStatus = validStatuses.includes(status) ? (status as NewsStatus) : "NEWS";

    // 4. بررسی تکراری بودن اسلاگ
    const checkSlug = await db.governmentNews.findFirst({
      where: { slugNews },
    });

    if (checkSlug) {
      return {
        success: false,
        message: "نام اسلاگ تکراری است. لطفاً مجدداً تلاش کنید.",
      };
    }

    // 5. ذخیره در دیتابیس
    await db.governmentNews.create({
      data: {
        title,
        slugNews,
        registerUrl,
        organization,
        imageUrl: finalImageUrl,
        description,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        price,
        maxAge,
        isMainSlider: isSlider,
        status: finalStatus,
        jobs,
        cities,
        productIds, // ارسال مستقیم آرایه به Prisma
      },
    });

    revalidatePath("/adminp/jobnews/government/add-news");
    revalidatePath("/adminp/jobnews/government");

    return { success: true, message: "آگهی استخدام با موفقیت ثبت شد." };
  } catch (error) {
    console.error("خطا در ثبت آگهی:", error);
    return { success: false, message: "خطایی در ثبت اطلاعات رخ داد." };
  }
}
