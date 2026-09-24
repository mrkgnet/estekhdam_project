"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  X,
  ChevronLeft,
  Search,
} from "lucide-react";
import { tabsDataAdminPanel } from "@/lib/constats";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebarStore();

  const [search, setSearch] = useState("");
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // بستن منو و پاکسازی استیت‌ها
  const handleClose = () => {
    close();
    setActiveTabId(null);
    setActiveSubTabId(null);
    setSearch("");
  };

  // خروج از حساب کاربری
  const handleLogOut = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/auth/login");
    router.refresh();
  };

  // ریست منو با تغییر مسیر صفحه
  useEffect(() => {
    close();
    setActiveTabId(null);
    setActiveSubTabId(null);
    setSearch("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }
  }, [pathname, close]);

  // تشخیص اسکرول صفحه
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // کنترل اسکرول صفحه و انتخاب پیش‌فرض اولین آیتم در موبایل
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768
      ) {
        if (!activeTabId && tabsDataAdminPanel.length > 0) {
          const firstTab = tabsDataAdminPanel[0];
          setActiveTabId(firstTab?.id || null);
          setActiveSubTabId(firstTab?.subItems?.[0]?.id || null);
        }
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, activeTabId]);

  // ریست کردن فیلتر سرچ در هنگام جابجایی بین تب‌های سطح اول
  useEffect(() => {
    setSearch("");
  }, [activeTabId]);

  // مدیریت تعاملات ماوس و تاچ
  const handleInteraction = (
    tabId: string | null,
    level: number,
    isClick: boolean = false
  ) => {
    if (
      !isClick &&
      typeof window !== "undefined" &&
      window.innerWidth < 768
    ) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (level === 1 && tabId) {
      if (
        activeTabId &&
        activeTabId !== tabId &&
        !isClick
      ) {
        if (switchTimeoutRef.current) {
          clearTimeout(switchTimeoutRef.current);
        }

        switchTimeoutRef.current = setTimeout(() => {
          setActiveTabId(tabId);
          setActiveSubTabId(null);
        }, 300);
      } else {
        setActiveTabId(tabId);

        if (
          typeof window !== "undefined" &&
          window.innerWidth < 768
        ) {
          const clickedTab = tabsDataAdminPanel.find((t) => t.id === tabId);
          setActiveSubTabId(clickedTab?.subItems?.[0]?.id || null);
        } else {
          setActiveSubTabId(null);
        }
      }
    } else if (level === 2 && tabId) {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
      setActiveSubTabId(tabId);
    } else if (level === 0 && !isClick) {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
    }
  };

  const handleMouseLeaveDesktop = () => {
    if (window.innerWidth < 768) return;

    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActiveTabId(null);
      setActiveSubTabId(null);
    }, 50);
  };

  const activeTab = tabsDataAdminPanel.find((t) => t.id === activeTabId);
  const hasLevel2 = activeTab?.subItems && activeTab.subItems.length > 0;
  const activeSubTab = activeTab?.subItems?.find(
    (s: any) => s.id === activeSubTabId
  );
  const hasLevel3 = activeSubTab?.subItems && activeSubTab.subItems.length > 0;

  // فیلتر کردن منوهای سطح دوم بر اساس عبارت جستجو
  const filteredLevel2Items =
    activeTab?.subItems?.filter((sub: any) =>
      sub.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <>
      {/* بک‌دراپ تیره */}
      {isOpen && (
        <div
          onClick={handleClose}
          className={`fixed inset-x-0 mt-1.5 bottom-0 z-40 bg-gray-900/40 backdrop-blur-sm
            ${isScrolled ? "top-0 md:top-12" : "top-31 md:top-15"}
          `}
          aria-hidden="true"
        />
      )}

      {/* سایدبار اصلی */}
      <aside
        onMouseLeave={handleMouseLeaveDesktop}
        onMouseEnter={() => handleInteraction(null, 0)}
        className={`fixed right-0 z-70 w-full md:w-[280px] bg-white mt-1 flex flex-col shadow-xl border-l border-gray-100
          ${
            isScrolled
              ? "top-0 h-full md:top-13 h-[calc(100vh-3.5rem)]"
              : "top-31 md:top-16 h-full"
          }
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* هدر در حالت موبایل */}
        <div className="flex items-center justify-between px-3 py-2 border border-gray-300 bg-white md:hidden">
          <span className="font-bold text-gray-800">پنل مدیریت</span>

          <button
            type="button"
            onClick={handleClose}
            aria-label="بستن سایدبار"
            className="flex items-center border border-red-600 gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>بستن منو</span>
          </button>
        </div>

        {/* هدر در حالت دسکتاپ */}
        <div className="hidden md:flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
          <Link
            href="/adminp"
            onClick={handleClose}
            className="flex items-center gap-2 font-bold text-sm text-gray-800 hover:text-blue-600 transition-colors"
          >
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>پنل مدیریت</span>
          </Link>

          <button
            type="button"
            onClick={handleClose}
            aria-label="بستن سایدبار"
            className="flex items-center border border-red-600 gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>بستن منو</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* ستون سطح اول موبایل / منوی اصلی دسکتاپ */}
          <nav className="w-1/3 md:w-full flex-shrink-0 border-l border-gray-300 md:border-none p-2 md:p-4 space-y-1 overflow-y-auto bg-gray-50 md:bg-white z-20">
            {tabsDataAdminPanel.length === 0 ? (
              <p className="text-gray-400 text-center mt-5">منویی یافت نشد.</p>
            ) : (
              tabsDataAdminPanel.map((tab) => {
                const isActive =
                  pathname === tab.url || pathname.startsWith(`${tab.url}/`);

                const isSelected = activeTabId === tab.id;

                return (
                  <div
                    key={tab.id}
                    onMouseEnter={() => handleInteraction(tab.id, 1)}
                    onClick={() => handleInteraction(tab.id, 1, true)}
                    className="relative cursor-pointer font-bold"
                  >
                    <div
                      className={`relative flex flex-col md:flex-row items-center justify-center md:justify-between p-1.5 md:px-4 md:py-1.5 rounded-xl md:rounded-none md:border-b font-medium
                        ${
                          isActive || isSelected
                            ? "md:bg-blue-50 text-blue-700 border-2 md:border-1"
                            : "text-gray-600 hover:bg-blue-50/50"
                        }
                      `}
                    >
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative z-10">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive || isSelected
                              ? "text-blue-600 md:bg-blue-600 md:text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {tab.icon && (
                            <tab.icon className="h-6 w-6 md:h-5 md:w-5" />
                          )}
                        </div>

                        <span className="text-center">{tab.title}</span>
                      </div>

                      {tab.subItems && tab.subItems.length > 0 && (
                        <ChevronLeft
                          className={`hidden md:block h-4 w-4 ${
                            isSelected ? "text-blue-500" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </nav>

          {/* ستون سطح دو و سه در حالت موبایل */}
          <div className="w-2/3 md:hidden flex flex-col h-full bg-white overflow-hidden">
            {hasLevel2 && activeTab && (
              <>
                {/* هدر و سرچ سطح دوم موبایل */}
                <div className="p-3 pb-2 border-b border-gray-100 flex-shrink-0 bg-white">
                  <Link
                    href={activeTab.url}
                    onClick={handleClose}
                    className="text-blue-600 mb-3 flex items-center gap-1 font-bold text-sm"
                  >
                    {activeTab.title}
                    <ChevronLeft className="w-4 h-4" />
                  </Link>

                  <div className="relative">
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="جستجو در این بخش..."
                      className="w-full h-9 rounded-xl border border-gray-200 bg-white px-10 text-11 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* لیست سطح دو موبایل همراه با اسکرول‌بار سفارشی */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f8fafc] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
                  {filteredLevel2Items.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-5">
                      موردی یافت نشد.
                    </p>
                  ) : (
                    filteredLevel2Items.map((sub: any) => {
                      const isSubOpen = activeSubTabId === sub.id;
                      const hasLvl3 = sub.subItems && sub.subItems.length > 0;

                      return (
                        <div
                          key={sub.id}
                          className="bg-gray-50 rounded-xl p-3"
                        >
                          <div className="flex justify-between items-center">
                            <Link
                              href={sub.url}
                              onClick={handleClose}
                              className="text-gray-800 flex-1 text-sm font-medium"
                            >
                              {sub.title}
                            </Link>

                            {hasLvl3 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveSubTabId(
                                    isSubOpen ? null : sub.id
                                  )
                                }
                                className="p-1 hover:bg-gray-200 rounded-md"
                              >
                                <ChevronLeft
                                  className={`w-4 h-4 text-gray-500 transition-transform ${
                                    isSubOpen ? "-rotate-90" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* سطح سه داخل آکاردئون */}
                          {isSubOpen && hasLvl3 && (
                            <div className="space-y-2 mt-3 border-t border-gray-200 pt-3 max-h-48 overflow-y-auto pl-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                              {sub.subItems.map((lvl3: any) => (
                                <Link
                                  key={lvl3.id}
                                  href={lvl3.url}
                                  onClick={handleClose}
                                  className="block text-gray-500 hover:text-blue-600 pr-2 border-r-2 border-blue-100 py-0.5 text-xs"
                                >
                                  {lvl3.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* دکمه خروج از سیستم در انتهای ستون اصلی */}
        <div className="w-full p-3 border-t border-gray-100 z-20 bg-white mt-auto">
          <button
            type="button"
            onClick={handleLogOut}
            className="flex w-full items-center justify-between px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold">خروج از سیستم</span>
            </div>
          </button>
        </div>

        {/* بخش دسکتاپ (پاپ‌آپ‌های سطح دو و سطح سه) */}
        <div className="hidden md:block">
          {/* سطح دو دسکتاپ */}
          {hasLevel2 && activeTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[280px] w-[290px] bg-white shadow-2xl z-[15] flex flex-col border-r border-gray-100 mt-0
                ${
                  isScrolled
                    ? "top-0 h-[calc(100vh-3.5rem)]"
                    : "top-0 h-full"
                }
              `}
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 flex items-center gap-2">
                    {activeTab.icon && (
                      <activeTab.icon className="w-5 h-5 text-blue-600" />
                    )}
                    {activeTab.title}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در این بخش..."
                    className="w-full h-10 rounded-xl border border-gray-200 bg-white px-10 text-11 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {filteredLevel2Items.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center mt-5">
                    موردی یافت نشد.
                  </p>
                ) : (
                  filteredLevel2Items.map((sub: any) => {
                    const isSubActive = pathname === sub.url;
                    const isSubHovered = activeSubTabId === sub.id;

                    return (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        onClick={handleClose}
                        onMouseEnter={() => handleInteraction(sub.id, 2)}
                        className={`px-4 py-3 rounded-xl flex items-center justify-between
                          ${
                            isSubActive
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "text-gray-600 hover:bg-blue-50/50"
                          }
                          ${
                            isSubHovered && !isSubActive
                              ? "bg-blue-50/50 text-blue-700"
                              : ""
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive || isSubHovered
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />
                          {sub.title}
                        </div>

                        {sub.subItems && sub.subItems.length > 0 && (
                          <ChevronLeft className="h-3.5 w-3.5" />
                        )}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* سطح سه دسکتاپ */}
          {hasLevel3 && activeSubTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[570px] w-[260px] bg-white shadow-2xl z-[10] border-r border-gray-100 flex flex-col mt-1
                ${
                  isScrolled
                    ? "top-14 h-[calc(100vh-3.5rem)]"
                    : "top-45 h-[calc(100vh-8rem)]"
                }
              `}
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-800">
                {activeSubTab.title}
              </div>

              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {activeSubTab.subItems.map((lvl3: any) => (
                  <Link
                    key={lvl3.id}
                    href={lvl3.url}
                    onClick={handleClose}
                    className="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                  >
                    {lvl3.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}