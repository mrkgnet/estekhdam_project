"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, X, ChevronLeft } from "lucide-react";
import { tabsDataAdminPanel } from "@/lib/constats";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { isOpen, close } = useSidebarStore();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    close();
    setActiveTabId(null);
    setActiveSubTabId(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
  }, [pathname, close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.innerWidth < 768) {
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

  const handleLogOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const handleInteraction = (tabId: string | null, level: number, isClick: boolean = false) => {
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
        setActiveTabId(tabId);
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          const clickedTab = tabsDataAdminPanel.find(t => t.id === tabId);
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

  const activeTab = tabsDataAdminPanel.find((t) => t.id === activeTabId);
  const hasLevel2 = activeTab?.subItems && activeTab.subItems.length > 0;

  const activeSubTab = activeTab?.subItems?.find((s: any) => s.id === activeSubTabId);
  const hasLevel3 = activeSubTab?.subItems && activeSubTab.subItems.length > 0;

  return (
    <>
      {/* 🔴 لایه‌ی پس‌زمینه حالا روی دسکتاپ هم نمایش داده می‌شود تا با کلیک روی آن سایدبار بسته شود */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed top-16 inset-x-0 bottom-0 z-40 bg-gray-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* 🔴 کلاس md:translate-x-0 حذف شد تا در حالت بسته روی دسکتاپ هم مخفی باشد */}
      <aside
        onMouseLeave={handleMouseLeaveDesktop}
        onMouseEnter={() => handleInteraction(null, 0)}
        className={`fixed right-0 z-50 w-full md:w-[280px] bg-white flex flex-col shadow-xl border-l border-gray-100 top-16 h-[calc(100vh-4rem)] transition-transform duration-100
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div className="p-5 border-b border-gray-50 flex justify-between items-center z-20 bg-white">
          <Link href="/adminp" onClick={close} className="flex items-center gap-3 font-bold text-gray-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-base tracking-tight">پنل مدیریت</span>
          </Link>
          <button onClick={close} className="p-2 text-gray-400 hover:text-red-500 md:hidden border rounded-xl shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* ستون اصلی منوها */}
          <nav className="w-1/3 md:w-full flex-shrink-0 border-l border-gray-100 md:border-none p-2 md:p-4 space-y-1 overflow-y-auto bg-gray-50 md:bg-white z-20">
            {tabsDataAdminPanel.map((tab) => {
              const isActive = pathname === tab.url || pathname.startsWith(`${tab.url}/`);
              const isSelected = activeTabId === tab.id;

              return (
                <div
                  key={tab.id}
                  onMouseEnter={() => handleInteraction(tab.id, 1)}
                  onClick={() => handleInteraction(tab.id, 1, true)}
                  className="relative cursor-pointer font-bold"
                >
                  <div
                    className={`relative flex flex-col md:flex-row items-center justify-center md:justify-between p-2 md:px-4 md:py-1.5 rounded-xl md:rounded-none md:border-b text-sm font-medium
                      ${isActive ? "md:bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-blue-50/50"}
                    `}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative z-10">
                      <div className={`p-1.5 rounded-lg ${isActive || isSelected ? "text-blue-600 md:bg-blue-600 md:text-white" : "text-gray-400"}`}>
                        <tab.icon className="h-6 w-6 md:h-5 md:w-5" />
                      </div>
                      <span className="text-center">{tab.title}</span>
                    </div>
                    {tab.subItems && tab.subItems.length > 0 && (
                      <ChevronLeft className={`hidden md:block h-4 w-4 ${isSelected ? "text-blue-500" : "text-gray-400"}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* پنل زیرمنوها مختص موبایل */}
          <div className="w-2/3 md:hidden flex flex-col overflow-y-auto bg-white p-3">
            {hasLevel2 && activeTab && (
              <>
                <Link href={activeTab.url} onClick={close} className="text-blue-600 mb-4 flex items-center gap-1 font-bold">
                  {activeTab.title}
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="space-y-4">
                  {activeTab.subItems.map((sub: any) => {
                    const isSubOpen = activeSubTabId === sub.id;
                    const hasLvl3 = sub.subItems && sub.subItems.length > 0;

                    return (
                      <div key={sub.id} className="bg-gray-50 rounded-xl p-3 text-sm">
                        <div className="flex justify-between items-center">
                          <Link href={sub.url} onClick={close} className="text-gray-800 flex-1 font-medium">
                            {sub.title}
                          </Link>
                          {hasLvl3 && (
                            <button
                              onClick={() => setActiveSubTabId(isSubOpen ? null : sub.id)}
                              className="p-1 hover:bg-gray-200 rounded-md"
                            >
                              <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-100 ${isSubOpen ? "-rotate-90" : ""}`} />
                            </button>
                          )}
                        </div>

                        {isSubOpen && hasLvl3 && (
                          <div className="space-y-2 mt-3 border-t border-gray-200 pt-3">
                            {sub.subItems.map((lvl3: any) => (
                              <Link key={lvl3.id} href={lvl3.url} onClick={close} className="block text-gray-500 hover:text-blue-600 pr-2 border-r-2 border-blue-100">
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

        {/* پنل زیرمنوها مختص دسکتاپ */}
        <div className="hidden md:block">
          {hasLevel2 && activeTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className="fixed top-0 right-[280px] w-[260px] h-[calc(100vh-4rem)] bg-white shadow-2xl z-[15] flex flex-col border-r border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <activeTab.icon className="w-5 h-5 text-blue-600" />
                  {activeTab.title}
                </h3>
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
                        ${isSubActive ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-blue-50/50"}
                        ${isSubHovered && !isSubActive ? "bg-blue-50/50 text-blue-700" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSubActive || isSubHovered ? "bg-blue-600" : "bg-gray-300"}`} />
                        {sub.title}
                      </div>
                      {sub.subItems && sub.subItems.length > 0 && <ChevronLeft className="h-3.5 w-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {hasLevel3 && activeSubTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className="fixed top-16 right-[540px] w-[260px] h-[calc(100vh-4rem)] bg-white shadow-2xl z-[10] border-r border-gray-100 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-800">
                {activeSubTab.title}
              </div>
              <div className="flex-1 p-4 space-y-1">
                {activeSubTab.subItems.map((lvl3: any) => (
                  <Link
                    key={lvl3.id}
                    href={lvl3.url}
                    className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl"
                  >
                    {lvl3.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full p-4 border-t border-gray-100 z-20 bg-white">
          <button
            onClick={handleLogOut}
            className="flex w-full items-center justify-between px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold">خروج از سیستم</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
