"use client";

import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useSidebarStore } from '@/store/sideBarStoreAdmin';
import Link from 'next/link';
import { getUnreadNotificationsCount } from '@/actions/notification/global-notification/admin/Actions';

// ایمپورت کردن Server Action (مسیر را بر اساس پروژه خود تنظیم کنید)


export default function NavbarAdmin() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  // تعریف State برای نگهداری تعداد پیام‌ها (مقدار اولیه صفر)
  const [unreadCount, setUnreadCount] = useState(0);

  // واکشی داده‌ها هنگام لود شدن کامپوننت
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // فراخوانی Server Action
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    };

    fetchUnreadCount();

    // (اختیاری) اگر می‌خواهید تعداد پیام‌ها هر چند ثانیه آپدیت شود، 
    // می‌توانید از setInterval استفاده کنید:
    const interval = setInterval(fetchUnreadCount, 60000); // هر یک دقیقه
    return () => clearInterval(interval);

  }, []);

  const handleLogout = () => {
    console.log("خروج از سیستم...");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sm:px-6">

      {/* دکمه همبرگری */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="group flex items-center gap-2 p-2 text-gray-600 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-label="باز و بسته کردن منو"
        >
          <Menu className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium text-sm hidden sm:inline-block">منوی کاربری</span>
        </button>
      </div>

      {/* سمت چپ: نوتیفیکیشن + دکمه خروج */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* بخش زنگوله نوتیفیکیشن */}
        <Link
          href="/adminp/notifications"
          className="relative flex items-center justify-center p-2.5 text-gray-500 transition-all duration-200 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-label="پیام‌ها"
          title="پیام‌ها"
        >
          <Bell className="w-5 h-5" />

          {/* نشانگر (Badge) تعداد پیام‌ها با افکت پالس */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                {unreadCount > 9 ? '+9' : unreadCount}
              </span>
            </span>
          )}
        </Link>

        {/* خط جدا کننده */}
        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* دکمه خروج */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 bg-red-50/80 rounded-xl hover:bg-red-100 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
          title="خروج از حساب کاربری"
        >
          <span className="hidden sm:inline-block">خروج</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
