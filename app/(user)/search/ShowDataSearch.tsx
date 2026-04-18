'use client'

import Link from 'next/link';
import React from 'react';

// تایپ متناسب با خروجی اکشن getDataSearchMany
interface SearchResultType {
    id: string;
    title: string;
    slug: string;
    type: string; // "product" | "news"
}

interface ShowDataProps {
    response: SearchResultType[];
    query: string;
}

export default function ShowDataSearch({ response, query }: ShowDataProps) {
    
    // اگر نتیجه ای یافت نشد
    if (!response || response.length === 0) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600">
                    <svg className="w-12 h-12 mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="text-lg font-medium text-slate-700">نتیجه‌ای برای «{query}» یافت نشد.</h2>
                    <p className="mt-2 text-sm text-slate-500">لطفاً املای کلمه را بررسی کنید یا عبارت دیگری را جستجو کنید.</p>
                    <Link href="/" className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        بازگشت به خانه
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container text-xs md:text-sm mx-auto p-4 md:p-8 max-w-5xl" dir="rtl">

            {/* مسیر راهنما (Breadcrumb) */}
            <nav className="flex items-center text-slate-400 mb-8 gap-2">
                <Link href="/" className="hover:text-slate-700 transition-colors">خانه</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700">جستجو</span>
            </nav>

            {/* هدر جستجو */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-xl text-slate-800 mb-3 tracking-tight">
                        نتایج جستجو برای <span className="text-blue-600">«{query}»</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed">
                        تعداد {response.length} نتیجه در محصولات و اخبار یافت شد.
                    </p>
                </div>
            </div>

            {/* لیست نتایج */}
            <div className="flex flex-col gap-4">
                {response.map((item) => {
                    const isProduct = item.type === "product";
                    // تعیین لینک بر اساس نوع دیتا
                    const linkHref = isProduct ? `/resources/course/${item.id}` : `/news/${item.slug}`;

                    return (
                        <Link key={`${item.type}-${item.id}`} href={linkHref}>
                            <div className="flex flex-col sm:flex-row bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all p-5 gap-4 items-center">

                                {/* آیکون نشان‌دهنده نوع نتیجه */}
                                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${isProduct ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                                    {isProduct ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    )}
                                </div>

                                {/* بخش محتوا */}
                                <div className="flex flex-col flex-grow w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[10px] px-2 py-1 rounded-md ${isProduct ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {isProduct ? 'دوره آموزشی / محصول' : 'خبر / مقاله'}
                                        </span>
                                    </div>
                                    <h3 className="text-slate-800 text-base font-medium leading-8">
                                        {item.title}
                                    </h3>
                                </div>

                                {/* آیکون فلش انتهای کارت */}
                                <div className="hidden sm:flex shrink-0 text-slate-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
