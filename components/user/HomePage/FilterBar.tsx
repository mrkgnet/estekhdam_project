"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";

// ===============================
// Icons
// ===============================
const BookIcon = ({ className = "w-4 h-4 md:w-5 md:h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const FolderIcon = ({ className = "w-4 h-4 md:w-5 md:h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
    </svg>
);

const GiftIcon = ({ className = "w-4 h-4 md:w-5 md:h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1010.5 7.5h1.5m0-2.625A2.625 2.625 0 1113.5 7.5H12m0-2.625V21m-6-13.5V21m0-13.5a2.25 2.25 0 00-2.25 2.25v.75m2.25-3H5.25A2.25 2.25 0 003 9v.75m15.75-3.75H18.75A2.25 2.25 0 0121 9v.75" />
    </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

// ===============================
// Types
// ===============================
export interface SubBadge {
    label: string;
    color: "blue" | "purple" | "emerald" | "rose";
}

export interface FilterField {
    label: string;
    description?: string;
    icon: React.ReactNode;
    href: string;
    badge?: string;
    subBadges?: SubBadge[];
    variant?: "default" | "featured";
}

type TabCategory = "real-estate-domestic" | "real-estate-foreign" | "car" | "job";

// ===============================
// Data
// ===============================
const filtersByCategory: Record<TabCategory, FilterField[]> = {
    "real-estate-domestic": [
        {
            label: "بانک سوالات استخدامی",
            description: "بیش از ۵۰۰۰ سوال آزمون",
            icon: <BookIcon />,
            href: "/user",
            badge: "آنلاین",
            subBadges: [
                { label: "دولتی", color: "blue" },
                { label: "تالیفی", color: "purple" },
            ],
        },
        {
            label: "دفترچه‌های استخدامی",
            description: "دفترچه‌های رسمی آزمون‌ها",
            icon: <FolderIcon />,
            href: "/user",
            badge: "آنلاین",
            subBadges: [
                { label: "دولتی", color: "blue" },
                { label: "تالیفی", color: "purple" },
            ],
        },
        {
            label: "منابع رایگان",
            description: "جزوه و نمونه سوال رایگان",
            icon: <GiftIcon />,
            href: "/resources/free-resources",
            variant: "featured",
        },
    ],
    "real-estate-foreign": [],
    "car": [],
    "job": [],
};

// ===============================
// Sub-components
// ===============================
const subBadgeStyles: Record<SubBadge["color"], string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/30",
    purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700/30",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/30",
    rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700/30",
};

function SubBadgeList({ items }: { items: SubBadge[] }) {
    return (
        <div className="flex flex-wrap gap-1 md:gap-1.5">
            {items.map((item) => (
                <span
                    key={item.label}
                    className={`inline-flex items-center rounded-md border px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] font-semibold transition-colors ${subBadgeStyles[item.color]}`}
                >
                    {item.label}
                </span>
            ))}
        </div>
    );
}

// ===============================
// Card
// ===============================
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b5998] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

function DefaultCard({ field }: { field: FilterField }) {
    const isFeatured = field.variant === "featured";

    return (
        <Link
            href={field.href}
            className={`group relative flex flex-col gap-2 md:gap-2.5 overflow-hidden rounded border-3 border-slate-300 p-3 md:p-4 transition-all duration-300 ${focusRing} ${
                isFeatured
                    ? "bg-gradient-to-br from-[#3b5998]/5 to-[#3b5998]/10 border-[#3b5998]/30 hover:shadow-lg hover:shadow-[#3b5998]/20 hover:bg-[#3b5998] hover:border-[#3b5998] dark:from-[#3b5998]/20 dark:to-[#3b5998]/30 dark:border-[#3b5998]/50"
                    : "bg-white border-slate-200 hover:border-[#3b5998] hover:shadow-md hover:bg-[#3b5998] dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-[#3b5998]"
            }`}
        >
            {/* آیکون و بج */}
            <div className="flex items-start justify-between gap-2">
                <div className={`flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                    isFeatured
                        ? "bg-[#3b5998] text-white shadow-md shadow-[#3b5998]/30 group-hover:shadow-lg group-hover:scale-105 group-hover:bg-white group-hover:text-[#3b5998]"
                        : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-[#3b5998] group-hover:scale-105 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                    {field.icon}
                </div>

                {field.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#3b5998]/30 bg-[#3b5998]/10 px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] font-bold text-[#3b5998] shadow-sm group-hover:bg-white group-hover:border-white dark:border-[#3b5998]/40 dark:bg-[#3b5998]/40 dark:text-[#3b5998]">
                        <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-red-500 animate-pulse group-hover:bg-red-600" />
                        {field.badge}
                    </span>
                )}

                {isFeatured && (
                    <div className="absolute -top-0.5 -right-0.5 text-yellow-400 animate-pulse group-hover:text-yellow-300">
                        <SparklesIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                )}
            </div>

            {/* متن */}
            <div className="flex flex-col gap-1">
                <h3 className="text-sm md:text-base font-bold text-slate-800 transition-colors duration-200 group-hover:text-white dark:text-slate-100 dark:group-hover:text-white">
                    {field.label}
                </h3>

                {field.description && (
                    <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 line-clamp-1 group-hover:text-white/90">
                        {field.description}
                    </p>
                )}

                {field.subBadges && <SubBadgeList items={field.subBadges} />}
            </div>

            {/* فلش نشانگر */}
            <div className="absolute bottom-2 left-2 text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </div>

            {/* خط پایین */}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full rounded-b" />
        </Link>
    );
}

// ===============================
// Main Component
// ===============================
export default function FilterBar() {
    const [activeCategory] = useState<TabCategory>("real-estate-domestic");
    const fields = useMemo(() => filtersByCategory[activeCategory], [activeCategory]);

    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8" aria-label="دسترسی سریع">
            {/* هدر */}
            <div className="mb-4 md:mb-6 text-center">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-1 ">
                   منابع آموزشی ویژه آزمون‌های استخدامی
                </h2>
               
            </div>

            {/* گرید کارت‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {fields.map((field, idx) => (
                    <DefaultCard key={`${field.href}-${idx}`} field={field} />
                ))}
            </div>
        </section>
    );
}
