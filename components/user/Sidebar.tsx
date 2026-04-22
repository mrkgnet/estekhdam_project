"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, X, ChevronLeft } from "lucide-react";
import { tabsDataUserPanel } from "@/lib/constats";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";

export default function Sidebar() {
  const pathname = usePathname();

  const { isOpen, close } = useSidebarStore();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null);

  // استیت جدید برای تشخیص اسکرول شدن صفحه
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    close();

    setActiveTabId(null);
    setActiveSubTabId(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
  }, [pathname, close]);


  // =========================================================
  // تشخیص اسکرول برای تنظیم فاصله سایدبار از بالا
  // =========================================================
  useEffect(() => {
    const handleScroll = () => {
      // اگر بیشتر از 40 پیکسل اسکرول شد، یعنی هدر بالایی رفته است
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // بررسی اولیه

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // =========================================================
  // قفل کردن اسکرول و انتخاب پیش‌فرض منوها در موبایل
  // =========================================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // اگر در موبایل هستیم و تبی انتخاب نشده، تب اول و زیرمنوی آن را باز کن
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        if (!activeTabId) {
          const firstTab = tabsDataUserPanel[0];
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


  const handleInteraction = (tabId: string | null, level: number, isClick: boolean = false) => {
    // جلوگیری از اجرای هاور در حالت موبایل
    if (!isClick && typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (level === 1 && tabId) {
      if (activeTabId && activeTabId !== tabId && !isClick) {
        if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = setTimeout(() => {
          setActiveTabId(tabId);
          setActiveSubTabId(null);
        }, 300);
      } else {
        // برای کلیک مستقیما تب عوض می‌شود
        setActiveTabId(tabId);

        // باز شدن خودکار اولین زیرمنو بعد از کلیک در حالت موبایل
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          const clickedTab = tabsDataUserPanel.find(t => t.id === tabId);
          setActiveSubTabId(clickedTab?.subItems?.[0]?.id || null);
        } else {
          setActiveSubTabId(null);
        }
      }
    } else if (level === 2 && tabId) {
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
      setActiveSubTabId(tabId);
    } else if (level === 0 && !isClick) {
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    }
  };

  const handleMouseLeaveDesktop = () => {
    if (window.innerWidth < 768) return;

    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveTabId(null);
      setActiveSubTabId(null);
    }, 50);
  };

  const activeTab = tabsDataUserPanel.find((t) => t.id === activeTabId);
  const hasLevel2 = activeTab?.subItems && activeTab.subItems.length > 0;

  const activeSubTab = activeTab?.subItems?.find((s: any) => s.id === activeSubTabId);
  const hasLevel3 = activeSubTab?.subItems && activeSubTab.subItems.length > 0;

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className={`fixed inset-x-0 mt-1.5 bottom-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all duration-50
            ${isScrolled ? "top-14" : "top-32"}
          `}
          aria-hidden="true"
        />
      )}

      <aside
        onMouseLeave={handleMouseLeaveDesktop}
        onMouseEnter={() => handleInteraction(null, 0)}
        className={`fixed right-0 z-50 w-full md:w-[280px] bg-white mt-1 flex flex-col shadow-xl border-l border-slate-100
          transition-all duration-50
          ${isScrolled ? "top-14 h-[calc(100vh-3.5rem)]" : "top-32 h-[calc(100vh-8rem)]"}
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div className="p-5 border-b border-slate-200 flex justify-between items-center z-20 bg-white border-t">
          <Link href="/" onClick={close} className="flex items-center gap-3  text-slate-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-base tracking-tight">دسته بندی ها</span>
          </Link>
          <button onClick={close} className="p-2 text-slate-400 hover:text-red-500 md:hidden border rounded-xl shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">

          {/* ستون سمت راست (سطح 1) */}
          <nav className="w-1/3 md:w-full flex-shrink-0 border-l border-slate-100 md:border-none p-2 md:p-4 space-y-1 overflow-y-auto bg-slate-50 md:bg-white z-20">
            {tabsDataUserPanel.map((tab) => {
              const isActive = pathname === tab.url || pathname.startsWith(`${tab.url}/`);
              const isSelected = activeTabId === tab.id;

              return (
                <div
                  key={tab.id}
                  onMouseEnter={() => handleInteraction(tab.id, 1)}
                  onClick={() => handleInteraction(tab.id, 1, true)}
                  className="relative cursor-pointer"
                >
                  <div
                    className={`relative flex flex-col md:flex-row items-center justify-center md:justify-between p-3 md:px-4 md:py-3.5 rounded-xl md:rounded-none md:border-b text-xs md:text-sm font-medium
                              ${isActive ? "md:bg-blue-50 text-blue-700 " : "text-slate-600 hover:bg-blue-50/50"}
                            
                            `}
                  >

                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative z-10">
                      <div className={`p-1.5 rounded-lg ${isActive || isSelected ? "text-blue-600 md:bg-blue-600 md:text-white" : "text-slate-400"}`}>
                        <tab.icon className="h-6 w-6 md:h-5 md:w-5" />
                      </div>
                      <span className="text-center">{tab.title}</span>
                    </div>
                    {tab.subItems && tab.subItems.length > 0 && (
                      <ChevronLeft className={`hidden md:block h-4 w-4 ${isSelected ? "text-blue-500" : "text-slate-400"}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* ستون سمت چپ در حالت موبایل (سطح 2 و 3) */}
          <div className="w-2/3 md:hidden flex flex-col overflow-y-auto bg-white p-3">
            {hasLevel2 && activeTab && (
              <>
                <Link href={activeTab.url} onClick={close} className="text-sm  text-blue-600 mb-4 flex items-center gap-1">
                  {activeTab.title}
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="space-y-4">
                  {activeTab.subItems.map((sub: any) => {
                    const isSubOpen = activeSubTabId === sub.id;
                    const hasLvl3 = sub.subItems && sub.subItems.length > 0;

                    return (
                      <div key={sub.id} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <Link href={sub.url} onClick={close} className=" text-slate-800 text-sm flex-1">
                            {sub.title}
                          </Link>
                          {hasLvl3 && (
                            <button
                              onClick={() => setActiveSubTabId(isSubOpen ? null : sub.id)}
                              className="p-1 hover:bg-slate-200 rounded-md"
                            >
                              <ChevronLeft className={`w-4 h-4 text-slate-500 transition-transform duration-100 ${isSubOpen ? "-rotate-90" : ""}`} />
                            </button>
                          )}
                        </div>

                        {isSubOpen && hasLvl3 && (
                          <div className="space-y-2 mt-3 border-t border-slate-200 pt-3">
                            {sub.subItems.map((lvl3: any) => (
                              <Link key={lvl3.id} href={lvl3.url} onClick={close} className="block text-xs text-slate-500 hover:text-blue-600 pr-2 border-r-2 border-blue-100">
                                {lvl3.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* پاپ‌آپ‌های دسکتاپ (فقط در صفحات md به بالا نمایش داده می‌شوند) */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* پاپ‌آپ‌های دسکتاپ (فقط در صفحات md به بالا نمایش داده می‌شوند) */}
        {/* ========================================================= */}
        <div className="hidden md:block">
          {hasLevel2 && activeTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[280px] w-[260px] bg-white shadow-2xl z-[15] flex flex-col border-r border-slate-100 mt-0 transition-all duration-50
                ${isScrolled ? "top-0 h-[calc(100vh-3.5rem)]" : "top-0 h-[calc(100vh-8rem)]"}
              `}
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <p className="text-base text-slate-800 flex items-center gap-2">
                  <activeTab.icon className="w-5 h-5 text-blue-600" />
                  {activeTab.title}
                </p>
              </div>
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {activeTab.subItems.map((sub: any) => {
                  const isSubActive = pathname === sub.url;
                  const isSubHovered = activeSubTabId === sub.id;
                  return (
                    <Link
                      key={sub.id}
                      href={sub.url}
                      onMouseEnter={() => handleInteraction(sub.id, 2)}
                      className={`px-4 py-3 text-sm rounded-xl flex items-center justify-between
                        ${isSubActive ? "bg-blue-50 text-blue-700 " : "text-slate-600 hover:bg-blue-50/50"}
                        ${isSubHovered && !isSubActive ? "bg-blue-50/50 text-blue-700" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSubActive || isSubHovered ? "bg-blue-600" : "bg-slate-300"}`} />
                        {sub.title}
                      </div>
                      {sub.subItems && <ChevronLeft className="h-3.5 w-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {hasLevel3 && activeSubTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[540px] w-[260px] bg-white shadow-2xl z-[10] border-r border-slate-100 flex flex-col mt-1 transition-all duration-50
                ${isScrolled ? "top-14 h-[calc(100vh-3.5rem)]" : "top-32 h-[calc(100vh-8rem)]"}
              `}
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50  text-slate-800">
                {activeSubTab.title}
              </div>
              <div className="flex-1 p-4 space-y-1">
                {activeSubTab.subItems.map((lvl3: any) => (
                  <Link key={lvl3.id} href={lvl3.url} className="block px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl">
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
