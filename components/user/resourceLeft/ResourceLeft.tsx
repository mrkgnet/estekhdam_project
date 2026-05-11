"use client";

// ❌ دیگر نیازی به useState نیست
import Image from "next/image";
import { CheckCircle2, ShieldCheck, RefreshCcw } from "lucide-react";

type Props = {
  product: any; // بهتر است تایپ دقیق‌تری برای product تعریف شود
};

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZjFmNWY5IiAvPgo8L3N2Zz4=";

export default function ResourceLeft({ product }: Props) {
  // ❌ حذف کامل state مربوط به لود شدن تصویر
  // const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="lg:col-span-3 w-full">
      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
          
          {/* ❌ اسکلتون حذف شد. placeholder="blur" کار آن را به شکل بهینه‌تری انجام می‌دهد. */}

          {product?.oldPrice && (
            <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs px-3 py-1 rounded-full shadow z-10">
              تخفیف
            </span>
          )}

          <Image
            src={
              product?.imageUrl && product.imageUrl !== "#"
                ? product.imageUrl
                : "/images/products/bookExample.jpg"
            }
            alt={product?.name || "product"}
            fill
            priority // ✅ بسیار عالی که priority وجود دارد. این برای LCP مهم است.
            placeholder="blur"
            blurDataURL={blurDataURL}
            // ❌ حذف onLoadingComplete
            // ❌ حذف کلاس‌های شرطی. next/image خودش این انتقال را مدیریت می‌کند.
            className="object-contain p-8"
          />
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-slate-800 leading-7">
              {product?.name}
            </h1>

            {product?.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat: any, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                  >
                    {cat.catName}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              دسترسی فوری بعد از خرید
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              پرداخت امن
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-blue-600" />
              بروزرسانی رایگان سوالات
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
