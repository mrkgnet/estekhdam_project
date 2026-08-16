// components/dashboard/DashboardHeader.tsx
"use client";

import { Bell, Sparkles, Headset } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardHeader() {
  const user = useMemo(
    () => ({ name: "کاربر عزیز", notifications: 0 }),
    []
  );

  return (
    <header className="sticky top-0 z-30 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 md:h-[72px] flex items-center justify-between gap-4">
        
        {/* بخش راست: لوگو + خوش‌آمدگویی */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 blur-md opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md">
              <Sparkles size={18} className="drop-shadow-sm" />
            </div>
          </div>

          <div className="leading-tight">
            <span className="font-medium text-slate-400 dark:text-slate-500 tracking-wide text-xs">داشبورد</span>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 text-sm md:text-base">
              سلام، {user.name}
              <span className="inline-block text-lg">👋</span>
            </h2>
          </div>
        </div>

        {/* بخش چپ: دکمه‌ها */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* دکمه پشتیبانی با استایل جدید */}
          <Link
            href="/ddashboard/support/tickets"
            className="group relative flex items-center gap-2 h-10 md:h-11 px-3 md:px-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-600 dark:text-blue-400 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 hover:text-blue-700 dark:hover:text-blue-300 border-2 border-blue-300 dark:border-blue-800 transition-all duration-300 hover:shadow-md active:scale-95"
            aria-label="پشتیبانی"
          >
            <Headset size={18} className="transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline text-sm font-semibold">پشتیبانی</span>
          </Link>

          {/* دکمه اعلان‌ها با نشانگر پالسی */}
          <button
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow active:scale-95"
            aria-label="اعلان‌ها"
          >
            <Bell size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
            
            {user.notifications > 0 && (
              <>
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
                  {user.notifications > 9 ? '9+' : user.notifications}
                </span>
                {/* افکت پالس برای جلب توجه */}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-400 animate-ping opacity-60"></span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}