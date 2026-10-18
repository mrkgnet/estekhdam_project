'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /**
   * اگر از بیرون وضعیت لودینگ واقعی (مثلاً React Query) داری، بده اینجا
   * در غیر این صورت کامپوننت خودش هنگام تایپ لودر داخلی نشان می‌دهد.
   */
  isLoading?: boolean;
  /**
   * مدت debounce برای ارسال onChange
   */
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'جستجو...',
  className = '',
  isLoading,
  debounceMs = 350,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  // همگام‌سازی وقتی value از بیرون تغییر می‌کند
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // debounce برای جلوگیری از پرش/رندرهای پشت‌سرهم
  useEffect(() => {
    // اگر مقدار محلی با prop یکسان شد، تایپ تمام است
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
  }, [localValue, debounceMs, onChange, value]);

  const showLoading = useMemo(() => {
    // اولویت با لودینگ بیرونی، وگرنه تایپ داخلی
    return Boolean(isLoading ?? isTyping);
  }, [isLoading, isTyping]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setIsTyping(false);
  };

  return (
    <div className={`relative w-full ${className}`} dir="rtl">
      {/* آیکون سمت راست (ثابت) */}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <Search className="h-4 w-4 text-gray-500" />
      </span>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded border border-gray-400 bg-gray-50
          py-3 pr-10 pl-24
          text-xs text-gray-900 placeholder:text-gray-400
          shadow-sm outline-none transition-all duration-200
          hover:bg-gray-100/60
          focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10
          sm:text-sm
        "
      />

      {/* ناحیه چپ با عرض ثابت => بدون پرش */}
      <div className="absolute inset-y-0 left-2 flex w-20 items-center justify-end gap-1">
        {/* لودر بزرگ‌تر و پررنگ‌تر */}
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
            showLoading
              ? 'opacity-100 bg-green-100 ring-2 ring-green-200 shadow-sm animate-pulse'
              : 'opacity-0'
          }`}
        >
          <Loader2 className="h-5 w-5 animate-spin text-green-700" strokeWidth={2.75} />
        </span>

        {/* دکمه پاک کردن */}
        <button
          type="button"
          onClick={handleClear}
          disabled={!localValue}
          className={`
            flex h-8 w-8 items-center justify-center rounded-full
            transition-all duration-200
            ${
              localValue
                ? 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                : 'pointer-events-none text-transparent'
            }
          `}
          title="پاک کردن"
          aria-label="پاک کردن جستجو"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
