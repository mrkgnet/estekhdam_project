"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchDataResource } from "@/actions/user/resources/course/fetchData/Actions";
import {
  Clock,
  FileText,
  AlertCircle,
  PlayCircle,
  Text,
  ShoppingBasket,
  ChevronRight,
  Home,
  ChevronLeft,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { ROUTES } from "@/lib/constats";
import CommentManagment from "@/components/comment/CommentManagmet";
import TabSectionCR from "@/components/user/TabSectionCR";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

// کامپوننت کمکی برای نمایش قیمت
const PriceDisplay = ({ oldPrice, newPrice }: { oldPrice?: number, newPrice?: number }) => {
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

interface ExamDetailsProps {
    initialResponse: any;
    slugValue: string;
}

export default function ExamDetailsPage({ initialResponse, slugValue }: ExamDetailsProps) {
  // مدیریت داده‌ها با ریکت کوئری
  const { data: response, isFetching } = useQuery({
    queryKey: ['resource-course', slugValue], // کلید یکتا برای هر محصول
    queryFn: async () => await fetchDataResource(slugValue),
    initialData: initialResponse,
    staleTime: 1000 * 60 * 30, // ۳۰ دقیقه کش (چون مشخصات دوره معمولاً ثابت است)
  });

  const product = response?.data;

  if (!response?.success || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-4 px-4 text-center font-sans">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-2" />
        <p className="font-medium text-slate-700">محصولی یافت نشد</p>
        <p className="text-slate-500 max-w-md">ممکن است لینک اشتباه باشد یا محصول از سایت حذف شده باشد.</p>
        <Link href="/resources" className="mt-6 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-sm font-medium">
          بازگشت به منابع
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: 'منابع آموزشی',
      href: '/resources',
    },
    {
      label: product.name,
      href: `/resources/course/${product.name}`,
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50/50 pb-[100px] lg:pb-12" dir="rtl">
      {/* افکت لودینگ نامحسوس در پس‌زمینه */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-5 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ==================== ستون سمت راست ==================== */}
          <div className="lg:col-span-4 w-full">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* IMAGE */}
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center group">
                {product.oldPrice && (
                  <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs px-3 py-1 rounded-full shadow z-10">
                    تخفیف
                  </span>
                )}
                <Image
                  src={product.imageUrl && product.imageUrl !== "#" ? product.imageUrl : "/images/products/bookExample.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition duration-500"
                  priority
                />
              </div>

              <div className="p-6 space-y-6">
                {/* TITLE */}
                <div className="space-y-2">
                  <h1 className="text-lg font-semibold text-slate-800 leading-7">
                    {product.name}
                  </h1>

                  {product.categories?.length > 0 && (
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

                {/* QUICK STATS */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <FileText className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-slate-800">
                      {product._count?.questions || 0}
                    </div>
                    <div className="text-xs text-slate-500">سوال</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-700">چهار گزینه‌ای</div>
                    <div className="text-xs text-slate-500">نوع</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <Text className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-700">تشریحی</div>
                    <div className="text-xs text-slate-500">پاسخ</div>
                  </div>
                </div>

                {/* PRICE */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    قیمت محصول
                  </div>
                  <PriceDisplay
                    oldPrice={product.oldPrice}
                    newPrice={product.newPrice}
                  />
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Link
                    href={`/resources/course/questions?pid=${product.id}&pname=${product.slug}`}
                    className="w-full h-12 border-2 border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2 transition bg-slate-100"
                  >
                    <PlayCircle className="w-5 h-5 text-green-600" />
                    مشاهده رایگان بانک سوالات
                  </Link>

                  <Link
                    href={`/cart/${product.id}`}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition active:scale-[0.98]"
                  >
                    <ShoppingBasket className="w-5 h-5" />
                    خرید محصول
                  </Link>
                </div>

                {/* TRUST SECTION */}
                <div className="border-t border-slate-100 pt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    دسترسی فوری بعد از خرید
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    پرداخت امن
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-green-600" />
                    بروزرسانی رایگان سوالات
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== ستون سمت چپ ==================== */}
          <div className="lg:col-span-8 w-full flex flex-col gap-6 lg:gap-8">
            {/* تب‌های توضیحات */}
            <div className="bg-white rounded shadow-sm border border-slate-200/60 p-1">
              <TabSectionCR product={product} isLoading={false} />
            </div>

            {/* بخش نظرات */}
            <div className="">
              <CommentManagment targetId={product.id} targetType="product" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
