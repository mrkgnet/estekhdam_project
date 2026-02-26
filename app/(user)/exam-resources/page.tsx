"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string;
  title: string;
  description: string;
  image: string;
  learnHref: string; // آموزش
  examHref: string;  // آزمون
  learnCount?: number;
  examCount?: number;
};

export default function Page() {
  const [query, setQuery] = useState("");

  const categories: Category[] = [
    {
      id: "language",
      title: "زبان انگلیسی",
      description: "درسنامه + نکات پرتکرار + تست‌های طبقه‌بندی‌شده",
      image: "/images/products/bookExample.jpg",
      learnHref: "/exam-resources/language/learn",
      examHref: "/exam-resources/language/exam",
      learnCount: 12,
      examCount: 8,
    },
    {
      id: "banking",
      title: "دانش بانکداری",
      description: "مفاهیم بانکی، قوانین، عملیات و تست‌های منتخب",
      image: "/images/products/bookExample.jpg",
      learnHref: "/exam-resources/banking1",
      examHref: "/exam-resources/1",
      learnCount: 10,
      examCount: 6,
    },
    {
      id: "literature",
      title: "ادبیات فارسی",
      description: "آرایه‌ها، دستور، قرابت معنایی + آزمون‌های موضوعی",
      image: "/images/products/bookExample.jpg",
      learnHref: "/exam-resources/literature/learn",
      examHref: "/exam-resources/literature/exam",
      learnCount: 11,
      examCount: 7,
    },
    {
      id: "iq",
      title: "هوش و استعداد تحلیلی",
      description: "منطق، الگوها، حل سریع + آزمون‌های زمان‌دار",
      image: "/images/products/bookExample.jpg",
      learnHref: "/exam-resources/iq/learn",
      examHref: "/exam-resources/iq/exam",
      learnCount: 9,
      examCount: 10,
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      `${c.title} ${c.description}`.toLowerCase().includes(q)
    );
  }, [query, categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Container card مثل محصولات */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-extrabold text-slate-800">
              منابع آزمون استخدامی بانک‌ها
            </h1>

            <Link
              href="/exam-resources"
              className="text-sm text-green-600 hover:text-green-700 font-semibold transition"
            >
              مشاهده همه
            </Link>
          </div>

          {/* Search */}
          <div className="mt-5">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو بین درس‌ها…"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
              />
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                <span className="text-lg">🔎</span>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-500">
              {filtered.length} دسته پیدا شد
            </div>
          </div>

          {/* Cards (ابعاد دقیق مثل محصول: w-240 + aspect 3/4) */}
          <div className="mt-6 flex flex-wrap gap-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="w-[240px] rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image دقیقا مثل نمونه محصول */}
                <div className="relative w-[240px] aspect-[3/4] bg-slate-50 overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-contain p-4"
                    sizes="240px"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h2 className="text-sm font-semibold text-slate-800 leading-6 line-clamp-2">
                    {c.title}
                  </h2>

                  <p className="text-xs text-slate-500 leading-5 line-clamp-2">
                    {c.description}
                  </p>

                  {/* actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={c.learnHref}
                      className="h-9 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold
                                 flex items-center justify-center hover:bg-slate-50 transition"
                    >
                      آموزش
                      {typeof c.learnCount === "number" && (
                        <span className="mr-1 text-[11px] text-slate-400">
                          ({c.learnCount})
                        </span>
                      )}
                    </Link>

                    <Link
                      href={c.examHref}
                      className="h-9 rounded-xl bg-green-500 text-white text-xs font-semibold
                                 flex items-center justify-center hover:bg-green-600 transition"
                    >
                      آزمون
                      {typeof c.examCount === "number" && (
                        <span className="mr-1 text-[11px] text-white/80">
                          ({c.examCount})
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              موردی پیدا نشد. عبارت دیگری امتحان کن.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}