"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, LayoutGrid, X } from "lucide-react";
import { getDataSearchMany } from "@/actions/search/Actions";

interface SearchBoxProps {
  popularCategories?: any[];
  isMobileSearchOpen?: boolean;
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

  const clearQuery = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await getDataSearchMany(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const innerProps = {
    searchContainerRef,
    isSearchOpen,
    isSearching,
    searchQuery,
    searchResults,
    setIsSearchOpen,
    setSearchQuery,
    handleKeyDown,
    closeSearch,
    clearQuery,
    popularCategories,
  };

  if (!isMobileSearchOpen) {
    return (
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <SearchInner {...innerProps} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full border-b border-gray-100 bg-white pb-4 pt-2 md:hidden animate-in slide-in-from-top-2">
        <SearchInner {...innerProps} />
      </div>
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <SearchInner {...innerProps} />
      </div>
    </>
  );
}

interface SearchInnerProps {
  searchContainerRef: React.RefObject<HTMLDivElement>;
  isSearchOpen: boolean;
  isSearching: boolean;
  searchQuery: string;
  searchResults: any[];
  setIsSearchOpen: (v: boolean) => void;
  setSearchQuery: (v: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  closeSearch: () => void;
  clearQuery: () => void;
  popularCategories: any[];
}

function SearchInner({
  searchContainerRef, isSearchOpen, isSearching, searchQuery,
  searchResults, setIsSearchOpen, setSearchQuery, handleKeyDown,
  closeSearch, clearQuery, popularCategories,
}: SearchInnerProps) {
  return (
    <div ref={searchContainerRef} className="relative w-full max-w-[550px]">
      {/* Right icon: loader or search */}
      {isSearching ? (
        <Loader2 size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin z-10" />
      ) : (
        <Search size={22} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isSearchOpen ? "text-green-600" : "text-gray-400"}`} />
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="منبع آموزش، آزمون، دسته مورد نظرتان را جستجو کنید"
        className={`w-full h-12 rounded border border-slate-400 bg-gray-50 pr-11 pl-10 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
          isSearchOpen ? "bg-white border-green-500 ring-4 ring-green-50 shadow-sm" : "border-gray-300 hover:border-gray-400 focus:bg-white"
        }`}
      />

      {/* Clear (X) button — left side, visible only when there's text */}
      {searchQuery && (
        <button
          type="button"
          onClick={clearQuery}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="پاک کردن جستجو"
        >
          <X size={18} />
        </button>
      )}

      <div className={`absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top z-50 ${
        isSearchOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
      }`}>
        {searchQuery.trim() === "" ? (
          <div className="p-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-3 text-gray-500">
              <LayoutGrid size={18} className="text-gray-400" />
              <span className="font-medium text-sm">جستجوهای محبوب</span>
            </div>
            {popularCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((cat: any, index: number) => (
                  <Link
                    key={cat?.id || index}
                    href={`/category/${cat?.catSlug || ""}`}
                    onClick={closeSearch}
                    className="rounded-lg text-xs font-medium border border-gray-200 px-3 py-2 text-gray-600 bg-white hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                  >
                    {cat?.catName || "بدون نام"}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {searchResults.length > 0 ? (
              <div className="mb-2">
                {searchResults.map((item) => (
                  <Link
                    key={`${item.type}-${item.slug}`}
                    href={item.type === "product" ? `/resources/course/${item.slug}` : `/news/${item.slug}`}
                    onClick={closeSearch}
                    className="flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="font-medium truncate">{item.title}</div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[11px] whitespace-nowrap ml-2">
                      {item.type === "product" ? "محصول" : "خبر"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              !isSearching && <div className="p-6 text-center text-sm text-gray-500">موردی یافت نشد.</div>
            )}
            {searchResults.length > 0 && (
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                onClick={closeSearch}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium hover:bg-green-100 text-green-700 transition-colors bg-green-50 mt-1"
              >
                <Search size={16} />
                <span>مشاهده همه نتایج برای <strong className="mx-1">"{searchQuery}"</strong></span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchBoxInPage(props: SearchBoxProps) {
  return (
    <Suspense fallback={<div className="h-12 w-full max-w-[550px] bg-gray-100 animate-pulse rounded-xl" />}>
      <SearchBoxContent {...props} />
    </Suspense>
  );
}
