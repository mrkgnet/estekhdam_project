"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, User, LogIn, X, LogOut, Star } from "lucide-react";
import AuthModal from "../modals/AuthModal";
import { useQuery } from "@tanstack/react-query";
import { getDataCategory } from "@/actions/category/Actions";
import NotificationBell from "../notification/notificationBell/NotificationBell";
import Image from "next/image";
import SearchBox from "../user/search/SearchBox";

interface NavbarProps {
  response?: any[];
  initialCategories?: any[];
}

function HeaderContent({ initialCategories }: NavbarProps) {
  const { isLoggedIn, isLoading, logOut } = useAuth();

  const { data: categoryResponse } = useQuery({
    queryKey: ["categories-navbar"],
    queryFn: () => getDataCategory(),
    initialData: initialCategories,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const popularCategories = categoryResponse?.data?.slice(0, 5) || [];

  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  /*
   * کلاس پایه و مشترک تمام آیتم‌ها برای تضمین اندازه و تراز یکنواخت
   */
  const actionItemBaseClass = `
    flex h-11 shrink-0 items-center justify-center
    rounded-lg transition-colors duration-150
  `;

  /*
   * Dropdown Item
   */
  const dropdownItemClass = `
    flex w-full
    items-center justify-between
    border border-transparent
    border-b-0
    px-4 py-3.5
    text-sm font-medium
    transition-colors duration-50
    hover:border-black
  `;

  return (
    <>
      <header className="relative z-60 w-full border-b border-gray-200 bg-white font-sans transition-all duration-300">
        <div className="mx-auto flex h-[72px] items-center justify-between gap-4 px-4 md:px-6">
          {/* Logo */}
          <div className="relative inline-flex shrink-0 items-center">
            <Link
              href="/"
              aria-label="خانه"
              className="flex items-center rounded border border-transparent hover:border-black"
            >
              <Image
                src="/images/newLgog .svg"
                alt="لوگو سایت"
                width={100}
                height={40}
                className="h-auto w-[80px] transition-all duration-300 md:w-[100px]"
                priority
              />
            </Link>
          </div>

          {/* Search */}
          <SearchBox
            popularCategories={popularCategories}
            isMobileSearchOpen={isMobileSearchOpen}
            onCloseMobile={() => setIsMobileSearchOpen(false)}
          />

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 whitespace-nowrap">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className={`
                ${actionItemBaseClass}
                w-11 border border-slate-400 bg-white text-slate-700
                hover:border-black hover:bg-gray-50 md:hidden
              `}
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? (
                <X size={20} />
              ) : (
                <Search size={20} strokeWidth={2.2} />
              )}
            </button>

            {/* Notification */}
            <div
              className={`
                ${actionItemBaseClass}
                w-11 border border-slate-400 bg-white text-slate-700
                hover:border-black hover:bg-gray-50
                [&>button]:flex [&>button]:h-full [&>button]:w-full [&>button]:items-center [&>button]:justify-center
              `}
            >
              <NotificationBell />
            </div>

            {/* Subscription */}
            <Link
              href="/plans"
              className={`
                ${actionItemBaseClass}
                w-11 px-0 sm:w-auto sm:min-w-[145px] sm:px-4
                gap-2 border border-red-200 bg-red-50 text-red-700
                hover:border-black hover:bg-red-100 hover:text-red-800
              `}
              title="اشتراک (رایگان)"
            >
              <Star className="h-4 w-4 fill-current shrink-0" />
              <span className="hidden text-sm font-medium sm:inline">
                اشتراک (رایگان)
              </span>
            </Link>

            {/* User Menu */}
            <div className="relative z-10 shrink-0" ref={wrapperRef}>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`
                  ${actionItemBaseClass}
                  w-11 px-0 sm:w-auto sm:min-w-[145px] sm:px-4
                  gap-2 border border-slate-400 bg-white text-slate-600
                  hover:border-black hover:bg-green-50 hover:text-green-700
                `}
                aria-haspopup="menu"
                aria-expanded={open}
                title="حساب کاربری"
              >
                <User size={20} className="shrink-0" />
                <span className="hidden text-slate-950 text-sm font-medium sm:inline">
                  حساب کاربری
                </span>
              </button>

              {/* Dropdown */}
              <div
                className={[
                  "absolute left-0 top-[calc(100%+8px)] z-60 w-52 overflow-hidden rounded-lg border border-slate-400 bg-white shadow-xl",
                  "origin-top-left transition-all duration-150",
                  open
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0",
                ].join(" ")}
                role="menu"
              >
                {isLoading ? (
                  <div className="flex justify-center py-4 text-sm text-gray-400">
                    در حال بررسی...
                  </div>
                ) : !isLoggedIn ? (
                  /* ورود / ثبت‌نام */
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className={`
                      ${dropdownItemClass}
                      text-slate-700
                      hover:bg-slate-50
                    `}
                    role="menuitem"
                  >
                    <span>ورود / ثبت‌نام</span>
                    <LogIn size={18} className="text-slate-500" />
                  </button>
                ) : (
                  <div className="flex flex-col z-60">
                    {/* Dashboard */}
                    <Link
                      href="/ddashboard"
                      onClick={() => setOpen(false)}
                      className={`
                        ${dropdownItemClass}
                        bg-green-50
                        text-green-700
                        hover:bg-green-100
                      `}
                      role="menuitem"
                    >
                      <span>ورود به پنل</span>
                      <User size={18} className="text-green-700" />
                    </Link>

                    <div className="h-px w-full bg-gray-100" />

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        logOut();
                      }}
                      className={`
                        ${dropdownItemClass}
                        text-red-600
                        hover:bg-red-50
                      `}
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

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}

export default function HeaderTop(props: NavbarProps) {
  return (
    <Suspense
      fallback={
        <div className="h-[72px] w-full border-b border-gray-200 bg-white" />
      }
    >
      <HeaderContent {...props} />
    </Suspense>
  );
}