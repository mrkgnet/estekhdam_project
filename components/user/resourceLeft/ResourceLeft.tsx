"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, RefreshCcw } from "lucide-react";

type Props = {
  product: any;
};

const Skeleton = () => (
  <div className="lg:col-span-3 w-full">
    <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-3 animate-pulse">
        {/* IMAGE */}
        <div className="w-full aspect-[4/3] bg-slate-100 rounded-xl" />

        <div className="p-6 space-y-6">
          {/* TITLE */}
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-slate-100 rounded" />
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
              <div className="h-6 w-14 bg-slate-100 rounded-full" />
            </div>
          </div>

          {/* TRUST */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ResourceLeft({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <Skeleton />;

  return (
    <div className="lg:col-span-3 w-full">
      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center group">
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
            className="object-contain p-8 transition duration-500"
            priority
          />
        </div>

        <div className="p-6 space-y-6">
          {/* TITLE */}
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

          {/* TRUST */}
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
