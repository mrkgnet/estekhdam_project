"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Clock, Text, PlayCircle, ShoppingBasket } from "lucide-react";

const PriceDisplay = ({
  oldPrice,
  newPrice,
}: {
  oldPrice?: number;
  newPrice?: number;
}) => {
  if (!newPrice) return null;
  return (
    <div className="flex flex-col items-end justify-center leading-tight">
      {oldPrice && oldPrice > newPrice && (
        <span className="text-rose-200 line-through opacity-90 decoration-rose-300">
          {oldPrice.toLocaleString()}
        </span>
      )}
      <div className="flex items-center gap-1">
        <span className="font-black">{newPrice.toLocaleString()}</span>
        <span className="font-normal opacity-90">تومان</span>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="lg:col-span-3 w-full">
    <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-3 space-y-6 animate-pulse">
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-14 bg-slate-100 rounded-xl" />
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

type Props = { product: any };

export default function ResourceRight({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <Skeleton />;

  return (
    <div className="lg:col-span-3 w-full">
      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ✅ اضافه کردن pb-36 برای موبایل تا محتوا زیر دکمه‌های ثابت نرود */}
        <div className="p-3 pb-36 lg:pb-3 space-y-6">
          
          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-slate-800">
                {product?._count?.questions || 0}
              </div>
              <span className="text-10 text-slate-500">سوال</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-10 text-slate-700">پرسش های چهار گزینه‌ای</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Text className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-10 text-slate-500">پاسخ تشریحی</span>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-slate-50 border font-bold border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">قیمت محصول</div>
            <PriceDisplay oldPrice={product?.oldPrice} newPrice={product?.newPrice} />
          </div>

          {/* CTA - ✅ تغییر به fixed در موبایل و relative در دسکتاپ */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 space-y-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] lg:relative lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
            <Link
              href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
              className="w-full h-12 border-2 font-bold border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2 transition bg-slate-100"
            >
              <PlayCircle className="w-5 h-5 text-blue-600" />
رایگان شروع کن            </Link>

            <Link
              href={`/cart/${product?.id}`}
              className="w-full h-12 bg-blue-600 font-bold hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <ShoppingBasket className="w-5 h-5" />
              خرید محصول
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
