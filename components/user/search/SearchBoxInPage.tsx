"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  LayoutGrid,
  X,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { getDataSearchMany } from "@/actions/search/Actions";

interface SearchBoxProps {
  popularCategories?: any[];
  isMobileSearchOpen?: boolean;
  onCloseMobile?: () => void;
}

interface SearchResultItem {
  type: string;
  slug: string;
  title: string;
}

interface SearchInnerProps {
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  isSearchOpen: boolean;
  isSearching: boolean;
  searchQuery: string;
  searchResults: SearchResultItem[];
  setIsSearchOpen: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  closeSearch: () => void;
  clearQuery: () => void;
  popularCategories: any[];
}

function SearchBoxContent({
  popularCategories = [],
  isMobileSearchOpen = true,
  onCloseMobile,
}: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || searchParams?.get("q") || ""
  );

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    onCloseMobile?.();
  }, [onCloseMobile]);

  const clearQuery = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(true);
  }, []);

  /**
   * Search with debounce
   * جلوگیری از Race Condition با requestId
   */
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await getDataSearchMany(query);

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Search error:", error);

        if (currentRequestId === requestIdRef.current) {
          setSearchResults([]);
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  /**
   * Escape key
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /**
   * Open search result page
   */
  const handleSearchSubmit = useCallback(() => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    closeSearch();

    router.push(`/search?q=${encodeURIComponent(query)}`);
  }, [closeSearch, router, searchQuery]);

  /**
   * Enter key
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const innerProps: SearchInnerProps = {
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

  /**
   * Desktop only
   */
  if (!isMobileSearchOpen) {
    return (
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <SearchInner {...innerProps} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="w-full border-b border-slate-100 bg-white px-3 pb-3 pt-2 md:hidden">
        <SearchInner {...innerProps} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <SearchInner {...innerProps} />
      </div>
    </>
  );
}

function SearchInner({
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
}: SearchInnerProps) {
  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <div
      ref={searchContainerRef}
      className="relative w-full max-w-[600px]"
      dir="rtl"
    >
      {/* Search input wrapper */}
      <div
        className={[
          "relative flex h-[48px] items-center rounded-xl border bg-white",
          "transition-[border-color,box-shadow] duration-150",
          isSearchOpen
            ? "border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
            : "border-slate-300 hover:border-slate-400",
        ].join(" ")}
      >
        {/* Search icon / Loader */}
        <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2">
          {isSearching ? (
            <Loader2
              size={19}
              strokeWidth={2}
              className="animate-spin text-emerald-600"
            />
          ) : (
            <Search
              size={20}
              strokeWidth={2}
              className={
                isSearchOpen
                  ? "text-emerald-600"
                  : "text-slate-400"
              }
            />
          )}
        </div>

        {/* Input */}
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="جستجو..."
          autoComplete="off"
          spellCheck={false}
          aria-label="جستجو"
          aria-expanded={isSearchOpen}
          aria-haspopup="listbox"
          className="h-full w-full rounded-xl shadow-lg bg-transparent pr-12 pl-20 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
        />

        {/* Clear button */}
        {hasQuery && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="پاک کردن جستجو"
            className="absolute left-3 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Search dropdown */}
      {isSearchOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] md:hidden"
            onClick={closeSearch}
            aria-hidden="true"
          />

          <div
            className="
              absolute
              right-0
              top-[calc(100%+8px)]
              z-50
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-[0_16px_45px_rgba(15,23,42,0.14)]
            "
            role="listbox"
          >
            {/* Empty query */}
            {!hasQuery ? (
              <div className="p-4">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <Sparkles
                        size={16}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-slate-800">
                        جستجوهای پیشنهادی
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        دسته‌بندی‌های پرطرفدار
                      </p>
                    </div>
                  </div>

                  <LayoutGrid
                    size={17}
                    className="text-slate-300"
                  />
                </div>

                {/* Popular categories */}
                {popularCategories.length > 0 ? (
                  <div className="flex max-h-[230px] flex-wrap gap-2 overflow-y-auto pt-1">
                    {popularCategories.map(
                      (category: any, index: number) => {
                        const slug = category?.catSlug || "";
                        const name =
                          category?.catName || "بدون نام";

                        return (
                          <Link
                            key={category?.id || `${slug}-${index}`}
                            href={`/category/${slug}`}
                            onClick={closeSearch}
                            className="
                              inline-flex
                              items-center
                              rounded-lg
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2
                              text-[12px]
                              font-medium
                              text-slate-600
                              transition-colors
                              hover:border-emerald-200
                              hover:bg-emerald-50
                              hover:text-emerald-700
                            "
                          >
                            {name}
                          </Link>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-5 text-center">
                    <p className="text-xs text-slate-400">
                      هنوز دسته‌ای برای نمایش وجود ندارد.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Results header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Search
                      size={16}
                      className="text-slate-400"
                    />

                    <span className="text-[12px] font-medium text-slate-500">
                      نتایج جستجو
                    </span>
                  </div>

                  {hasResults && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                      {searchResults.length} نتیجه
                    </span>
                  )}
                </div>

                {/* Loading */}
                {isSearching && (
                  <div className="space-y-1 p-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl p-3"
                      >
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-100" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                          <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search results */}
                {!isSearching && hasResults && (
                  <>
                    <div className="max-h-[350px] overflow-y-auto p-2">
                      {searchResults.map((item, index) => {
                        const isProduct =
                          item.type === "product";

                        const href = isProduct
                          ? `/resources/course/${item.slug}`
                          : `/news/${item.slug}`;

                        return (
                          <Link
                            key={`${item.type}-${item.slug}-${index}`}
                            href={href}
                            onClick={closeSearch}
                            className="
                              group
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              p-3
                              text-right
                              transition-colors
                              hover:bg-slate-50
                            "
                            role="option"
                          >
                            {/* Result icon */}
                            <div
                              className={[
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                isProduct
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-sky-50 text-sky-600",
                              ].join(" ")}
                            >
                              <Search
                                size={15}
                                strokeWidth={2}
                              />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-slate-700 transition-colors group-hover:text-emerald-700">
                                {item.title}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {isProduct
                                  ? "محصول"
                                  : "خبر"}
                              </p>
                            </div>

                            {/* Arrow */}
                            <ArrowLeft
                              size={15}
                              className="shrink-0 text-slate-300 transition-transform group-hover:-translate-x-1 group-hover:text-emerald-500"
                            />
                          </Link>
                        );
                      })}
                    </div>

                    {/* View all */}
                    <div className="border-t border-slate-100 p-2">
                      <Link
                        href={`/search?q=${encodeURIComponent(
                          searchQuery.trim()
                        )}`}
                        onClick={closeSearch}
                        className="
                          flex
                          h-11
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-slate-50
                          text-[12px]
                          font-semibold
                          text-emerald-700
                          transition-colors
                          hover:bg-emerald-50
                        "
                      >
                        <Search size={15} />

                        <span>
                          مشاهده همه نتایج برای
                        </span>

                        <span className="max-w-[150px] truncate font-bold">
                          «{searchQuery.trim()}»
                        </span>
                      </Link>
                    </div>
                  </>
                )}

                {/* Empty state */}
                {!isSearching && !hasResults && (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                      <Search
                        size={21}
                        className="text-slate-300"
                      />
                    </div>

                    <p className="text-[13px] font-semibold text-slate-700">
                      نتیجه‌ای پیدا نشد
                    </p>

                    <p className="mx-auto mt-1 max-w-[300px] text-[11px] leading-5 text-slate-400">
                      عبارت جستجو را بررسی کنید یا از کلمات
                      کوتاه‌تر و عمومی‌تر استفاده کنید.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchBoxInPage(props: SearchBoxProps) {
  return (
    <Suspense
      fallback={
        <div className="h-12 w-full max-w-[600px] animate-pulse rounded-xl bg-slate-100" />
      }
    >
      <SearchBoxContent {...props} />
    </Suspense>
  );
}