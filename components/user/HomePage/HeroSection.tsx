"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import SearchHomePage from "./SearchHomePage";
import Link from 'next/link';

// ===============================
// Icons
// ===============================
const UserGroupIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const BookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

// ===============================
// Skeleton Loader
// ===============================
const SkeletonCard = () => (
    <article className="relative overflow-hidden rounded-xl border border-white/10 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200"></div>
            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200"></div>
    </article>
);

interface HeroSectionProps {
    questionsCount: number;
}

export default function HeroSection({ questionsCount }: HeroSectionProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formattedCount = `+${questionsCount.toLocaleString('fa-IR')}`;

    const stats = [
        {
            icon: <UserGroupIcon className="w-5 h-5" />,
            count: formattedCount,
            label: "چهارگزینه‌ای آنلاین",
            color: "teal"
        },
        {
            icon: <BookIcon className="w-5 h-5" />,
            count: "+40",
            label: "بانک سوال",
            color: "indigo"
        },
        {
            icon: <CalendarIcon className="w-5 h-5" />,
            count: "+25",
            label: "دفترچه استخدامی",
            color: "blue"
        }
    ];

    return (
        <section className="relative min-h-[500px] overflow-hidden">
            {/* ویدیو بکگراند */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    poster="/images/video-poster.jpg"
                >
                    <source src="/video/v2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                {/* هدر */}
                <div className="mb-8 text-center">
                    {!isMounted ? (
                        <>
                            <div className="mx-auto mb-3 h-10 w-52 animate-pulse rounded-lg bg-white/20"></div>
                            <div className="mx-auto h-5 w-80 max-w-full animate-pulse rounded bg-white/20"></div>
                        </>
                    ) : (
                        <>
                            <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                                استخدام <span className="text-teal-400">پرو</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
                                پلتفرم جامع آمادگی آزمون‌های استخدامی
                            </p>
                        </>
                    )}
                </div>

                {/* آمار */}
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {!isMounted ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            stats.map((stat, index) => (
                                <article
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/95 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className={`rounded-lg bg-${stat.color}-50 p-2 text-${stat.color}-600 transition-transform duration-300 group-hover:scale-110`}>
                                            {stat.icon}
                                        </div>
                                        <div className="text-3xl font-black text-slate-800">
                                            {stat.count}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-600">
                                        {stat.label}
                                    </div>
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
                                </article>
                            ))
                        )}
                    </div>
                </div>

                {/* دکمه اکشن */}
                <div className="mt-8 text-center">
                    {!isMounted ? (
                        <div className="mx-auto h-12 w-36 animate-pulse rounded-full bg-white/20"></div>
                    ) : (
                        <Link href="/user" className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-xl hover:scale-105">
                            شروع رایگان
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
