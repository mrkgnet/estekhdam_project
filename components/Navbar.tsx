// components/Navbar.tsx
"use client";

import { useUiStore } from "@/store/useUiStore";
import {
  Menu,
  Search,
  User,
  MessageSquareText,
  LogIn,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export default function Navbar() {
  const cartCount = 1;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="w-full border-b bg-white text-[14px]">
      <div className="mx-auto px-2 pl-6 h-[62px] flex items-center justify-between gap-4">
        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-xl hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="font-extrabold tracking-tight">
            برند استخدامی
          </Link>
        </div>

        {/* Center Search */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="relative w-full max-w-[450px]">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="جستجو (نام آزمون، شرکت، درس و...)"
              className="w-full h-11 rounded border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm outline-none focus:bg-white focus:border-gray-300 transition"
            />
          </div>
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-6 whitespace-nowrap">
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl 
                 bg-gradient-to-br from-emerald-500 to-green-600 
                 text-white shadow-md 
                 hover:shadow-lg hover:scale-105 
                 transition-all duration-200"
            aria-label="Cart"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 
                     flex items-center justify-center 
                     rounded-full bg-red-500 text-[11px] font-bold 
                     shadow-md"
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account dropdown */}
          <div className="relative" ref={wrapperRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer font-bold text-green-600 hover:text-green-700 transition"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <User size={18} />
              حساب کاربری
            </button>

            <div
              className={[
                "absolute left-0 z-10 top-[calc(100%+10px)] w-56 rounded-xl bg-white shadow-lg border border-slate-100 overflow-hidden",
                "transition-all duration-200 origin-top",
                open
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
              ].join(" ")}
              role="menu"
            >
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                role="menuitem"
              >
                <span>ورود/ثبت‌نام</span>
                <LogIn size={18} className="text-slate-500" />
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                role="menuitem"
              >
                <span>مشاهده حساب کاربری</span>
                <User size={18} className="text-slate-500" />
              </Link>

              <Link
                href="/feedback"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 transition"
                role="menuitem"
              >
                <span>بازخوردها</span>
                <MessageSquareText size={18} className="text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}