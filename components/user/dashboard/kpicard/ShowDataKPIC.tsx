'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, ArrowLeft,
} from "lucide-react";

export type ActiveSubscription = {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  plan: { title: string; durationDays: number; price: number };
};

type Props = { kpiData: any; activeSub: ActiveSubscription | null; isLoggedIn: boolean };

const formatPersianDate = (dateStr: Date | string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
};

const getRemainingDays = (endDate: Date | string) => {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

const farsi = (n: number | string) => new Intl.NumberFormat("fa-IR").format(Number(n));

/* ---------------------------------- */
/* کامپوننت اسکلتون با موج راست به چپ */
/* ---------------------------------- */
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-md before:absolute before:inset-0 before:translate-x-full before:animate-[shimmer-rtl_1.5s_infinite] before:bg-gradient-to-l before:from-transparent before:via-white/60 dark:before:via-white/15 before:to-transparent ${className}`}
    />
  );
}

function SkeletonCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 p-3">
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBlock className="w-7 h-7 rounded-lg" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{title}</span>
      </div>
      <SkeletonBlock className="h-5 w-3/4" />
    </div>
  );
}

function SkeletonContent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SkeletonCard title="آخرین اشتراک خریداری شده" />
      <SkeletonCard title="اعتبار باقی‌مانده" />
      <SkeletonCard title="تاریخ پایان اعتبار" />
    </div>
  );
}

/* ---------------------------------- */
/* کامپوننت اصلی */
/* ---------------------------------- */
export default function ShowDataKPIC({ kpiData, activeSub, isLoggedIn }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const remainingDays = activeSub ? getRemainingDays(activeSub.endDate) : 0;
  const active = activeSub && remainingDays > 0;

  if (!isLoggedIn) return null;

  return (
    <div dir="rtl">
      {/* تزریق انیمیشن شیمر RTL */}
      <style>{`
        @keyframes shimmer-rtl {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      <div className="w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${!mounted ? "bg-slate-200 dark:bg-slate-700 animate-pulse" : active ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"}`}>
              {!mounted ? (
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">وضعیت اشتراک و دسترسی ویژه</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">اعتبار دسترسی به سوالات تالیفی، آزمون‌ها و پاسخ‌نامه‌ها</p>
            </div>
          </div>

          {/* Badge Status - اسکلتون تا زمان مانت */}
          {!mounted ? (
            <SkeletonBlock className="h-7 w-28 rounded-full" />
          ) : active ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-800 rounded-full px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> اشتراک فعال
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-full px-3 py-1">
              <AlertCircle className="w-3.5 h-3.5" /> فاقد اشتراک فعال
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {!mounted ? (
            /* 🟡 اسکلتون تا زمان مانت کامل */
            <SkeletonContent />
          ) : active ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/40 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">آخرین اشتراک خریداری شده</span>
                </div>
                <p className="text-base font-medium text-slate-800 dark:text-slate-100">{activeSub!.plan.title}</p>
              </div>

              <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">اعتبار باقی‌مانده</span>
                </div>
                <p className="text-xl font-medium text-emerald-700 dark:text-emerald-400">
                  {farsi(remainingDays)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">روز</span>
                </p>
              </div>

              <div className="rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/40 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">تاریخ پایان اعتبار</span>
                </div>
                <p className="text-base font-medium text-slate-800 dark:text-slate-100">{formatPersianDate(activeSub!.endDate)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">شما اشتراک فعالی ندارید</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">برای دسترسی نامحدود به تمامی سوالات، آزمون‌ها و پاسخ‌نامه‌های تشریحی، پلن مورد نظر خود را فعال کنید.</p>
                </div>
              </div>
              <Link href="/plans" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shrink-0 shadow-sm">
                مشاهده و خرید پلن‌ها <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}