"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { unstable_noStore as noStore } from "next/cache"; // این را ایمپورت کن
 // مسیر prisma رو مطابق پروژه خودت تنظیم کن

const schema = z.object({
  title: z.string().trim().min(1, "عنوان نامعتبر است.").optional().or(z.literal("")),
  imageUrl: z.string().trim().url("آدرس عکس معتبر نیست.").optional().or(z.literal("")),
  registerStartAt: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int("ترتیب باید عدد صحیح باشد.").default(0),
  isActive: z.coerce.boolean().default(true),
});

type ActionState = {
  ok: boolean;
  message: string;
  errors: Record<string, string[]>;
};

function zodErrorsToMap(err: z.ZodError) {
  const map: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    map[key] = map[key] ? [...map[key], issue.message] : [issue.message];
  }
  return map;
}

export async function createMainSlider(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const raw = {
      title: (formData.get("title") ?? "").toString(),
      imageUrl: (formData.get("imageUrl") ?? "").toString(),
      registerStartAt: (formData.get("registerStartAt") ?? "").toString(),
      order: formData.get("order") ?? "0",
      // checkbox وقتی تیک بخوره "on" میاد، وقتی نخوره اصلاً نمیاد
      isActive: formData.get("isActive") === "on",
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, message: "لطفاً خطاهای فرم را برطرف کنید.", errors: zodErrorsToMap(parsed.error) };
    }

    const data = parsed.data;

    await db.mainSlider.create({
      data: {
        title: data.title === "" ? undefined : data.title,
        imageUrl: data.imageUrl === "" ? undefined : data.imageUrl,
        registerStartAt: data.registerStartAt === "" ? undefined : data.registerStartAt,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return { ok: true, message: "اسلایدر با موفقیت ثبت شد.", errors: {} };
  } catch (e) {
    return { ok: false, message: "خطای غیرمنتظره رخ داد. دوباره تلاش کنید.", errors: {} };
  }
}

//------------------------------------------



const fetchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),

  q: z.string().trim().optional().default(""), // search text
  isActive: z
    .union([z.literal("all"), z.coerce.boolean()])
    .optional()
    .default("all"),

  sortBy: z.enum(["order", "createdAt"]).default("order"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});

type FetchParams = z.infer<typeof fetchSchema>;

type FetchResult<T> = {
  ok: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  errors: Record<string, string[]>;
};



export async function fetchDataMainSlider1(params: FetchParams): Promise<FetchResult<any>> {
  try {
    const parsed = fetchSchema.safeParse(params);
    if (!parsed.success) {
      return {
        ok: false,
        message: "پارامترهای نامعتبر است.",
        data: [],
        meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
        errors: zodErrorsToMap(parsed.error),
      };
    }

    const { page, pageSize, q, isActive, sortBy, sortDir } = parsed.data;

    const where: any = {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              // اگر فیلد دیگری هم داری میتونی اضافه کنی
            ],
          }
        : {}),
      ...(isActive === "all" ? {} : { isActive }),
    };

    const [total, rows] = await Promise.all([
      db.mainSlider.count({ where }),
      db.mainSlider.findMany({
        where,
        orderBy:
          sortBy === "order"
            ? [{ order: sortDir }, { createdAt: "desc" }]
            : [{ createdAt: sortDir }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          registerStartAt: true,
          order: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      ok: true,
      message: "لیست اسلایدرها دریافت شد.",
      data: rows,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      errors: {},
    };
  } catch (e) {
    return {
      ok: false,
      message: "خطای غیرمنتظره رخ داد. دوباره تلاش کنید.",
      data: [],
      meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      errors: {},
    };
  }
}



export default async function fetchMainSlider() {
  noStore();
  try {
    const fetchUsers = await db.mainslider.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: fetchUsers };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "خطا در دریافت اطلاعات" };
  }
}
