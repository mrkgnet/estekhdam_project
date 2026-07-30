"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, X, ChevronLeft, ListCollapse, Search } from "lucide-react";
import { useSidebarStore } from "@/store/sideBarStoreAdmin";
import SearchInput from "@/components/ui/SearchInput";

interface ShowDataSideBarUserProps {
  response: {
    success: boolean;
    data?: any[];
    message?: string;
    error?: string;
  };
}

export default function ShowDataSideBarUser({ response }: ShowDataSideBarUserProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarStore();
  const [search, setSearch] = useState("");

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dynamicMenuTree = useMemo(() => {
    if (!response || !response.success || !response.data) return [];

    const menus = response.data;

    const menuMap: Record<string, any> = {};
    const tree: any[] = [];

    menus.forEach((menu) => {
      menuMap[menu.id] = {
        id: menu.id,
        title: menu.name,
        url: menu.customUrl ? menu.customUrl : `/resources/main-resource?category=${menu.slug}`,
        icon: ListCollapse,
        imageUrl: menu.imageUrl,
        subItems: [],
        parentId: menu.parentId,
      };
    });

    menus.forEach((menu) => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].subItems.push(menuMap[menu.id]);
      } else if (!menu.parentId) {
        tree.push(menuMap[menu.id]);
      }
    });

    return tree;
  }, [response]);

  useEffect(() => {
    close();
    setActiveTabId(null);
    setActiveSubTabId(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
  }, [pathname, close]);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        if (!activeTabId && dynamicMenuTree.length > 0) {
          const firstTab = dynamicMenuTree[0];
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
  }, [isOpen, activeTabId, dynamicMenuTree]);

  // ریست کردن سرچ وقتی تب اصلی عوض می‌شود
  useEffect(() => {
    setSearch("");
  }, [activeTabId]);

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
          const clickedTab = dynamicMenuTree.find(t => t.id === tabId);
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

  const activeTab = dynamicMenuTree.find((t) => t.id === activeTabId);
  const hasLevel2 = activeTab?.subItems && activeTab.subItems.length > 0;

  const activeSubTab = activeTab?.subItems?.find((s: any) => s.id === activeSubTabId);
  const hasLevel3 = activeSubTab?.subItems && activeSubTab.subItems.length > 0;

  // فیلتر کردن منوهای سطح دوم بر اساس سرچ
  const filteredLevel2Items = activeTab?.subItems?.filter((sub: any) =>
    sub.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className={`fixed inset-x-0 mt-1.5 bottom-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-all duration-50
            ${isScrolled ? "top-14" : "top-32"}
          `}
          aria-hidden="true"
        />
      )}

      <aside
        onMouseLeave={handleMouseLeaveDesktop}
        onMouseEnter={() => handleInteraction(null, 0)}
        className={`fixed right-0 z-50 w-full md:w-[280px] bg-white mt-1 flex flex-col shadow-xl border-l border-gray-100
          transition-all duration-50
          ${isScrolled ? "top-14 h-[calc(100vh-3.5rem)]" : "top-32 h-[calc(100vh-8rem)]"}
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center z-20 bg-white border-t">
          {/* لینک خانه معمولا نیازی به باز شدن در تب جدید ندارد */}
          <Link href="/" onClick={close} className="flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-base tracking-tight">دسته‌بندی‌ها</span>
          </Link>
          <button onClick={close} className="p-2 text-gray-400 hover:text-red-500 md:hidden border rounded-xl shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <nav className="w-1/3 md:w-full flex-shrink-0 border-l border-gray-100 md:border-none p-2 md:p-4 space-y-1 overflow-y-auto bg-gray-50 md:bg-white z-20">
            {dynamicMenuTree.length === 0 ? (
              <p className=" text-gray-400 text-center mt-5">منویی یافت نشد.</p>
            ) : (
              dynamicMenuTree.map((tab) => {
                const isActive = pathname === tab.url || pathname.startsWith(`${tab.url}/`);
                const isSelected = activeTabId === tab.id;

                return (
                  <div
                    key={tab.id}
                    onMouseEnter={() => handleInteraction(tab.id, 1)}
                    onClick={() => handleInteraction(tab.id, 1, true)}
                    className="relative cursor-pointer font-bold "
                  >
                    <div
                      className={`relative  flex flex-col md:flex-row items-center justify-center md:justify-between p-1.5 md:px-4 md:py-1.5 rounded-xl md:rounded-none md:border-b font-medium
                                ${isActive || isSelected ? "md:bg-blue-50 text-blue-700 border-2 md:border-1 " : "text-gray-600 hover:bg-blue-50/50"}
                                `}
                    >
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative z-10">
                        <div className={`p-1.5 rounded-lg ${isActive || isSelected ? "text-blue-600  md:bg-blue-600 md:text-white" : "text-gray-400"}`}>
                          {tab.icon && <tab.icon className="h-6 w-6 md:h-5 md:w-5" />}
                        </div>
                        <span className="text-center ">{tab.title}</span>
                      </div>
                      {tab.subItems && tab.subItems.length > 0 && (
                        <ChevronLeft className={`hidden md:block h-4 w-4 ${isSelected ? "text-blue-500" : "text-gray-400"}`} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </nav>

          <div className="w-2/3 md:hidden flex flex-col overflow-y-auto bg-white p-3">
            {hasLevel2 && activeTab && (
              <>
                <Link 
                  href={activeTab.url} 
                  onClick={close} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className=" text-blue-600 mb-4 flex items-center gap-1"
                >
                  {activeTab.title}
                  <ChevronLeft className="w-4 h-4" />
                </Link>

                <div className="relative">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در این دسته‌..."
                    className="w-full h-9 rounded-xl mb-2 border border-gray-200 bg-white px-10 text-11 text-gray-700
               placeholder:text-gray-400 outline-none transition
               focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>


                <div className="space-y-4">
                  {filteredLevel2Items.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-5">موردی یافت نشد.</p>
                  ) : (
                    filteredLevel2Items.map((sub: any) => {
                      const isSubOpen = activeSubTabId === sub.id;
                      const hasLvl3 = sub.subItems && sub.subItems.length > 0;

                      return (
                        <div key={sub.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex justify-between items-center">
                            <Link 
                              href={sub.url} 
                              onClick={close} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-800 flex-1"
                            >
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
                                <Link 
                                  key={lvl3.id} 
                                  href={lvl3.url} 
                                  onClick={close} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="block text-gray-500 hover:text-blue-600 pr-2 border-r-2 border-blue-100"
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

        <div className="hidden md:block">
          {hasLevel2 && activeTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[280px] w-[290px] bg-white shadow-2xl z-[15] flex flex-col border-r border-gray-100 mt-0 transition-all duration-50
                ${isScrolled ? "top-0 h-[calc(100vh-3.5rem)]" : "top-0 h-[calc(100vh-8rem)]"}
              `}
            >

              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  {activeTab.icon && <activeTab.icon className="w-5 h-5 text-blue-600" />}
                  {activeTab.title}
                </span>

                <div className="relative">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در این دسته‌..."
                    className="w-full h-10 rounded-xl border border-gray-200 bg-white px-10 text-11 text-gray-700
               placeholder:text-gray-400 outline-none transition
               focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

              </div>

              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {filteredLevel2Items.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center mt-5">موردی یافت نشد.</p>
                ) : (
                  filteredLevel2Items.map((sub: any) => {
                    const isSubActive = pathname === sub.url;
                    const isSubHovered = activeSubTabId === sub.id;
                    return (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => handleInteraction(sub.id, 2)}
                        className={`px-4 py-3 rounded-xl flex items-center justify-between
                          ${isSubActive ? "bg-blue-50 text-blue-700 " : "text-gray-600 hover:bg-blue-50/50"}
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
                  })
                )}
              </div>
            </div>
          )}

          {hasLevel3 && activeSubTab && (
            <div
              onMouseEnter={() => handleInteraction(null, 0)}
              className={`fixed right-[540px] w-[260px] bg-white shadow-2xl z-[10] border-r border-gray-100 flex flex-col mt-1 transition-all duration-50
                ${isScrolled ? "top-14 h-[calc(100vh-3.5rem)]" : "top-32 h-[calc(100vh-8rem)]"}
              `}
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-gray-800">
                {activeSubTab.title}
              </div>
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {activeSubTab.subItems.map((lvl3: any) => (
                  <Link 
                    key={lvl3.id} 
                    href={lvl3.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl"
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