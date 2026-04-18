// components/dashboard/DashboardHeader.tsx
"use client";

import { Bell, Sparkles, Headset } from "lucide-react"; // آیکون Headset اضافه شد
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardHeader() {
  // نمونه داده (بعداً از API می‌گیری)
  const user = useMemo(
    () => ({ name: "کاربر عزیز",  notifications: 0 }),
    []
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        
        {/* بخش راست: اطلاعات کاربر */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={18} />
          </div>

          <div className="leading-tight">
            <div className="text-sm text-slate-500">داشبورد</div>
            <div className="font-extrabold text-slate-900">
              سلام، {user.name} 👋
            </div>
          </div>
        </div>

        {/* بخش چپ: اکشن‌ها */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* دکمه پشتیبانی */}
          <Link
            href="ddashboard/support/tickets" // مسیر صفحه لیست تیکت‌ها را اینجا قرار دهید
            className="flex items-center gap-2 h-11 px-3 sm:px-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100/50 transition-all duration-200"
            aria-label="support"
          >
            <Headset size={18} />
            {/* متن دکمه در موبایل مخفی و در دسکتاپ نمایش داده می‌شود */}
            <span className="hidden sm:inline font-bold text-sm">
              پشتیبانی
            </span>
          </Link>

          {/* دکمه اعلان‌ها */}
          <button
            className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200
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
         
        </div>
      </div>
    </header>
  );
}
