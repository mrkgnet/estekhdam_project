"use client";

import React from "react";
import { Menu, Home, HeadphonesIcon } from "lucide-react";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";
import Link from "next/link";

export default function NavbarUser() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <header className="sticky top-0 z-40 flex items-center w-full px-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm sm:px-6 transition-colors duration-300">
      {/* ================= سمت راست: دکمه منو ================= */}
      <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 rounded-sm transition-colors duration-300">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 p-2 text-gray-600 dark:text-slate-300 transition-all duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
          <span className="sm:block"> دسته‌بندی‌ها</span>
        </button>
      </div>

      {/* ================= سمت چپ: لینک‌ها و اکشن‌ها ================= */}
      <div className="flex items-center gap-2 sm:gap-4 mx-2">
        {/* گروه لینک‌های دسترسی سریع */}
        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-slate-700 transition-colors duration-300">
          <Link
            href={"/"}
            className="flex items-center gap-2 px-2 py-2 font-medium text-gray-600 dark:text-slate-300 transition-colors duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
          >
            <Home className="w-4 h-4" />
            <span className="sm:inline-block">خانه</span>
          </Link>

          {/* لینک با بج جدید */}
          <div className="relative bg-slate-100 dark:bg-slate-800 rounded-md transition-colors duration-300">
            {/* بج آبی */}
            <span className="absolute -top-3 left-0 px-2 py-0.5 text-[10px] font-bold text-white bg-blue-500 dark:bg-blue-600 rounded-full shadow-sm">
              جدید
            </span>

            <Link
              href={"/jobnews/government"}
              className="flex items-center gap-2 px-2 py-2 font-medium text-gray-600 dark:text-slate-300 transition-colors duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
            >
              <HeadphonesIcon className="w-4 h-4" />
              <span className="sm:inline-block">استخدامی‌های دولتی</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}