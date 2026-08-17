"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchInPageProps {
  placeholder?: string;
  className?: string;
}

export default function SearchInPage({
  placeholder = "جستجوی نام محصول، دوره و...",
  className = "",
}: SearchInPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const [isPending, startTransition] = useTransition();
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";
    if (searchTerm === currentUrlQuery) return;

    setIsDebouncing(true);

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (searchTerm) params.set("query", searchTerm);
      else params.delete("query");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });

      setIsDebouncing(false);
    }, 800);

    return () => clearTimeout(t);
  }, [searchTerm, pathname, router, searchParams, startTransition]);

  const isSearching = isDebouncing || isPending;

  return (
    <div className={`relative w-full group ${className}`} aria-busy={isSearching}>
      {/* آیکون جستجو (سمت راست) */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-slate-400 text-gray-900 text-xs sm:text-sm rounded focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 block pr-12 ${
          isSearching ? "pl-28" : "pl-12"
        } py-3 transition-all duration-300 shadow-sm placeholder:text-gray-400 outline-none`}
        placeholder={placeholder}
      />

      {/* نشانگر لودینگ (سمت چپ) */}
      {isSearching ? (
        <div className="absolute inset-y-0 left-2 my-auto h-8 px-3 flex items-center gap-2 text-[11px] sm:text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-green-500" />
          <span>در حال جستجو</span>
        </div>
      ) : (
        searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 left-2 my-auto h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-all duration-200"
            title="پاک کردن"
          >
            <X className="w-4 h-4" />
          </button>
        )
      )}
    </div>
  );
}
