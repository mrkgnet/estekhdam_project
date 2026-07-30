"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, LayoutGrid } from "lucide-react";
import { getDataSearchMany } from "@/actions/search/Actions";

interface SearchBoxProps {
  popularCategories?: any[];
  isMobileSearchOpen?: boolean; // برای هدر که در موبایل نیاز به مخفی/نمایان شدن دارد
  onCloseMobile?: () => void;
}

function SearchBoxContent({ popularCategories = [], isMobileSearchOpen = true, onCloseMobile }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const closeSearch = () => {
    setIsSearchOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  // هندل کردن سرچ با Debounce
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

  // هندل کردن کلیک خارج از کادر جستجو
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
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
    <div
      ref={searchContainerRef}
      className={`z-30 md:flex-1 md:flex md:justify-center md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none ${
        isMobileSearchOpen
          ? "absolute top-full left-0 w-full bg-white px-4 pb-4 pt-2 shadow-md flex border-b border-gray-100 animate-in slide-in-from-top-2"
          : "hidden md:flex"
      }`}
    >
      <div className="relative w-full max-w-[650px]">
        {isSearching ? (
          <Loader2
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin"
          />
        ) : (
          <Search
            size={20}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              isSearchOpen ? "text-green-600" : "text-gray-400"
            }`}
          />
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="منبع آموزش، آزمون، دسته مورد نظرتان را جستجو کنید"
          className={`w-full h-14 rounded-xl border border-slate-500 bg-gray-100 pr-12 pl-4 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
            isSearchOpen
              ? "bg-white border-slate-500  shadow-sm"
              : "border-gray-200 hover:border-gray-300 hover:bg-white"
          }`}
        />

        <div
          className={`absolute top-[calc(100%+10px)] w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top ${
            isSearchOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
          }`}
        >
          {searchQuery.trim() === "" ? (
            <div className="p-5">
              <button
                type="button"
                className="w-full cursor-pointer z-120 flex items-center justify-between pb-4 text-gray-500 transition-colors"
                onClick={closeSearch}
              >
                <div className="flex items-center gap-2 ">
                  <LayoutGrid size={18} className="text-gray-400" />
                  <span className="font-medium">جستجو برای ...</span>
                </div>
              </button>
              <div className="h-[1px] w-full bg-gray-200 mb-4 rounded-full"></div>
              {popularCategories.length > 0 && (
                <>
                  <div className="mb-3 text-gray-800 font-bold">جستجوهای محبوب</div>
                  <div className="flex flex-wrap gap-2.5">
                    {popularCategories.map((cat: any, index: number) => (
                      <Link
                        key={cat?.id || index}
                        href={`/category/${cat?.catSlug || ""}`}
                        onClick={closeSearch}
                        className="rounded-full text-12 border border-gray-200 px-4 py-2 text-gray-600 bg-white hover:border-slate-400 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                      >
                        {cat?.catName || "بدون نام"}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-2">
              {searchResults.length > 0 ? (
                <div className="mb-2">
                  {searchResults.map((item) => {
                    const linkHref =
                      item.type === "product"
                        ? `/resources/course/${item.slug}`
                        : `/news/${item.slug}`;

                    return (
                      <Link
                        key={`${item.type}-${item.slug}`}
                        href={linkHref}
                        onClick={closeSearch}
                        className="flex items-center justify-between p-3 text-black hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="font-medium text-gray-900 truncate">{item.title}</div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                          {item.type === "product" ? "محصول" : "خبر"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                !isSearching && (
                  <div className="p-4 text-center text-gray-500">موردی یافت نشد.</div>
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
  );
}

// قرار دادن کامپوننت در Suspense به دلیل استفاده از useSearchParams
export default function SearchBox(props: SearchBoxProps) {
  return (
    <Suspense fallback={<div className="h-14 w-full max-w-[650px] bg-gray-100 animate-pulse rounded-xl"></div>}>
      <SearchBoxContent {...props} />
    </Suspense>
  );
}
