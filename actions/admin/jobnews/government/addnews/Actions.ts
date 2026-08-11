"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
    let finalImageUrl: string | null = null;

    // 1. بررسی لینک مستقیم (اولویت اول)
    const externalImageUrl = formData.get("externalImageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    if (externalImageUrl && externalImageUrl.trim() !== "") {
      finalImageUrl = externalImageUrl.trim();
    } 
    // 2. در صورت عدم وجود لینک، بررسی فایل آپلود شده
    else if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "jobnews", "government");
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
      examAt = "",
      price: priceStr = "",
      maxAge: maxAgeStr = "",
      isMainSlider = "false",
      status = "NEWS",
    } = rawData as Record<string, string>;

    const slugNews = rawSlugNews.trim().replace(/\s+/g, "-").toLowerCase();

    // پارس کردن آرایه‌ها
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

    // 5. ذخیره در دیتابیس با ایجاد رابطه چند به چند برای محصولات
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
        examAt: examAt ? new Date(examAt) : null,
        price,
        maxAge,
        isMainSlider: isSlider,
        status: finalStatus,
        jobs,
        cities,
        products: {
          connect: productIds.map((id: string) => ({ id })),
        },
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