'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchDataByCategory } from '@/actions/user/getDataByCategory/Actions';
import { ProductListSkeleton_Client } from '@/components/ui/SkeletonLoding/ProductListSkeleton_Client';

// توابع کمکی
const toman = (n: number) => `${n?.toLocaleString("fa-IR")} تومان`;

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

/* ---------------- Skeleton ---------------- */



/* ---------------- Main ---------------- */

export default function ShowDataCat({ 
    initialResponse, 
    slug, 
    searchQuery, 
    currentPage, 
    limit 
}: ShowDataProps) {

    // ✅ mount state
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // استفاده از React Query برای مدیریت کش و وضعیت‌های واکشی
    const { data: response, isFetching } = useQuery({
        queryKey: ['category-products', slug, searchQuery, currentPage, limit],
        queryFn: async () => {
            return await fetchDataByCategory(slug, searchQuery, currentPage, limit);
        },
        initialData: initialResponse,
        staleTime: 1000 * 60 * 10, // ۱۰ دقیقه کش
    });

    const hasData = response?.success && response?.data;
    const showSkeleton = !mounted || (isFetching && !hasData);

    if (showSkeleton) {
        return <ProductListSkeleton_Client />;
    }

    if (!response?.success || !response?.data) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600">
                    <h2 className="">دسته‌بندی مورد نظر یافت نشد.</h2>
                    <Link href="/" className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                        بازگشت به خانه
                    </Link>
                </div>
            </div>
        );
    }

    const products = response.data.products;

    return (
        <div className="text-xs md:text-sm mx-auto p-4 max-w-7xl" dir="rtl">
            {/* نمایش وضعیت لودینگ کمرنگ در هنگام آپدیت کش */}
            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 border border-slate-300 rounded text-slate-500">
                        <p className="text-base">در حال حاضر محصولی در این دسته‌بندی وجود ندارد.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {products.map((product, index) => {
                            const isFree = product.newPrice === 0;
                            const displayIndex = (currentPage - 1) * limit + index + 1;

                            return (
                                <Link key={product.id} href={`/resources/course/${product.slug}`}>
                                    <div className="relative flex shadow flex-row bg-white rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-blue-50/40 transition-colors p-3 sm:p-4 gap-3 sm:gap-6 mt-4">

                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-bold shadow-md border-2 border-white z-10">
                                            {displayIndex}
                                        </div>

                                        <div className="relative w-[110px] sm:w-[200px] shrink-0 aspect-square sm:aspect-[4/3] flex items-center justify-center p-1 sm:p-2 border-l border-gray-200 sm:border-gray-300">
                                            <Image
                                                src={getSafeImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                fill
                                                className="object-contain rounded-lg"
                                                sizes="(max-width: 640px) 110px, 200px"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow justify-between py-1 sm:py-2 min-w-0">
                                            <div>
                                                <h3 className="text-slate-600 font-bold text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-2 hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>

                                                <ul className="flex flex-col gap-1.5 sm:gap-2.5 mb-3 sm:mb-5 text-slate-600 text-xs sm:text-sm">
                                                    <li className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className="bg-emerald-50 text-emerald-500 p-1 rounded-full shrink-0">
                                                            <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="truncate">سرفصل‌های استاندارد</span>
                                                    </li>
                                                    <li className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className="bg-emerald-50 text-emerald-500 p-1 rounded-full shrink-0">
                                                            <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="truncate">پاسخ‌های تشریحی</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="flex flex-wrap-reverse items-center justify-between gap-2 sm:gap-3 border-t border-slate-100 pt-2 sm:pt-4 mt-1 sm:mt-2">
                                                <div className="shrink-0 font-bold text-xs sm:text-sm">
                                                    {isFree ? (
                                                        <div className="bg-emerald-50 text-emerald-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">رایگان</div>
                                                    ) : (
                                                        <span className="text-blue-600 font-extrabold">{toman(product.newPrice)}</span>
                                                    )}
                                                </div>
                                                <button className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm">
                                                    مشاهده بانک سوالات
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
        </div>
    );
}
