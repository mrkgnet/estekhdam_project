'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchDataByCategory } from '@/actions/user/getDataByCategory/Actions';
import { ProductListSkeleton_Client } from '@/components/ui/SkeletonLoding/ProductListSkeleton_Client';
import {
  Bookmark,
  FileQuestion,
  FileText,
  ShoppingBasketIcon,
  ArrowLeft
} from "lucide-react";

// توابع کمکی
const toman = (n: number) => {
    if (n === 0) return "رایگان";
    return `${n?.toLocaleString("fa-IR")} تومان`;
};

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
    initialResponse: {
        success: boolean;
        data: CategoryType | null;
    };
    slug: string;
    searchQuery: string;
    currentPage: number;
    limit: number;
}

export default function ShowDataCat({ 
    initialResponse, 
    slug, 
    searchQuery, 
    currentPage, 
    limit 
}: ShowDataProps) {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: response, isFetching } = useQuery({
        queryKey: ['category-products', slug, searchQuery, currentPage, limit],
        queryFn: async () => {
            return await fetchDataByCategory(slug, searchQuery, currentPage, limit);
        },
        initialData: initialResponse,
        staleTime: 1000 * 60 * 10,
    });

    const hasData = response?.success && response?.data;
    const showSkeleton = !mounted || (isFetching && !hasData);

    if (showSkeleton) {
        return <ProductListSkeleton_Client />;
    }

    // وضعیت عدم یافتن دسته‌بندی
    if (!response?.success || !response?.data) {
        return (
            <div className="container mx-auto p-4 md:p-8" dir="rtl">
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-slate-200 shadow-sm rounded-3xl text-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">دسته‌بندی مورد نظر یافت نشد!</h2>
                    <p className="text-slate-500 text-sm mb-8">ممکن است لینک اشتباه باشد یا دسته‌بندی حذف شده باشد.</p>
                    <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        );
    }

    const products = response.data.products;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative" dir="rtl">
            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                
                {products.length === 0 ? (
                    // وضعیت خالی بودن محصولات
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 min-h-[50vh] rounded-3xl border border-dashed border-gray-200 mt-6 text-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-semibold text-gray-600 mb-1">محصولی یافت نشد</p>
                        <p className="text-gray-500 text-sm">در حال حاضر محصولی در این دسته‌بندی وجود ندارد.</p>
                    </div>
                ) : (
                    // گرید محصولات با استایل جدید
                    <div className="w-full sm:bg-white sm:rounded sm:border sm:border-gray-100 sm:p-6 sm:shadow-[0_8px_30px_rgb(0,0,0,0.02)] mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 mt-4 sm:mt-0">
                            {products.map((p, index) => {
                                const itemNumber = (currentPage - 1) * limit + index + 1;
                                const productLink = `/resources/course/${p.slug}`;

                                return (
                                    <div key={p.id} className="block h-auto">
                                        <div className="relative group/card  flex flex-row sm:flex-col h-full w-full border border-gray-200 sm:border-gray-300 rounded sm:rounded bg-white sm:hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 p-2.5 sm:p-0 gap-3 sm:gap-0">
                                            
                                            {/* شماره (Index Badge) */}
                                            <div className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white text-slate-600 rounded-full text-xs font-bold shadow-md border-2 border-white">
                                                {itemNumber}
                                            </div>

                                            {/* تصویر */}
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
                                                    <Image
                                                        src={getSafeImageUrl(p.imageUrl)}
                                                        alt={p.name}
                                                        fill
                                                        className="object-contain mix-blend-multiply md:p-0"
                                                        sizes="(max-width: 640px) 130px, 200px"
                                                    />
                                                </div>
                                            </Link>

                                            {/* آیکون سبد خرید (فقط در دسکتاپ) */}
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

                                            {/* محتوای کارت */}
                                            <Link
                                                href={productLink}
                                                className="flex flex-col flex-1 sm:p-3 md:p-4 z-10 py-0.5"
                                            >
                                                <h3
                                                    className="text-slate-600 font-bold md:leading-relaxed line-clamp-2 min-h-0  group-hover/card:text-green-700 transition-colors duration-300"
                                                    title={p.name}
                                                >
                                                    {p.name}
                                                </h3>

                                                {/* ویژگی‌ها */}
                                                <div className="flex flex-col gap-1.5 mt-2">
                                                    <div className="flex items-center">
                                                        <span className="bg-[#EEF2FF] text-[10px] text-[#4F46E5] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                                            <FileQuestion className="w-3.5 h-3.5" />
                                                            سوالات طبقه بندی شده
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-[#121211] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                                            <FileText className="w-3.5 h-3.5 text-gray-500" />
                                                            دارای پاسخ تشریحی
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* بخش انتهای کارت */}
                                                <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between sm:block w-full">
                                                    
                                                  

                                                    {/* قیمت موبایل */}
                                                    <div className="text-gray-600 font-medium sm:hidden text-sm">
                                                        {toman(p.newPrice)}
                                                    </div>

                                                    {/* دکمه موبایل */}
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
                )}
            </div>
        </div>
    );
}
