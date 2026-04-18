// components/Navbar.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useUiStore } from "@/store/useUiStore";
import {
  Menu,
  Search,
  User,
  LogIn,
  ShoppingCart,
  Contact,
  LayoutGrid,
  Loader2,
  X,
  Backpack,
  LogOut, // آیکون ضربدر برای بستن سرچ در موبایل
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import AuthModal from "../modals/AuthModal";
import { getDataSearchMany } from "@/actions/search/Actions";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";

interface NavbarProps {
  response?: any[];
}

export default function HeaderTop({ response = [] }: NavbarProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading, logOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);






  // استیت‌های مربوط به جستجو
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // 🟢 استیت جدید برای سرچ موبایل
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const cartCount = 1;

  // 🟢 تابع کمکی برای بستن کامل جستجو (هم منوی نتایج، هم باکس موبایل)
  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

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



  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        closeSearch(); // 🟢 استفاده از تابع جدید
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      closeSearch(); // 🟢 استفاده از تابع جدید
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="relative z-50 w-full border-b bg-white text-xs md:text-sm transition-all duration-300">
        <div className="mx-auto px-2 pl-6 h-[72px] flex items-center justify-between gap-4">

          {/* Right Section */}
          {/* دکمه همبرگری متصل به Zustand */}
          <div className="flex items-center">
            <Link
             href={'/'}
              className="p-2 text-gray-600 flex items-center gap-2 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="باز کردن منو"
            >
             
              <span className="font-medium text-sm">عکس برند</span>
            </Link>
          </div>


          {/* Center Search - 🟢 استایل‌ها برای نمایش در موبایل آپدیت شد */}
          <div
            ref={searchContainerRef}
            className={`z-50 md:flex-1 md:flex md:justify-center md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none ${isMobileSearchOpen
              ? "absolute top-full left-0 w-full bg-white px-4 pb-4 pt-2 shadow-md flex border-b border-gray-100 animate-in slide-in-from-top-2"
              : "hidden"
              }`}
          >
            <div className="relative w-full max-w-[650px]">
              {isSearching ? (
                <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin" />
              ) : (
                <Search size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchOpen ? "text-green-600" : "text-gray-400"}`} />
              )}

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="منبع آموزش، آزمون، دسته مورد نظرتان را جستجو کنید"
                className={`w-full h-13 rounded border bg-gray-100 pr-11 pl-4 text-sm outline-none transition-all duration-200 ${isSearchOpen ? "bg-white border-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]" : "border-gray-200 focus:bg-white hover:border-gray-300"}`}
              />

              {/* Search Dropdown Overlay */}
              <div
                className={`absolute top-[calc(100%+8px)] w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top ${isSearchOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
              >
                {searchQuery.trim() === "" ? (
                  <div className="p-5">
                    {/* 🟢 ارور Hydration: ویژگی disabled=true از اینجا حذف شد */}
                    <button type="button" className="w-full cursor-none flex items-center justify-between pb-4 text-gray-500 transition-colors" onClick={closeSearch}>
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={18} className="text-gray-400" />
                        <span className="text-sm font-medium">جستجو برای ...</span>
                      </div>
                    </button>
                    <div className="h-[1px] w-full bg-gray-200 mb-4 rounded-full"></div>
                    <div className="mb-3 text-gray-800 font-bold text-sm">جستجوهای محبوب</div>
                    <div className="flex flex-wrap gap-2.5">
                      {response.map((cat: any, index: number) => (
                        <Link
                          key={cat?.id || index}
                          href={`/category/${cat?.catSlug || ''}`}
                          onClick={closeSearch}
                          className="rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 bg-white hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                        >
                          {cat?.catName || "بدون نام"}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.length > 0 ? (
                      <div className="mb-2">
                        {searchResults.map((item) => {
                          const linkHref = item.type === "product"
                            ? `/resources/course/${item.slug}`
                            : `/news/${item.slug}`;

                          return (
                            <Link
                              key={`${item.type}-${item.slug}`}
                              href={linkHref}
                              onClick={closeSearch}
                              className="flex items-center justify-between p-3 text-black hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {item.title}
                              </div>
                              <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                {item.type === "product" ? "محصول" : "خبر"}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="p-4 text-center text-sm text-gray-500">
                          موردی یافت نشد.
                        </div>
                      )
                    )}

                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={closeSearch}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 text-green-700 transition-colors text-right bg-green-50/50 mt-1"
                    >
                      <Search size={18} />
                      <span className="text-sm">
                        مشاهده همه نتایج برای <strong className="mx-1">"{searchQuery}"</strong>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap">

            {/* 🟢 آیکون سرچ مخصوص موبایل */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                if (isMobileSearchOpen) setIsSearchOpen(false); // بستن دراپ داون در صورت بستن سرچ
              }}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={2.5} />}
            </button>

        

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-green-300 text-[11px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative z-10" ref={wrapperRef}>
              {/* کدهای منوی کاربری بدون تغییر */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full z-10 border border-gray-200 px-4 py-2 cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <User size={18} />
                <span className="hidden sm:inline">حساب کاربری</span>
              </button>

              <div
                className={[
                  "absolute left-0 top-[calc(100%+10px)] z-50 w-56 rounded-xl bg-white shadow-lg border border-slate-100 overflow-hidden",
                  "transition-all duration-200 origin-top",
                  open
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                ].join(" ")}
                role="menu"
              >
                {isLoading ? (
                  <div className="flex justify-center py-3 text-gray-400 text-sm">
                    در حال بررسی...
                  </div>
                ) : !isLoggedIn ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                    role="menuitem"
                  >
                    <span>ورود/ثبت‌نام</span>
                    <LogIn size={18} className="text-slate-500" />
                  </button>
                ) : (
                  <div>
                    <Link
                      href="/ddashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-green-600 text-xs bg-green-50 hover:bg-green-100 transition border-b border-red-100"
                      role="menuitem"
                    >
                      <span>ورود به پنل کاربری</span>
                      <User size={18} className="text-green-600" />
                    </Link>
                    <hr />
                    {/* 🟢 دکمه خروج اصلاح شد */}
                    <button
                      onClick={() => {
                        setOpen(false); // بستن منو
                        logOut();       // اجرای تابع خروج
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-red-600 text-xs bg-red-50 hover:bg-red-100 transition"
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

      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
}
