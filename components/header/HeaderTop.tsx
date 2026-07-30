"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, User, LogIn, X, LogOut } from "lucide-react";
import AuthModal from "../modals/AuthModal";
import { useQuery } from "@tanstack/react-query";
import { getDataCategory } from "@/actions/category/Actions";
import NotificationBell from "../notification/notificationBell/NotificationBell";
import Image from "next/image";
import SearchBox from "../user/search/SearchBox";

// ایمپورت کردن کامپوننت سرچ جدید (مسیر را بر اساس پوشه بندی خود تنظیم کنید)

interface NavbarProps {
  response?: any[];
  initialCategories?: any[];
}

function HeaderContent({ initialCategories }: NavbarProps) {
  const { isLoggedIn, isLoading, logOut } = useAuth();

  const { data: categoryResponse } = useQuery({
    queryKey: ['categories-navbar'],
    queryFn: () => getDataCategory(),
    initialData: initialCategories,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const popularCategories = categoryResponse?.data?.slice(0, 5) || [];

  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // استیت‌های مربوط به باز/بسته شدن سرچ در موبایل در هدر باقی می‌ماند
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <>
      <header className="relative z-50 w-full border-b border-gray-300 bg-white font-sans transition-all duration-300">
        <div className="mx-auto pl-6 h-[72px] px-6 flex items-center justify-between gap-4">

          {/* Right Section - برند */}
          <div className="relative inline-flex items-center">
            <Link href="/" aria-label="خانه">
              <Image
                src="/images/newLgog .svg"
                alt="لوگو سایت"
                width={100}
                height={40}
                className="w-[80px] md:w-[100px] h-auto transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Center Search - فراخوانی کامپوننت جدید */}
          <SearchBox 
            popularCategories={popularCategories} 
            isMobileSearchOpen={isMobileSearchOpen}
            onCloseMobile={() => setIsMobileSearchOpen(false)}
          />

          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-4 whitespace-nowrap">
            {/* دکمه باز و بسته کردن سرچ در موبایل */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={2.5} />}
            </button>

            <NotificationBell />

            <div className="relative z-10" ref={wrapperRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-400 h-10 px-4 cursor-pointer text-slate-600 hover:text-green-700 hover:bg-green-50 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <User size={18} />
                <span className="hidden sm:inline text-xs">حساب کاربری</span>
              </button>

              <div
                className={[
                  "absolute left-0 top-[calc(100%+10px)] z-50 w-46 rounded bg-white shadow-lg border border-slate-200 overflow-hidden",
                  "transition-all duration-200 origin-top",
                  open
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                ].join(" ")}
                role="menu"
              >
                {isLoading ? (
                  <div className="flex justify-center py-3 text-gray-400">
                    در حال بررسی...
                  </div>
                ) : !isLoggedIn ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                    role="menuitem"
                  >
                    <span>ورود/ثبت‌نام</span>
                    <LogIn size={18} className="text-slate-500" />
                  </button>
                ) : (
                  <div>
                    <Link
                      href="/ddashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-green-600 bg-green-50 hover:bg-green-100 transition border-b border-red-100"
                      role="menuitem"
                    >
                      <span>ورود به پنل</span>
                      <User size={18} className="text-green-600" />
                    </Link>
                    <hr />
                    <button
                      onClick={() => {
                        setOpen(false);
                        logOut();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 transition"
                      role="menuitem"
                    >
                      <span>خروج از حساب</span>
                      <LogOut size={18} className="text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
}

export default function HeaderTop(props: NavbarProps) {
  return (
    <Suspense fallback={<div className="h-[72px] w-full border-b border-gray-300 bg-white"></div>}>
      <HeaderContent {...props} />
    </Suspense>
  );
}