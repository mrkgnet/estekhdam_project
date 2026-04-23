"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen, Layers, ArrowLeft, Bookmark, FileQuestion, FileText,
  ShoppingBasketIcon
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

type ProductType = {
  id: string | number;
  name: string;
  slug: string;
  oldPrice: number;
  newPrice: number;
  imageUrl: string;
};

interface ShowDataResourcesProps {
  response: ProductType[];
  totalPages: number;
  currentPage: number;
  title: string;
}

const toman = (n: number) => {
  if (n === 0) return "رایگان";
  return `${n?.toLocaleString("fa-IR")} تومان`;
};

export default function ShowDataResources({ response, totalPages, currentPage, title }: ShowDataResourcesProps) {
 

  return (
    <section className="w-full min-h-screen overflow-hidden font-sans" dir="rtl">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     

      

        {/* بررسی خالی بودن داده‌ها */}
        {!response || response.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 min-h-[50vh] rounded-3xl border border-dashed border-gray-200 mt-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <BookOpen className="w-10 h-10" />
            </div>
            <p className="text-gray-500 text-base">محصولی با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          <div className="relative w-full mt-6">
            <div className="w-full sm:bg-white sm:rounded sm:border sm:border-gray-100 sm:p-6 sm:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 mt-4 sm:mt-0">
                {response.map((p, index) => {
                  const itemNumber = index + 1;
                  const productLink = `/resources/course/${p.slug}`;

                  return (
                    <div key={p.id} className="block h-auto">
                      <div className="relative group/card flex flex-row sm:flex-col h-full w-full border border-gray-200 sm:border-gray-300 rounded sm:rounded bg-white sm:hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 p-2.5 sm:p-0 gap-3 sm:gap-0">

                        {/* شماره آیتم */}
                        <div className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white text-slate-600 rounded-full text-xs font-bold shadow-md border-2 border-white">
                          {itemNumber}
                        </div>

                        {/* بخش تصویر */}
                        <Link
                          href={productLink}
                          className="relative w-[130px] shrink-0 aspect-[4/3] sm:w-full sm:h-auto sm:aspect-[4/5] sm:bg-gradient-to-b sm:from-slate-50/50 sm:to-slate-100/50 flex items-center justify-center p-2 sm:p-4 md:p-5 border-l border-gray-300 overflow-hidden rounded-r sm:rounded-none sm:rounded-t"
                        >
                          <button
                            className="absolute top-2 left-2 sm:right-2 z-10 text-gray-500 hover:text-gray-700 sm:hidden"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <div className="relative w-full h-full">
                            <SafeImage
                              src={p.imageUrl || "/images/products/bookExample.jpg"}
                              alt={p.name}
                              fill
                              className="object-contain mix-blend-multiply md:p-0"
                              sizes="(max-width: 640px) 130px, 200px"
                            />
                          </div>
                        </Link>

                        {/* لینک سبد خرید */}
                        <div className="px-3 md:px-4 hidden sm:block">
                          <Link
                            href="/cart"
                            aria-label="رفتن به سبد خرید"
                            className="group flex items-center gap-3 py-2"
                          >
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition shrink-0">
                              <ShoppingBasketIcon className="w-4 h-4" />
                            </span>
                            <span className="h-px flex-1 bg-slate-200" />
                          </Link>
                        </div>

                        {/* اطلاعات محصول */}
                        <Link
                          href={productLink}
                          className="flex flex-col flex-1 sm:p-3 md:p-4 z-10 py-0.5"
                        >
                          <h3 className="text-gray-800 md:leading-relaxed line-clamp-2 min-h-0 sm:min-h-[2.5rem] md:min-h-[2.75rem] group-hover/card:text-green-700 transition-colors duration-300" title={p.name}>
                            {p.name}
                          </h3>

                          <div className="flex flex-col gap-1.5 mt-2">
                            <div className="flex items-center">
                              <span className="bg-[#EEF2FF] text-10 text-[#4F46E5]  px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                <FileQuestion className="w-3.5 h-3.5" />
                                سوالات دولتی و تالیفی طبقه بندی شده
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-[#121211] text-10  px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                دارای پاسخ تشریحی
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between sm:block w-full">
                            <button className="hidden sm:flex w-full h-9 md:h-10 rounded-xl bg-blue-50 text-slate-600 font-medium items-center justify-center gap-2 group-hover/card:bg-green-600 group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-green-200 transition-all duration-300">
                              مشاهده بانک سوالات
                            </button>

                            <div className="text-gray-600 font-medium sm:hidden">
                              {p.newPrice === 0 ? "رایگان" : toman(p.newPrice)}
                            </div>

                            <div className="text-[#3b82f6] text-xs flex items-center gap-1 sm:hidden">
                              <span>شروع یادگیری</span>
                              <ArrowLeft className="w-4 h-4" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </div>
    </section>
  );
}
