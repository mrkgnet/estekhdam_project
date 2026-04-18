'use client'

import { Search, X } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "جستجو...", 
  className = "" 
}: SearchBarProps) {
  return (
    <div className={`relative w-full group ${className}`}>
      {/* آیکون جستجو (سمت راست) */}
      {/* تغییر pr-3 به pr-4 برای فاصله بهتر آیکون از لبه */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // تغییرات مهم: 
        // 1. pr-12: افزایش فاصله از سمت راست تا متن به آیکون نچسبد
        // 2. pl-12: افزایش فاصله از سمت چپ برای دکمه ضربدر
        // 3. py-3: افزایش ارتفاع برای لمس راحت‌تر
        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 text-gray-900 text-xs sm:text-sm  rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 block pr-12 pl-12 py-3 transition-all duration-300 shadow-sm placeholder:text-gray-400 outline-none"
        placeholder={placeholder}
      />

      {/* دکمه ضربدر (سمت چپ) */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')} 
          className="absolute inset-y-0 left-2 my-auto  w-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-all duration-200"
          title="پاک کردن"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
