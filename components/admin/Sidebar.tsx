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

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [hoveredSubTab, setHoveredSubTab] = useState<string | null>(null);

  // تایمر برای خروج کامل از سایدبار
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // تایمر برای تاخیر در جابجایی بین تب‌های سطح 1 (جلوگیری از بسته شدن ناخواسته)
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    close();
    setHoveredTab(null);
    setHoveredSubTab(null);

    // پاک کردن تایمرها هنگام تغییر صفحه
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
  }, [pathname, close]);

  const handleLogOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const handleMouseEnter = (tabId: string | null, level: number) => {
    // 1. لغو تایمر بسته شدن کل سایدبار
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (level === 1 && tabId) {
      // اگر از قبل منویی باز است و کاربر روی منوی جدیدی رفته است
      if (hoveredTab && hoveredTab !== tabId) {
        // تایمرهای قبلی جابجایی را پاک کن
        if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
        
        // 300 میلی‌ثانیه صبر کن، اگر موس ماند، منو را تغییر بده
        switchTimeoutRef.current = setTimeout(() => {
          setHoveredTab(tabId);
          setHoveredSubTab(null);
        }, 300); // <-- این همان تاخیری است که جلوی بسته شدن هنگام حرکت مورب را می‌گیرد
      } else {
        // اگر هیچ منویی باز نبوده، فوراً بازش کن
        setHoveredTab(tabId);
        setHoveredSubTab(null);
      }
    } 
    else if (level === 2 && tabId) {
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
      setHoveredSubTab(tabId);
    } 
    else if (level === 0) {
      // وقتی موس وارد کانتینر سطح 2 یا 3 می‌شود (level 0)
      // تایمر جابجایی را لغو میکنیم تا تب سطح 1 فعلی قفل بماند و عوض نشود
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    // وقتی موس کلا از سایدبار خارج شد، اگر تایمر تغییر منویی در جریان است لغو شود
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
      setHoveredSubTab(null);
    }, 50); 
  };

  const activeTab = tabsDataAdminPanel.find((t) => t.id === hoveredTab);
  const hasLevel2 = activeTab?.subItems && activeTab.subItems.length > 0;

  const activeSubTab = activeTab?.subItems?.find((s: any) => s.id === hoveredSubTab);
  const hasLevel3 = activeSubTab?.subItems && activeSubTab.subItems.length > 0;

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className="fixed top-16 inset-x-0 bottom-0 z-40 bg-gray-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <aside
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => handleMouseEnter(null, 0)}
        className={`fixed right-0 z-50 w-[280px] bg-white flex flex-col shadow-xl border-l border-gray-100
          top-16 h-[calc(100vh-4rem)] 
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div className="p-5 border-b border-gray-50 flex justify-between items-center z-20 bg-white">
          <Link href="/adminp" className="flex items-center gap-3 font-bold text-gray-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-base tracking-tight">پنل مدیریت</span>
          </Link>
          <button onClick={close} className="p-2 text-gray-400 hover:text-red-500 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-white z-20 relative">
          {tabsDataAdminPanel.map((tab) => {
            const isActive = pathname === tab.url || pathname.startsWith(`${tab.url}/`);
            const isHovered = hoveredTab === tab.id;
            const hasSubItems = tab.subItems && tab.subItems.length > 0;

            return (
              <div key={tab.id} onMouseEnter={() => handleMouseEnter(tab.id, 1)} className="relative">
                <Link
                  href={tab.url}
                  className={`relative flex items-center justify-between px-4 py-3.5 border-b text-sm font-medium
                    ${isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-blue-50/50"}
                    ${isHovered && !isActive ? "bg-blue-50/50 text-gray-900" : ""}
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-1.5 rounded-lg ${isActive ? "bg-blue-600 text-white" : "text-gray-400"}`}>
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <span>{tab.title}</span>
                  </div>
                  {hasSubItems && <ChevronLeft className={`h-4 w-4 ${isHovered ? "text-blue-500" : "text-gray-400"}`} />}
                </Link>
              </div>
            );
          })}
        </nav>

        {hasLevel2 && activeTab && (
          <div
            onMouseEnter={() => handleMouseEnter(null, 0)}
            onMouseLeave={handleMouseLeave}
            // دقت کنید: top-0 را به top-16 تغییر دادم تا دقیقاً زیر نوبار قرار بگیرد و هم‌تراز سایدبار اصلی شود
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
                const isSubHovered = hoveredSubTab === sub.id;
                return (
                  <Link
                    key={sub.id}
                    href={sub.url}
                    onMouseEnter={() => handleMouseEnter(sub.id, 2)}
                    className={`px-4 py-3 text-sm rounded-xl flex items-center justify-between
                      ${isSubActive ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-blue-50/50"}
                      ${isSubHovered && !isSubActive ? "bg-blue-50/50 text-blue-700" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSubActive || isSubHovered ? "bg-blue-600" : "bg-gray-300"}`} />
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
            onMouseEnter={() => handleMouseEnter(null, 0)}
            onMouseLeave={handleMouseLeave}
            className="fixed top-0 right-[540px] w-[260px] h-[calc(100vh-4rem)] bg-white shadow-2xl z-[10] border-r border-gray-100 flex flex-col"
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

        <div className="p-4 border-t border-gray-100 z-20 bg-white">
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
