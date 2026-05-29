"use client";

import { useState, useMemo, useEffect } from "react";
import { CalendarDays, SearchX, Briefcase, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import CountdownTimer from "@/components/CountdownTimer";
import StatusBadge from "@/components/ui/StatusBadge";
import { BreakingNewsListSkeleton } from "@/components/ui/SkeletonLoding/BreakingNewsCardSkeleton";
import { fetchBreakingNewsAction } from "@/actions/user/breakingnews/Gov/fetch/Actions";

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
  initialNews: any; // داده‌های اولیه از سمت سرور
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
        <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs">
          بدون لوگو
        </div>
      )}
    </div>
  );
}

/* ---------------- Main Component ---------------- */

export default function ShowDataBreakingNews({ initialNews }: ShowDataBreakingNewsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<"gov" | "private">("gov");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // واکشی و مدیریت کش با ریکت کوئری (تنظیم شده برای آپدیت ریل‌تایم)
  const { data: response, isLoading } = useQuery({
    queryKey: ["breaking-news"],
    queryFn: () => fetchBreakingNewsAction(),
    initialData: initialNews,
    staleTime: 0, // دیتا کهنه در نظر گرفته می‌شود تا همیشه آخرین نسخه را بگیریم
    refetchInterval: 10000, // هر ۱۰ ثانیه در پس‌زمینه دیتا آپدیت می‌شود
    refetchOnWindowFocus: true, // وقتی کاربر به تب سایت برمی‌گردد رفرش می‌شود
  });

  // استخراج آرایه دیتا از پاسخ
  const govNews: GovNewsDB[] = response?.data || [];

  const formattedGovNews = useMemo(() => {
    return govNews.map((news) => ({
      id: news.id,
      title: news.title,
      description: news.description,
      endAt: news.endAt,
      status: news.status,
      timeAgo: new Date(news.createdAt).toLocaleDateString("fa-IR"),
      image: news.imageUrl || "/images/placeholder.png",
      href: `/jobnews/government/${news.slugNews}`,
    }));
  }, [govNews]);

  // فیلتر اخبار بر اساس تب انتخاب شده
  const filteredNews = activeCategoryId === "gov" ? formattedGovNews : [];

  // نمایش اسکلتون لودینگ تا زمان بارگذاری کامل یا گرفتن دیتا
  const showSkeleton = !mounted || isLoading;

  return (
    <div className="w-full rounded border border-slate-200 bg-white p-4 md:p-5 lg:p-6 shadow-sm" dir="rtl">
      {/* header */}
      <div className="mb-5 md:mb-6 flex flex-col gap-4 border-b border-slate-100 pb-4 md:pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 md:h-7 w-1.5 rounded-full bg-sky-500"></div>
          <h2 className="text-slate-600 text-base font-bold">جدیدترین اخبار استخدامی</h2>
        </div>

        <div className="flex w-full md:w-auto rounded-xl border border-slate-200 bg-slate-50 p-1">
          {categoryItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeCategoryId;

            return (
              <button
                key={item.id}
                onClick={() => setActiveCategoryId(item.id)}
                className={`flex w-1/2 md:w-auto items-center text-13 md:text-14 lg:text-13 font-bold justify-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  active
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* content */}
      {showSkeleton ? (
        <BreakingNewsListSkeleton />
      ) : filteredNews.length > 0 ? (
        <div className="flex max-h-[400px] flex-col gap-3 md:gap-4 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
          {filteredNews.map((it) => (
            <Link
              key={it.id}
              href={it.href}
              target="_blank"
              prefetch={true}
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                <BrandLogo src={it.image} alt={it.title} />

                <div className="flex flex-col gap-4 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="font-semibold text-13 md:text-14 lg:text-13 text-slate-600 group-hover:text-sky-700 transition-colors">
                      {it.title}
                    </h3>
                    <StatusBadge status={it.status || "NEWS"} />
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-10 sm:text-11 text-slate-400">
                    <span className="flex gap-1.5 items-center">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>تاریخ ثبت خبر:</span>
                      <span className="text-slate-600">{it.timeAgo}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                <CountdownTimer endAt={it.endAt} active />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 md:py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-slate-700 font-semibold">آگهی استخدامی یافت نشد</h4>
          <p className="mt-2 max-w-xs text-slate-500 text-sm leading-relaxed">
            در حال حاضر آگهی فعالی برای این دسته‌بندی وجود ندارد. لطفاً دسته‌بندی دیگر را بررسی کنید.
          </p>
        </div>
      )}
    </div>
  );
}