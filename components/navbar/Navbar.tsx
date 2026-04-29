"use client";

import React from 'react';
import { Menu, Home, HeadphonesIcon, Bell } from 'lucide-react';
import { useSidebarStore } from '@/store/sideBarStoreAdmin';
import Link from 'next/link';


export default function NavbarUser() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <header className="sticky top-0 z-40  flex items-center  w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sm:px-6">

      {/* ================= سمت راست: دکمه منو ================= */}
      <div className="flex items-center bg-blue-50 rounded-sm">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 p-2 text-gray-600 transition-all duration-200 rounded-xl hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
          <span className="   sm:block">منو دسته بندی ها</span>
        </button>
      </div>

      {/* ================= سمت چپ: لینک‌ها و اکشن‌ها ================= */}
      <div className="flex items-center gap-2 sm:gap-4 mx-2">

        {/* گروه لینک‌های دسترسی سریع */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-2 sm:pl-4">
          <Link href={'/'} className="flex items-center gap-2 px-3 py-2  font-medium text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-100 hover:text-gray-900">
            <Home className="w-4 h-4" />
            <span className=" sm:inline-block">خانه</span>
          </Link>

          <Link href={'/contact'} className="flex items-center gap-2 px-3 py-2  font-medium text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-100 hover:text-gray-900">
            <HeadphonesIcon className="w-4 h-4" />
            <span className=" sm:inline-block">تماس باما</span>
          </Link>
        </div>



      </div>


    </header>
  );
}
