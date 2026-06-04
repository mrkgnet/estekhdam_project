"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  Search,
  User,
  LogIn,
  ShoppingCart,
  Contact,
  LayoutGrid,
  Loader2,
  X,
  Backpack,
  LogOut,
} from "lucide-react";
import AuthModal from "../modals/AuthModal";
import { getDataSearchMany } from "@/actions/search/Actions";
import { useQuery } from "@tanstack/react-query";
import { getDataCategory } from "@/actions/category/Actions";
import NotificationBell from "../notification/notificationBell/NotificationBell";
import Image from "next/image";
interface NavbarProps {
  response?: any[];
  initialCategories?: any[];
}

// ۱. نام کامپوننت اصلی را به HeaderContent تغییر می‌دهیم
function HeaderContent({ initialCategories }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      const results = await getDataSearchMany(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="relative z-50 w-full border-b border-gray-300 bg-white font-sans transition-all duration-300">
        <div className="mx-auto pl-6 h-[72px] px-6 flex items-center justify-between gap-4">

          {/* Right Section - برند */}
          <div className="relative inline-flex items-center">


            <Link
              href="/"
              aria-label="خانه"
              
            >

              <Image
                src="/images/newLgog .svg"
                alt="لوگو سایت"
                width={100}
                height={40}
                // کلاس زیر برای مدیریت سایز در موبایل و دسکتاپ اضافه شده است
                className="w-[80px] md:w-[100px] h-auto transition-all duration-300"
                priority
              />
            </Link>

            
          </div>

          {/* Center Search */}
          <div
            ref={searchContainerRef}
            className={`z-50 md:flex-1 md:flex md:justify-center md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none ${isMobileSearchOpen
              ? "absolute top-full left-0 w-full bg-white px-4 pb-4 pt-2 shadow-md flex border-b border-gray-100 animate-in slide-in-from-top-2"
              : "hidden"
              }`}
          >
            <div className="relative w-full max-w-[650px]">
              {isSearching ? (
                <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin" />
              ) : (
                <Search size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchOpen ? "text-green-600" : "text-gray-400"
                  }`} />
              )}

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="منبع آموزش، آزمون، دسته مورد نظرتان را جستجو کنید"
                className={`w-full h-12 rounded border border-slate-300 bg-gray-200 pr-11 pl-4 outline-none transition-all duration-200 ${isSearchOpen ? "bg-white border-gray-500" : "border-gray-200 focus:bg-white hover:border-gray-300"
                  }`}
              />

              <div
                className={`absolute top-[calc(100%+8px)] w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top ${isSearchOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}
              >
                {searchQuery.trim() === "" ? (
                  <div className="p-5">
                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-between pb-4 text-gray-500 transition-colors"
                      onClick={closeSearch}
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={18} className="text-gray-400" />
                        <span className="font-medium">جستجو برای ...</span>
                      </div>
                    </button>
                    <div className="h-[1px] w-full bg-gray-200 mb-4 rounded-full"></div>
                    <div className="mb-3 text-gray-800 font-bold">جستجوهای محبوب</div>
                    <div className="flex flex-wrap gap-2.5">
                      {popularCategories.map((cat: any, index: number) => (
                        <Link
                          key={cat?.id || index}
                          href={`/category/${cat?.catSlug || ''}`}
                          onClick={closeSearch}
                          className="rounded-full text-12 border border-gray-200 px-4 py-2 text-gray-600 bg-white hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                        >
                          {cat?.catName || "بدون نام"}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.length > 0 ? (
                      <div className="mb-2">
                        {searchResults.map((item) => {
                          const linkHref = item.type === "product"
                            ? `/resources/course/${item.slug}`
                            : `/news/${item.slug}`;

                          return (
                            <Link
                              key={`${item.type}-${item.slug}`}
                              href={linkHref}
                              onClick={closeSearch}
                              className="flex items-center justify-between p-3 text-black hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="font-medium text-gray-900 truncate">
                                {item.title}
                              </div>
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                {item.type === "product" ? "محصول" : "خبر"}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="p-4 text-center text-gray-500">
                          موردی یافت نشد.
                        </div>
                      )
                    )}

                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={closeSearch}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 text-green-700 transition-colors text-right bg-green-50/50 mt-1"
                    >
                      <Search size={18} />
                      <span>
                        مشاهده همه نتایج برای <strong className="mx-1">"{searchQuery}"</strong>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-4 whitespace-nowrap">
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                if (isMobileSearchOpen) setIsSearchOpen(false);
              }}
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

// ۲. خروجی اصلی کامپوننت را در Suspense قرار می‌دهیم
export default function HeaderTop(props: NavbarProps) {
  return (
    // یک اسکلتون یا دیو ساده هم‌ارتفاع با هدر برای جلوگیری از پرش صفحه قرار می‌دهیم
    <Suspense fallback={<div className="h-[72px] w-full border-b border-gray-300 bg-white"></div>}>
      <HeaderContent {...props} />
    </Suspense>
  );
}
