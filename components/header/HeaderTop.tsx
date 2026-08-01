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
      <header className="relative z-50 w-full border-b border-gray-200 bg-white font-sans transition-all duration-300">
        <div className="mx-auto h-[72px] px-4 md:px-6 flex items-center justify-between gap-4">

          {/* Right Section - برند */}
          <div className="relative inline-flex items-center shrink-0">
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
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            {/* دکمه باز و بسته کردن سرچ در موبایل */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={2.5} />}
            </button>

            {/* فرض بر این است که NotificationBell هم خودش رو با ارتفاع جدید تطبیق بدهد */}
            <NotificationBell />

            <div className="relative z-10" ref={wrapperRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 h-12 px-4 cursor-pointer text-slate-600 hover:border-slate-400 hover:text-green-700 hover:bg-green-50 transition-all duration-200 bg-white"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm font-medium">حساب کاربری</span>
              </button>

              <div
                className={[
                  "absolute left-0 top-[calc(100%+8px)] z-50 w-52 rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden",
                  "transition-all duration-200 origin-top-left",
                  open
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                ].join(" ")}
                role="menu"
              >
                {isLoading ? (
                  <div className="flex justify-center py-4 text-sm text-gray-400">
                    در حال بررسی...
                  </div>
                ) : !isLoggedIn ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-slate-700 hover:bg-slate-50 transition font-medium"
                    role="menuitem"
                  >
                    <span>ورود / ثبت‌نام</span>
                    <LogIn size={18} className="text-slate-500" />
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 transition font-medium"
                      role="menuitem"
                    >
                      <span>ورود به پنل</span>
                      <User size={18} className="text-green-700" />
                    </Link>
                    <div className="h-[1px] bg-gray-100 w-full" />
                    <button
                      onClick={() => {
                        setOpen(false);
                        logOut();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
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
    <Suspense fallback={<div className="h-[72px] w-full border-b border-gray-200 bg-white"></div>}>
      <HeaderContent {...props} />
    </Suspense>
  );
}
