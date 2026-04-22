import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Grid } from "lucide-react";

// تعریف تایپ دیتابیس شما (نام فیلدها را با Prisma Schema خود چک کنید)
type CategoryType = {
  id: string; // یا number اگر آیدی شما عدد است
  catName: string; // نام دسته‌بندی
  catSlug: string; // لینک دسته‌بندی
  imageUrl?: string | null; // آیکون دسته‌بندی
};

interface ShowDataCATProps {
  response: {
    success: boolean;
    data: CategoryType[];
    message?: string;
    error?: string;
  };
}

export default function ShowDataCAT({ response }: ShowDataCATProps) {
  // مدیریت حالت خطا یا نبود داده
  if (!response?.success || !response?.data || response.data.length === 0) {
    return (
      <div className="w-full text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        هیچ دسته‌بندی یافت نشد.
      </div>
    );
  }

  const categories = response.data;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 ">
      {/* بخش هدر */}
      <div className="flex items-center justify-between mb-8 bg-gradient-to-l from-orange-200 via-orange-100 to-white px-3 py-2 rounded-md">
        <h2 className="text-14 sm:text-16 md:text-16 flex items-center gap-2">
          <Grid size={14} />
          دسته‌بندی‌ها
        </h2>
        <Link
          href="/categories"
          className="text-14 sm:text-16 md:text-16 text-slate-600 flex items-center hover:text-blue-600 transition-colors gap-1"
        >
          <span>همه</span>
          <span className="leading-none mb-1">
            <ArrowLeft size={14} />
          </span>
        </Link>
      </div>


      {/* بخش گرید */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.catSlug}`} // استفاده از slug برای لینک‌دهی داینامیک
            className="group flex flex-col items-center gap-3 text-center"
          >
            {/* باکس طوسی رنگ آیکون */}
            <div className="w-20  aspect-square bg-slate-100 rounded-3xl flex items-center justify-center p-2 transition-all duration-300 group-hover:bg-slate-200 group-hover:-translate-y-1 group-hover:shadow-md">
              <div className="relative w-full h-full">
                <Image
                  // اگر عکسی در دیتابیس نبود، یک عکس پیش‌فرض نشان می‌دهد
                  src={category.imageUrl || "/images/default-category.png"}
                  alt={category.catName}
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                  sizes="(max-width: 768px) 50vw, 15vw" // بهینه‌سازی لود عکس‌ها
                />
              </div>
            </div>

            {/* عنوان دسته‌بندی */}
            <span className=" group-hover:text-blue-600 transition-colors">
              {category.catName} {/* استفاده از فیلد نام از دیتابیس */}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
