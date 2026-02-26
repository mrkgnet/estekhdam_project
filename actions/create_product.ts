// actions/create_product.ts

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

// تابع کمکی برای ساخت اسلاگ
function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Schema و Type (بدون تغییر)
const productSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد."),
  slug: z.string().optional(),
  features: z.array(z.string()).min(1, "حداقل یک ویژگی وارد کنید."),
  price: z.coerce.number().positive("قیمت باید یک عدد مثبت باشد."),
  durationType: z.enum(["instant", "hours"]),
  hours: z.coerce.number().optional().nullable(),
  imageUrl: z.string().url({ message: "لطفاً یک آدرس اینترنتی معتبر برای عکس وارد کنید." }),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    slug?: string[];
    imageUrl?: string[];
    features?: string[];
    price?: string[];
  };
};

export async function createProduct(prevState: FormState, formData: FormData): Promise<FormState> {
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  const ImageUrl = formData.get("imageURL");

  // اگر کاربر اسلاگ را وارد نکرده بود، آن را از روی عنوان بساز
  if (!slug) {
    slug = slugify(title);
  } else {
    // اگر کاربر خودش اسلاگ را وارد کرده بود، فقط آن را تمیز کن
    slug = slugify(slug);
  }

  // اعتبارسنجی داده‌ها
  const validatedFields = productSchema.safeParse({
    title: title,
    imageUrl: formData.get("imageURL"), // نام فیلد در فرم
    slug: slug, // از اسلاگ پردازش شده استفاده کن
    features: formData.getAll("features").filter((f) => f),
    price: formData.get("price"),
    durationType: formData.get("durationType"),
    hours: formData.get("hours"),
  });

  if (!validatedFields.success) {
    return {
      message: "خطا در داده‌های ورودی.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;
  const durationString = data.durationType === "instant" ? "فوری" : `حدود ${data.hours} ساعت`;

  try {
    // حالا `data.slug` همیشه یک مقدار تمیز و معتبر دارد
    await db.product.create({
      data: {
        title: data.title,
        slug: data.slug!, // علامت ! یعنی مطمئنیم که slug وجود دارد
        features: data.features,
        price: data.price,
        durationType: data.durationType,
        hours: data.hours,
        duration: durationString,
        images:[data.imageUrl]
      },
    });
  } catch (e: unknown) {
    // ... مدیریت خطا ...
    if (e instanceof Error && e.message.includes("Unique constraint failed")) {
      return {
        message: "خطای سرور: اسلاگ وارد شده تکراری است.",
        errors: { slug: ["این اسلاگ قبلاً استفاده شده است."] },
      };
    }
    return { message: "خطا در هنگام ذخیره در پایگاه داده." };
  }

  revalidatePath("/product-managment");
  return { message: "محصول با موفقیت ایجاد شد." };
}
