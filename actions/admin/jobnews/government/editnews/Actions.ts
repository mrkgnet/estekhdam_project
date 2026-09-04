"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache"; // 👈 اضافه شدن revalidateTag
import { NewsStatus } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function updateDataEditGov(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        message: "دسترسی غیرمجاز. فقط ادمین می‌تواند اطلاعات را ویرایش کند.",
      };
    }

    const rawData = Object.fromEntries(formData.entries());
    let finalImageUrl: string | null = null;

    // 1. بررسی لینک مستقیم تصویر
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

    const {
      id = "",
      title = "",
      slugNews: rawSlugNews = "",
      registerUrl = "",
      organization = "",
      imageUrl = "",
      description = "",
      startAt = "",
      endAt = "",
      examAt = "",
      price: priceStr = "",
      maxAge: maxAgeStr = "",
      isMainSlider = "false",
      isActive = "true",
      status = "NEWS",
    } = rawData as Record<string, string>;

    if (!id) {
      return { success: false, message: "آیدی خبر یافت نشد!" };
    }

    const slugNews = rawSlugNews.trim().replace(/\s+/g, "-").toLowerCase();

    const jobs = JSON.parse((formData.get("jobs") as string) || "[]");
    const cities = JSON.parse((formData.get("cities") as string) || "[]");
    const productIds = JSON.parse((formData.get("productIds") as string) || "[]");

    // تبدیل مبلغ تمیز شده بدون کاما به عدد
    const cleanPriceStr = priceStr ? priceStr.replace(/,/g, "") : "0";
    const price = cleanPriceStr ? parseInt(cleanPriceStr) : 0;
    const maxAge = maxAgeStr ? parseInt(maxAgeStr) : 0;
    const isSlider = isMainSlider === "true";
    const activeStatus = isActive === "true";

    const validStatuses = ["OPEN", "CARD_RECEIVED", "RESULTS_ANNOUNCED", "NEWS"];
    const finalStatus = validStatuses.includes(status) ? (status as NewsStatus) : "NEWS";

    const checkSlug = await db.governmentNews.findFirst({
      where: { slugNews },
    });

    if (checkSlug && checkSlug.id !== id) {
      return { success: false, message: "نام اسلاگ تکراری است." };
    }

    // به‌روزرسانی در دیتابیس PostgreSQL
    await db.governmentNews.update({
      where: { id: id },
      data: {
        title,
        slugNews,
        registerUrl,
        organization,
        imageUrl: finalImageUrl ? finalImageUrl : imageUrl,
        description,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        examAt: examAt ? new Date(examAt) : null,
        price,
        maxAge,
        isMainSlider: isSlider,
        isActive: activeStatus,
        status: finalStatus,
        jobs,
        cities,
        products: {
          set: productIds.map((pid: string) => ({ id: pid })),
        },
      },
    });

    // 👈 ابطال کش لایه سرور برای اسلایدر اصلی
    revalidateTag("main-slider");

    revalidatePath("/adminp/jobnews/government/edit-news");
    revalidatePath("/adminp/jobnews/government");
    revalidatePath("/");

    return { success: true, message: "آگهی استخدام با موفقیت ویرایش شد." };
  } catch (error) {
    console.error("خطا در ویرایش آگهی:", error);
    return { success: false, message: "خطایی در ویرایش اطلاعات رخ داد." };
  }
}

// برای دریافت اطلاعات خبر به همراه آیدی محصولات مرتبط
export async function getDataEditNewsGov(id: string) {
  try {
    if (!id) {
      return { success: false, message: "شناسه آگهی نامعتبر است" };
    }

    const product = await db.governmentNews.findUnique({
      where: { id: id },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      return { success: false, message: "آگهی یافت نشد" };
    }

    const productWithIds = {
      ...product,
      productIds: product.products.map((p) => p.id),
    };

    return { success: true, product: productWithIds };
  } catch (error) {
    console.error("خطا در دریافت اطلاعات آگهی:", error);
    return { success: false, message: "خطایی در دریافت اطلاعات دیتابیس رخ داد" };
  }
}