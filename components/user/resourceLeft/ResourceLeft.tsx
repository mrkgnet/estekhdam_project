"use client";

import Image from "next/image";
import { CheckCircle2, ShieldCheck, RefreshCcw } from "lucide-react";

type Props = {
  product: any;
};

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZjFmNWY5IiAvPgo8L3N2Zz4=";

export default function ResourceLeft({ product }: Props) {
  return (
    <div className="lg:col-span-3 w-full">
      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* ✅ Mobile: افقی | Desktop: عمودی */}
        <div className="flex flex-row lg:flex-col">
          {/* IMAGE */}
          <div className="relative w-[130px] lg:w-full   lg:aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center flex-shrink-0">
            {/* ✅ Label */}
            <span className="absolute top-2 right-2 z-20 text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white shadow">
              آنلاین
            </span>

            <Image
              src={
                product?.imageUrl && product.imageUrl !== "#"
                  ? product.imageUrl
                  : "/images/products/bookExample.jpg"
              }
              alt={product?.name || "product"}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 140px, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-contain md:p-4"
            />
          </div>

          {/* CONTENT */}
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-1">
            <div className="space-y-2">
              <h1 className="text-13 md:text-14 font-semibold text-slate-800 leading-7">
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

            <div className="border-t border-slate-100 pt-4 space-y-3 text-12 md:text-13 text-slate-600">
             
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-blue-600" />
                بروزرسانی رایگان سوالات
              </div>
            </div>
          </div>
        </div>
        {/* ✅ End layout */}
      </div>
    </div>
  );
}
