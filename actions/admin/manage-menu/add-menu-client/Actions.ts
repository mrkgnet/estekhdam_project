"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export default async function addMenuClientAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند منو ایجاد کند." };
    }

    const name = formData.get("name") as string;
    const rawSlug = formData.get("slug") as string;
    const slug = rawSlug ? rawSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    const rawCustomUrl = formData.get("customUrl") as string;
    const customUrl = rawCustomUrl && rawCustomUrl.trim() !== "" ? rawCustomUrl.trim() : null;

    const rawParentId = formData.get("parentId") as string;
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : undefined;
    
    // 🟢 دریافت فیلد ترتیب (Order)
    const orderRaw = formData.get("order") as string;
    const order = orderRaw ? parseInt(orderRaw) : 0;
    
    if (!name || !slug) {
      return { success: false, message: "نام و اسلاگ الزامی هستند." };
    }

    const existingMenu = await db.menuClient.findFirst({
      where: {
        OR: [{ name: name }, { slug: slug }],
      },
    });

    if (existingMenu) {
      if (existingMenu.name === name) return { success: false, message: "این نام منو قبلاً ثبت شده است." };
      if (existingMenu.slug === slug) return { success: false, message: "این اسلاگ (نامک) قبلاً ثبت شده است." };
    }

    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const extension = path.extname(imageFile.name) || ".jpg";
      const filename = `${hash}${extension}`;

      const uploadDir = path.join(process.cwd(), "public", "images", "menus");
      const savePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(savePath, buffer).catch(() => {});
      
      finalImageUrl = `/images/menus/${filename}`;
    }

    const result = await db.menuClient.create({
      data: {
        name: name,
        slug: slug,
        imageUrl: finalImageUrl, 
        parentId: parentId, 
        customUrl: customUrl,
        order: order // 🟢
      },
    });

    revalidatePath("/adminp/menus");

    return {
      success: true,
      message: `منوی "${result.name}" با موفقیت ایجاد شد.`,
    };
  } catch (error) {
    console.error("Error creating menu:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: `خطای دیتابیس: اطلاعات تکراری است.` };
    }
    return { success: false, error: "خطایی در هنگام ثبت منو رخ داد." };
  }
}
