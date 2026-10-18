
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  Search,
  X,
} from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  className?: string;

  isLoading?: boolean;
  debounceMs?: number;

  // فعال‌سازی جست‌وجوی دستی
  manual?: boolean;

  // جست‌وجو با دکمه یا Enter
  onSearch?: (value: string) => void;

  // پاک‌کردن فوری جست‌وجوی اعمال‌شده
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "جستجو...",
  className = "",
  isLoading,
  debounceMs = 350,
  manual = false,
  onSearch,
  onClear,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  // ==========================================
  // Sync external value
  // ==========================================

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // ==========================================
  // Debounce for live search only
  // ==========================================

  useEffect(() => {
    if (manual) {
      setIsTyping(false);
      return;
    }

    if (localValue === value) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    const timer = setTimeout(() => {
      onChange(localValue);
      setIsTyping(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    localValue,
    value,
    onChange,
    debounceMs,
    manual,
  ]);

  // ==========================================
  // Loading
  // ==========================================

  const showLoading = useMemo(() => {
    return manual
      ? Boolean(isLoading)
      : Boolean(isLoading ?? isTyping);
  }, [manual, isLoading, isTyping]);

  // ==========================================
  // Handle input changes
  // ==========================================

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    setLocalValue(newValue);

    if (manual) {
      onChange(newValue);
    }
  };

  // ==========================================
  // Search on button click or Enter
  // ==========================================

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (showLoading) return;

    if (manual) {
      onSearch?.(localValue.trim());
    } else {
      onChange(localValue);
    }
  };

  // ==========================================
  // Clear input and applied filter immediately
  // ==========================================

  const handleClear = () => {
    if (showLoading) return;

    setLocalValue("");
    setIsTyping(false);

    onChange("");

    if (manual) {
      if (onClear) {
        onClear();
      } else {
        onSearch?.("");
      }
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
      dir="rtl"
      role="search"
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        {/* ================================== */}
        {/* Search Input */}
        {/* ================================== */}

        <div className="relative min-w-0 flex-1">
          {/* Search Icon */}

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Search className="h-4 w-4 text-slate-500" />
          </span>

          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={showLoading}
            aria-label="عبارت جست‌وجو"
            className="
              h-10 w-full rounded
              border border-slate-300
              bg-white
              px-5 pr-10 pl-10
              text-xs md:text-sm
              text-slate-800
              placeholder:text-slate-400
              shadow-sm outline-none
              transition-all duration-200
              hover:border-slate-400
              focus:border-blue-600
              focus:ring-2 focus:ring-blue-600/10
              disabled:cursor-wait
              disabled:opacity-70
            "
          />

          {/* ================================== */}
          {/* Clear / Loading */}
          {/* ================================== */}

          <div className="absolute inset-y-0 left-2 flex items-center justify-center">
            {showLoading && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <Loader2
                  className="h-4 w-4 animate-spin text-blue-700"
                  strokeWidth={2.5}
                />
              </span>
            )}

            {!showLoading && localValue && (
              <button
                type="button"
                onClick={handleClear}
                className="
                  flex h-7 w-7 items-center
                  justify-center rounded-full
                  text-slate-400
                  transition-colors duration-200
                  hover:bg-blue-50
                  hover:text-blue-700
                "
                title="پاک کردن جست‌وجو و نمایش همه محصولات"
                aria-label="پاک کردن جست‌وجو"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ================================== */}
        {/* Manual Search Button */}
        {/* ================================== */}

        {manual && (
          <button
            type="submit"
            disabled={showLoading}
            className="
              inline-flex h-10 shrink-0
              items-center justify-center
              gap-2 rounded
              bg-blue-600 px-5
              text-xs md:text-sm
              font-medium text-white
              shadow-sm
              transition-all duration-200
              hover:bg-blue-700
              hover:shadow-md
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {showLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال جست‌وجو...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                جست‌وجو
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
