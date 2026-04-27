"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  FileText,
  AlertCircle,
  PlayCircle,
  Text,
  ShoppingBasket,
  ChevronRight,
  Home,
  ChevronLeft
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

export default function ExamDetailsPage({ fetchDataR }: any) {
  const product = fetchDataR?.data;

  if (!fetchDataR?.success || !product) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-5">

     

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ==================== ستون سمت راست ==================== */}
          <div className="lg:col-span-3 w-full lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded p-4 sm:p-6 border border-slate-200/60 overflow-hidden relative ">
              <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-br from-green-50 via-white to-white opacity-60 -z-10" />

              {/* عکس محصول */}
              <div className="relative w-full aspect-video sm:aspect-square lg:aspect-[4/3] bg-white mb-5 overflow-hidden flex items-center justify-center group">
                <Image
                  src={product.imageUrl && product.imageUrl !== "#" ? product.imageUrl : "/images/products/bookExample.jpg"}
                  alt={`تصویر ${product.name}`}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 300px"
                  priority
                />
              </div>

              <h1 className="mb-4 text-15 font-semibold">
                {product.name}
              </h1>

              {/* دسته‌بندی‌ها */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex text-11 flex-wrap gap-2 mb-6 ">
                  {product.categories.map((cat: any, idx: number) => (
                    <span key={idx} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-200/60">
                      {cat.catName}
                    </span>
                  ))}
                </div>
              )}

              {/* اطلاعات کلیدی */}
              <div className="space-y-3 mb-6 sm:mb-8 bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-100 ">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 border-dashed">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>تعداد سوالات:</span>
                  </div>
                  <span className="text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-sm">
                    {product._count?.questions || 0} سوال
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 border-dashed">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>نوع پرسش:</span>
                  </div>
                  <span className="text-slate-800">چهار گزینه‌ای</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Text className="w-4 h-4 text-green-600" />
                    <span>نوع پاسخ:</span>
                  </div>
                  <span className="text-slate-800">تشریحی</span>
                </div>
              </div>

              {/* دکمه‌ها در دسکتاپ */}
              <div className="hidden lg:flex flex-col space-y-3">
                <Link
                  href={`/resources/course/questions?pid=${product.id}&pname=${product.slug}`}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.98] group shadow-md shadow-green-600/20 font-medium"
                >
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>ثبت نام و شروع آزمون</span>
                </Link>

                <Link
                  href={`/cart/${product.id}`}
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center justify-between px-5 transition-all hover:-translate-y-0.5 active:scale-[0.98] group shadow-md shadow-rose-600/20"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <ShoppingBasket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>خرید محصول</span>
                  </div>
                  <PriceDisplay oldPrice={product.oldPrice} newPrice={product.newPrice} />
                </Link>
              </div>
            </div>
          </div>

          {/* ==================== ستون سمت چپ ==================== */}
          <div className="lg:col-span-9 w-full flex flex-col gap-6 lg:gap-8">
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

      {/* ==================== نوار دکمه‌های چسبان موبایل ==================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-3 sm:px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 flex gap-3 pb-safe">
        <Link
          href={`/cart/${product.id}`}
          className="flex-1 h-[52px] bg-rose-50/80 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-xl flex flex-col items-center justify-center transition-colors active:scale-95 px-2"
        >
          <span className="font-medium flex items-center gap-1 opacity-90 mb-0.5">
            <ShoppingBasket className="w-3.5 h-3.5" /> خرید
          </span>
          {product.newPrice ? (
            <span className="font-bold tracking-tight">
              {product.newPrice.toLocaleString()} <span className="font-normal">تومان</span>
            </span>
          ) : (
            <span className="font-bold">رایگان</span>
          )}
        </Link>
        <Link
             href={`/resources/course/questions?pid=${product.id}&pname=${product.slug}`}
          className="flex-[1.5] h-[52px] bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 transition-transform active:scale-95"
        >
          <PlayCircle className="w-5 h-5" />
          شروع آزمون
        </Link>
      </div>

    </div>
  );
}
