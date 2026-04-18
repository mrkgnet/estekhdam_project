"use server";

import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export default async function editMenuClientAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "دسترسی غیرمجاز. فقط ادمین می‌تواند منو را ویرایش کند." };
    }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const rawSlug = formData.get("slug") as string;
    const slug = rawSlug ? rawSlug.trim().replace(/\s+/g, "-").toLowerCase() : "";
    
    const rawCustomUrl = formData.get("customUrl") as string;
    const customUrl = rawCustomUrl && rawCustomUrl.trim() !== "" ? rawCustomUrl.trim() : null;

    const rawParentId = formData.get("parentId") as string;
    const parentId = rawParentId && rawParentId.trim() !== "" ? rawParentId : null;
    
    // 🟢 دریافت فیلد ترتیب (Order)
    const orderRaw = formData.get("order") as string;
    const order = orderRaw ? parseInt(orderRaw) : 0;

    if (!id || !name || !slug) return { success: false, message: "اطلاعات الزامی ناقص است." };
    if (id === parentId) return { success: false, message: "یک منو نمی‌تواند والد خودش باشد." };

    const existingMenu = await db.menuClient.findFirst({
      where: {
        id: { not: id },
        OR: [{ name: name }, { slug: slug }],
      },
    });

    if (existingMenu) {
      if (existingMenu.name === name) return { success: false, message: "این نام قبلاً ثبت شده است." };
      if (existingMenu.slug === slug) return { success: false, message: "این اسلاگ قبلاً ثبت شده است." };
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

    const updateData: any = {
      name,
      slug,
      parentId,
      customUrl,
      order // 🟢
    };

    if (finalImageUrl) updateData.imageUrl = finalImageUrl;

    await db.menuClient.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/adminp/menus");

    return { success: true, message: `منو با موفقیت ویرایش شد.` };
  } catch (error) {
    console.error("Error editing menu:", error);
    return { success: false, error: "خطایی در هنگام ویرایش منو رخ داد." };
  }
}
