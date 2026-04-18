"use client";

import { useState, useMemo } from "react";
import { CalendarDays, SearchX, Briefcase, Landmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import StatusBadge from "@/components/ui/StatusBadge";

type GovNewsDB = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  endAt?: Date | string;
  status?: string;
  slugNews: string;
};

interface ShowDataBreakingNewsProps {
  govNews: GovNewsDB[];
}

type CategoryItem = {
  id: "gov" | "private";
  label: string;
  icon: React.ElementType;
};

const categoryItems: CategoryItem[] = [
  { id: "gov", label: "دولتی", icon: Landmark },
  { id: "private", label: "خصوصی", icon: Briefcase },
];

function BrandLogo({ src, alt }: { src?: string | null; alt: string }) {
  // بررسی اینکه آیا عکس وجود دارد و فرمت آدرس آن معتبر است (با http یا / شروع می‌شود)
  const isValidSrc = src && (src.startsWith("http") || src.startsWith("/"));

  return (
    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-sky-200">
      {isValidSrc ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 56px, 64px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center  text-slate-400">
          بدون لوگو
        </div>
      )}
    </div>
  );
}

export default function ShowDataBreakingNews({ govNews }: ShowDataBreakingNewsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<"gov" | "private">("gov");

  const formattedGovNews = useMemo(() => {
    return govNews.map((news) => ({
      id: news.id,
      title: news.title,
      description: news.description,
      endAt: news.endAt,
      status: news.status,
      timeAgo: new Date(news.createdAt).toLocaleDateString("fa-IR"),
      image: news.imageUrl || "/images/placeholder.png",
      href: `/jobnews/government/${news.id}`,
    }));
  }, [govNews]);

  const filteredNews = activeCategoryId === "gov" ? formattedGovNews : [];

  return (
    // استایل باکس اصلی هماهنگ با صفحه اصلی (rounded-2xl)
    <div className="w-full text-xs md:text-sm  rounded border border-slate-200 bg-white p-4 md:p-5 lg:p-6 shadow-sm" dir="rtl">

      {/* header */}
      <div className="mb-5 md:mb-6 flex flex-col gap-4 border-b border-slate-100 pb-4 md:pb-5 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <div className="h-6 md:h-7 w-1.5 rounded-full bg-sky-500"></div>
          <h2 className=" font-bold  text-slate-800 text-base">
            جدیدترین اخبار استخدامی
          </h2>
        </div>

        {/* در موبایل تب‌ها کل عرض را می‌گیرند تا لمسشان راحت باشد */}
        <div className="flex w-full md:w-auto rounded-xl border border-slate-200 bg-slate-50 p-1">
          {categoryItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeCategoryId;

            return (
              <button
                key={item.id}
                onClick={() => setActiveCategoryId(item.id)}
                className={`flex w-1/2 md:w-auto items-center justify-center gap-2 rounded-lg px-4 py-2  font-medium transition-all ${
                  active
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* list */}
      {filteredNews.length > 0 ? (
        // اسکرول بار نرم‌تر با فاصله مناسب
        <div className="flex max-h-[400px] flex-col gap-3 md:gap-4 overflow-y-auto pr-1 md:pr-2">
          {filteredNews.map((it) => (
            <Link
              key={it.id}
              href={it.href}
              // تغییر اصلی اینجاست: در موبایل flex-col و در دسکتاپ flex-row
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >

              {/* بخش سمت راست: عکس و مشخصات */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                <BrandLogo src={it.image} alt={it.title} />

                <div className="flex flex-col gap-2 min-w-0">
                  {/* flex-wrap برای جلوگیری از بیرون زدن بج در صورت طولانی بودن متن در موبایل */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="line-clamp-2  text-slate-800 group-hover:text-sky-700 transition-colors">
                      {it.title}
                    </h3>
                    <StatusBadge status={it.status || "NEWS"} />
                  </div>

                  {it.description && (
                    <p className="line-clamp-1  text-slate-500">
                      {it.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 md:gap-3 text-[12px] text-slate-400">
                    <span className="flex gap-1.5 items-center">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>تاریخ ثبت خبر:</span>
                      <span className="text-slate-600">{it.timeAgo}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* بخش سمت چپ (در موبایل می‌رود پایین): تایمر و دکمه */}
              {/* در موبایل یک خط جداکننده (border-t) بالا سرش می‌اندازیم تا مرتب شود */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                
                <CountdownTimer endAt={it.endAt} active />
                
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5  font-medium text-slate-600 transition-all group-hover:bg-sky-50 group-hover:text-sky-600">
                  مشاهده
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 md:py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-sm  text-slate-700">
            آگهی استخدامی یافت نشد
          </h4>
          <p className="mt-2 max-w-xs text-xs text-slate-500 leading-relaxed">
            در حال حاضر آگهی فعالی برای این دسته‌بندی وجود ندارد. لطفاً دسته‌بندی دیگر را بررسی کنید.
          </p>
        </div>
      )}
    </div>
  );
}
