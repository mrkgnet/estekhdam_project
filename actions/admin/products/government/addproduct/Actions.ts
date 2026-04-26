"use server";
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";
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
    let finalImageUrl = null;

    // مدیریت آپلود عکس با سیستم هشینگ
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

      finalImageUrl = `/images/products/${filename}`;
    }

    const rawData = Object.fromEntries(formData.entries());
    const {
      name = "",
      slug: rawSlug = "",
      oldPrice: oldPriceStr = "",
      newPrice: newPriceStr = "",
      description = "",
    } = rawData as Record<string, string>;

    const categoryIdsFromForm = formData.getAll("categories") as string[];
    const features = formData.getAll("features") as string[];

    if (!name || !rawSlug || !newPriceStr) {
      return { success: false, message: "نام، اسلاگ و قیمت جدید الزامی هستند." };
    }

    const newPrice = parseInt(newPriceStr, 10);
    const oldPrice = oldPriceStr ? parseInt(oldPriceStr, 10) : 0;
    const slug = rawSlug.trim().replace(/\s+/g, "-").toLowerCase();

    const existingProduct = await db.product.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existingProduct) {
      return { success: false, message: "نام یا اسلاگ محصول تکراری است." };
    }

    await db.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          oldPrice,
          newPrice,
          imageUrl: finalImageUrl || "",
          description,
          features: features,

          // 🟢 روش صحیح و استاندارد ثبت رابطه چند به چند در پستگرس
          categories: {
            connect: categoryIdsFromForm.map((catId) => ({ id: catId })),
          },
        },
      });

      // 🔴 تمام حلقه for...of مربوط به آپدیت دسته بندی (tx.category.update)
      // را به طور کامل پاک کنید، چون پریزما با دستور connect بالا خودش همه کارها را انجام داد.
    });

    revalidatePath("/adminp/products/government/addproduct");

    return { success: true, message: `محصول "${name}" با موفقیت اضافه شد.` };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "خطایی در سرور رخ داد." };
  }
}
