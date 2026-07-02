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

import { getDataSearchMany } from "@/actions/search/Actions";
import { useQuery } from "@tanstack/react-query";
import { getDataCategory } from "@/actions/category/Actions";

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
                                {item.type === "product" ? "منابع استخدامی" : "خبر استخدامی"}
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

        </div>
      </header>

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
