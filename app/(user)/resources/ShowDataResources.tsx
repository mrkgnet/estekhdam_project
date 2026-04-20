"use client";

import React, { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen, Layers, ArrowLeft, Bookmark, FileQuestion, FileText,
  ChevronLeft, Home
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";

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
  title: string
}

const toman = (n: number) => {
  if (n === 0) return "رایگان";
  return `${n?.toLocaleString("fa-IR")} تومان`;
};

const calculateDiscount = (oldPrice: number, newPrice: number) => {
  if (!oldPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

export default function ShowDataResources({ response, totalPages, currentPage, title }: ShowDataResourcesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  console.log(response)

  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";
    if (searchTerm === currentUrlQuery) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", "1");

      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });

    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <section className="w-full min-h-screen py-6 overflow-hidden font-sans" dir="rtl">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb - ناوبری */}
        <nav className="flex mb-4 text-gray-500 text-bread" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center  hover:text-emerald-600 border-gray-300 transition-colors border p-1 rounded-full bg-gray-100">
                <Home className="w-3.5 h-3.5 ml-1.5 mb-0.5" />
                خانه
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" />
                <Link href="/resources" className={` hover:text-emerald-600  border-gray-300 transition-colors border p-1 rounded-full bg-gray-100 ${!title ? 'text-gray-800' : ''}`}>
                  منابع آموزشی
                </Link>
              </div>
            </li>
            {title && (
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" />
                  <span className=" text-gray-800 border border-gray-300 p-1 rounded-full bg-gray-100">{title}</span>
                </div>
              </li>
            )}
          </ol>
        </nav>

        <div className="border border-gray-300 border-gra rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full p-1">
            {/* Title + Icon */}
            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
              <div
                className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-white shadow-sm ring-1 ring-emerald-200/50 transition-all duration-300 hover:shadow-md hover:ring-emerald-300/70 group"
                role="presentation"
                aria-hidden="true"
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                <Layers
                  className="relative h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.8}
                  aria-label="آیکون منابع"
                />
              </div>

              <div className="flex flex-col gap-0.5 sm:gap-1">
                <h2 className="flex flex-wrap items-baseline gap-x-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
                  <span>جدیدترین منابع </span>
                  {title && (
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-50 to-rose-50 px-2.5 py-0.5 text-base sm:text-lg font-bold text-red-600 ring-1 ring-inset ring-red-200/60">
                      {title}
                    </span>
                  )}
                </h2>
                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                  مشاهده تمامی دوره‌ها و منابع آموزشی در یک نگاه
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-[350px] lg:w-[420px] shrink-0">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="جستجوی نام محصول، دوره و..."
                className="w-full"
              />
            </div>
          </div>
        </div>

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
                  return (
                    <Link key={p.id} href={`/resources/course/${p.slug}`} className="block h-auto">
                      <div className="relative group/card flex flex-row sm:flex-col h-full w-full border border-gray-200 sm:border-gray-300 rounded sm:rounded bg-white sm:hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 p-2.5 sm:p-0 gap-3 sm:gap-0">

                        {/* شماره آیتم */}
                        <div className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white text-slate-600 rounded-full text-xs font-bold shadow-md border-2 border-white">
                          {itemNumber}
                        </div>

                        {/* بخش تصویر */}
                        <div className="relative w-[130px] shrink-0 aspect-[4/3] sm:w-full sm:h-auto sm:aspect-[4/5] sm:bg-gradient-to-b sm:from-slate-50/50 sm:to-slate-100/50 flex items-center justify-center p-2 sm:p-4 md:p-5 border-l border-gray-300 overflow-hidden rounded-r sm:rounded-none sm:rounded-t">
                          <button className="absolute top-2 left-2 sm:right-2 z-10 text-gray-500 hover:text-gray-700 sm:hidden">
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
                        </div>

                        {/* بخش اطلاعات محصول */}
                        <div className="flex flex-col flex-1 sm:p-3 md:p-4 z-10 py-0.5">
                          {/* عنوان محصول */}
                          <h3 className="text-gray-800 font-bold text-sm sm:text-slate-700 sm:font-medium sm:text-base md:leading-relaxed line-clamp-2 min-h-0 sm:min-h-[2.5rem] md:min-h-[2.75rem] group-hover/card:text-green-700 transition-colors duration-300" title={p.name}>
                            {p.name}
                          </h3>

                          {/* ویژگی‌های محصول */}
                          <div className="flex flex-col gap-1.5 mt-2">
                            <div className="flex items-center">
                              <span className="bg-[#EEF2FF] text-[#4F46E5] text-xs px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                <FileQuestion className="w-3.5 h-3.5" />
                                سوالات دولتی و تالیفی طبقه بندی شده
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-[#121211] text-xs px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                دارای پاسخ تشریحی
                              </span>
                            </div>
                          </div>

                          {/* بخش قیمت و دکمه */}
                          <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between sm:block w-full">
                            <button className="hidden sm:flex w-full h-9 md:h-10 rounded-xl bg-blue-50 text-slate-600 text-sm font-medium items-center justify-center gap-2 group-hover/card:bg-green-600 group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-green-200 transition-all duration-300">
                              مشاهده بانک سوالات
                            </button>
                            
                            {/* قیمت در موبایل */}
                            <div className="text-gray-600 text-sm font-medium sm:hidden">
                              {p.newPrice === 0 ? "رایگان" : toman(p.newPrice)}
                            </div>
                            
                            {/* لینک موبایل */}
                            <div className="text-[#3b82f6] text-xs flex items-center gap-1 sm:hidden">
                              <span>شروع یادگیری</span>
                              <ArrowLeft className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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