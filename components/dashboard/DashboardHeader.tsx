// components/dashboard/DashboardHeader.tsx
"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardHeader() {
  // نمونه داده (بعداً از API می‌گیری)
  const user = useMemo(
    () => ({ name: "محمدرضا", plan: "پرو", notifications: 3 }),
    []
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center gap-4">
        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={18} />
          </div>

          <div className="leading-tight">
            <div className="text-sm text-slate-500">داشبورد</div>
            <div className="font-extrabold text-slate-900">
              سلام، {user.name} 👋
              <span className="mr-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-bold px-2 py-0.5 border border-emerald-100">
                پلن {user.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="relative w-full max-w-[520px]">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="جستجو در آزمون‌ها، سفارش‌ها، دوره‌ها..."
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm outline-none
                         focus:bg-white focus:border-slate-300 transition"
            />
          </div>
        </div>

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition
                       flex items-center justify-center"
            aria-label="notifications"
          >
            <Bell size={18} className="text-slate-600" />
            {user.notifications > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-extrabold
                               flex items-center justify-center shadow">
                {user.notifications}
              </span>
            )}
          </button>

          <Link
            href="/dashboard/settings"
            className="h-11 px-4 rounded-2xl bg-slate-900 text-white font-bold text-sm
                       hover:bg-slate-800 transition flex items-center"
          >
            تنظیمات
          </Link>
        </div>
      </div>
    </header>
  );
}