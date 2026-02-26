// app/admin/products/schema.ts

import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد."),
  slug: z.string().min(3, "اسلاگ باید حداقل ۳ کاراکتر باشد.").regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد."),
  features: z.array(z.string()).min(1, "حداقل یک ویژگی برای محصول وارد کنید."),
  price: z.number().positive("قیمت باید یک عدد مثبت باشد."),
  durationType: z.enum(["instant", "hours"]),
  // `hours` فقط زمانی لازم است که `durationType` برابر با `hours` باشد.
  hours: z.number().optional().nullable(),
}).refine(data => {
    // اگر نوع 'hours' بود، مقدار hours هم باید باشد
    if (data.durationType === 'hours' && (data.hours === null || data.hours === undefined)) {
        return false;
    }
    return true;
}, {
    message: "برای مدت زمان ساعتی، مقدار ساعت الزامی است.",
    path: ["hours"], // مسیری که خطا به آن مرتبط است
});
