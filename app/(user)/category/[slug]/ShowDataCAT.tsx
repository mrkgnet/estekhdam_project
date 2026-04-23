'use client'

import { ROUTES } from '@/lib/constats';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// توابع کمکی
const toman = (n: number) => `${n?.toLocaleString("fa-IR")} تومان`;

const calculateDiscount = (oldPrice: number, newPrice: number) => {
    if (!oldPrice || oldPrice <= newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

// تابع برای اعتبارسنجی و اصلاح آدرس عکس
const getSafeImageUrl = (url?: string | null) => {
    if (!url || url === "null" || url.trim() === "") {
        return "/images/products/bookExample.jpg";
    }
    if (!url.startsWith('http') && !url.startsWith('/')) {
        return `/${url}`;
    }
    return url;
};

interface ProductType {
    id: string;
    name: string;
    slug: string;
    oldPrice: number;
    newPrice: number;
    imageUrl?: string | null;
}

interface CategoryType {
    catName: string;
    catSlug: string;
    products: ProductType[];
}

interface ShowDataProps {
    response: {
        success: boolean;
        data: CategoryType | null;
    }
}

export default function ShowDataCat({ response }: ShowDataProps) {
    if (!response.success || !response.data) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600">
                    <svg className="w-12 h-12 mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="">دسته‌بندی مورد نظر یافت نشد.</h2>
                    <Link href="/" className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                        بازگشت به خانه
                    </Link>
                </div>
            </div>
        );
    }

    const category = response.data;
    const products = category.products;

    return (
        <div className="text-xs md:text-sm mx-auto p-4 max-w-7xl" dir="rtl">
            {/* لیست محصولات */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-slate-300 rounded text-slate-500">
                    <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-base">در حال حاضر محصولی در این دسته‌بندی وجود ندارد.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {products.map((product, index) => {
                        const isFree = product.newPrice === 0;

                        return (
                            <Link key={product.id} href={`/resources/course/${product.slug}`}>
                                <div className="relative flex shadow flex-row bg-white rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-blue-50/40 transition-colors p-3 sm:p-4 gap-3 sm:gap-6 mt-4">

                                    {/* --- دایره ایندکس گذاری --- */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-bold shadow-md border-2 border-white z-10">
                                        {index + 1}
                                    </div>

                                    {/* بخش تصویر: عرض در موبایل 110px و در دسکتاپ 200px */}
                                    <div className="relative w-[110px] sm:w-[200px] shrink-0 aspect-square sm:aspect-[4/3] flex items-center justify-center p-1 sm:p-2 border-l border-gray-200 sm:border-gray-300">
                                        <Image
                                            src={getSafeImageUrl(product.imageUrl)}
                                            alt={product.name}
                                            fill
                                            className="object-contain rounded-lg"
                                            sizes="(max-width: 640px) 110px, 200px"
                                        />
                                    </div>

                                    {/* بخش محتوا: افزودن min-w-0 برای جلوگیری از خراب شدن لی‌آوت در موبایل */}
                                    <div className="flex flex-col flex-grow justify-between py-1 sm:py-2 min-w-0">

                                        {/* بخش بالا: عنوان و ویژگی‌ها */}
                                        <div>
                                            <h3 className="text-slate-600 font-bold text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-2 hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h3>

                                            <ul className="flex flex-col gap-1.5 sm:gap-2.5 mb-3 sm:mb-5 text-slate-600 text-xs sm:text-sm">
                                                <li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 truncate">
                                                    <div className="bg-emerald-50 text-emerald-500 p-1 rounded-full shrink-0">
                                                        <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="truncate">سرفصل‌های استاندارد</span>
                                                </li>

                                                <li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 truncate">
                                                    <div className="bg-emerald-50 text-emerald-500 p-1 rounded-full shrink-0">
                                                        <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="truncate">پاسخ‌های تشریحی</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* بخش پایین: قیمت و دکمه مشاهده */}
                                        <div className="flex flex-wrap-reverse items-center justify-between gap-2 sm:gap-3 border-t border-slate-100 pt-2 sm:pt-4 mt-1 sm:mt-2">

                                            {/* سمت راست: قیمت */}
                                            <div className="shrink-0 font-bold text-xs sm:text-sm">
                                                {isFree ? (
                                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs sm:text-sm bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                        </svg>
                                                        <span>رایگان</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-blue-600 font-extrabold leading-none">
                                                            {toman(product.newPrice)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* سمت چپ: دکمه مشاهده */}
                                            <button className="group text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:-translate-y-0.5 shrink-0">
                                                <span>مشاهده</span>
                                                <span className="hidden sm:inline"> بانک سوالات</span>
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
