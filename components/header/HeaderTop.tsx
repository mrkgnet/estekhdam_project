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
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const iconButtonClass =
    "flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200";
  const outlineButtonClass =
    "flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-slate-600 transition-all duration-200 hover:border-slate-400 hover:bg-green-50 hover:text-green-700";
  const amberButtonClass =
    "hidden h-11 sm:flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-red-700 transition-colors duration-200 hover:bg-red-100 hover:text-red-800";

  return (
    <>
      <header className="relative z-80 w-full border-b border-gray-200 bg-white font-sans transition-all duration-300">
        <div className="mx-auto flex h-[72px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="relative inline-flex shrink-0 items-center">
            <Link href="/" aria-label="خانه" className="flex items-center">
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

          <SearchBox
            popularCategories={popularCategories}
            isMobileSearchOpen={isMobileSearchOpen}
            onCloseMobile={() => setIsMobileSearchOpen(false)}
          />

          <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className={`md:hidden ${iconButtonClass}`}
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? (
                <X size={20} />
              ) : (
                <Search size={20} strokeWidth={2.5} />
              )}
            </button>

            <NotificationBell />

            <Link href="/plans" className={amberButtonClass}>
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">خرید اشتراک</span>
            </Link>

            <div className="relative z-10" ref={wrapperRef}>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={outlineButtonClass}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <User size={18} />
                <span className="hidden text-sm font-medium sm:inline">
                  حساب کاربری
                </span>
              </button>

              <div
                className={[
                  "absolute left-0 top-[calc(100%+8px)] z-60 w-52 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl",
                  "origin-top-left transition-all duration-200",
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
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span>ورود / ثبت‌نام</span>
                    <LogIn size={18} className="text-slate-500" />
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <Link
                      href="/ddashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between bg-green-50 px-4 py-3.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
                      role="menuitem"
                    >
                      <span>ورود به پنل</span>
                      <User size={18} className="text-green-700" />
                    </Link>

                    <div className="h-px w-full bg-gray-100" />

                    <button
                      onClick={() => {
                        setOpen(false);
                        logOut();
                      }}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
