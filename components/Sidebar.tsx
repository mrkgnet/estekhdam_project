"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUiStore } from "@/store/useUiStore";
import {
  Home,
  Star,
  Video,
  Radio,
  Activity,
  ClipboardList,
  Shirt,
  HelpCircle,
  Trophy,
  Table2,
  BarChart3,
  CalendarDays,
  ArrowLeftRight,
} from "lucide-react";

type Item = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const TOP_ITEMS: Item[] = [
  { title: "خانه", href: "/", icon: Home },
  { title: "برای شما", href: "/for-you", icon: Star },
  { title: "ویدیوها", href: "/videos", icon: Video },
  { title: "پخش زنده", href: "/live", icon: Radio },
  { title: "نتایج زنده", href: "/live-results", icon: Activity },
  { title: "پیش‌بینی", href: "/predictions", icon: ClipboardList },
  { title: "فوتبال فانتزی", href: "/fantasy", icon: Shirt },
  { title: "نظرسنجی", href: "/poll", icon: HelpCircle },
  { title: "رقابت‌ها", href: "/competitions", icon: Trophy },
  { title: "جدول لیگ‌ها", href: "/tables", icon: Table2 },
  { title: "آمار و ارقام", href: "/stats", icon: BarChart3 },
  { title: "برنامه بازی‌ها", href: "/fixtures", icon: CalendarDays },
  { title: "نقل‌وانتقالات", href: "/transfers", icon: ArrowLeftRight },
];

const FOOTER_TITLE = "دیگر صفحات فوتبال ۳۶۰°";
const FOOTER_LINKS = [
  { title: "جدیدترین‌ها", href: "/latest" },
  { title: "سردبیر", href: "/editor" },
  { title: "دسته‌بندی‌ها", href: "/categories" },
  { title: "پادکست", href: "/podcast" },
  { title: "دانلود اپلیکیشن", href: "/app" },
  { title: "قوانین و کپی‌رایت", href: "/copyright" },
  { title: "حریم خصوصی", href: "/privacy" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
];

/* =========================
   NAV ITEMS (DESKTOP)
========================= */

function NavItemMini({
  item,
  active,
}: {
  item: Item;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "group relative flex flex-col gap-2 items-center justify-center",
        "px-2 py-3",
        "text-[12px] leading-none",
        "transition-colors duration-200 ease-out",
        active ? "bg-gray-100" : "hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon
        size={20}
        className={[
          "shrink-0 transition-colors duration-200 ease-out",
          active ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700",
        ].join(" ")}
      />
      <span
        className={[
          "transition-colors duration-200 ease-out",
          active ? "text-blue-700 font-semibold" : "text-gray-700",
        ].join(" ")}
      >
        {item.title}
      </span>

      <span
        className={[
          "absolute right-0 top-0 h-full w-[3px] rounded-l",
          "transition-opacity duration-200 ease-out",
          active
            ? "bg-blue-700 opacity-100"
            : "opacity-0 group-hover:opacity-20 bg-gray-400",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}

function NavItemFull({
  item,
  active,
}: {
  item: Item;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "group relative flex items-center justify-start gap-3",
        "px-5 py-3.5",
        "text-[15px] leading-none",
        "transition-colors duration-200 ease-out",
        active ? "bg-gray-100" : "hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon
        size={20}
        className={[
          "shrink-0 transition-colors duration-200 ease-out",
          active ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700",
        ].join(" ")}
      />
      <span
        className={[
          "transition-colors duration-200 ease-out",
          active ? "text-blue-700 font-semibold" : "text-gray-700",
        ].join(" ")}
      >
        {item.title}
      </span>

      <span
        className={[
          "absolute right-0 top-0 h-full w-[3px] rounded-l",
          "transition-opacity duration-200 ease-out",
          active
            ? "bg-blue-700 opacity-100"
            : "opacity-0 group-hover:opacity-20 bg-gray-400",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}

/* =========================
   NAV ITEMS (MOBILE 150px)
========================= */

function NavItemMobile150({
  item,
  active,
  onClick,
}: {
  item: Item;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "group relative flex flex-col items-center justify-center gap-2",
        "px-2 py-3",
        "text-[12px] leading-none",
        "rounded-lg",
        "transition-colors duration-200 ease-out",
        active ? "bg-gray-100" : "hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon
        size={20}
        className={[
          "shrink-0 transition-colors duration-200 ease-out",
          active ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700",
        ].join(" ")}
      />
      <span
        className={[
          "transition-colors duration-200 ease-out text-center",
          active ? "text-blue-700 font-semibold" : "text-gray-700",
        ].join(" ")}
      >
        {item.title}
      </span>

      <span
        className={[
          "absolute right-0 top-0 h-full w-[3px] rounded-l",
          "transition-opacity duration-200 ease-out",
          active
            ? "bg-blue-700 opacity-100"
            : "opacity-0 group-hover:opacity-20 bg-gray-400",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}

/* =========================
   SIDEBAR (PRODUCTION)
========================= */

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const sidebarMode = useUiStore((s) => s.sidebarMode);
  const isMini = sidebarMode === "mini";

  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const closeMobileSidebar = useUiStore((s) => s.closeMobileSidebar);

  // 1) بستن موبایل بعد از تغییر route
  useEffect(() => {
    if (mobileOpen) closeMobileSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 2) بستن با ESC وقتی موبایل بازه
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileSidebar();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobileSidebar]);

  // 3) قفل اسکرول body وقتی drawer بازه
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // 4) Swipe برای بستن (right drawer)
  const drawerRef = useRef<HTMLElement | null>(null);
  const swipeState = useRef({ startX: 0, currentX: 0, dragging: false });

  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      swipeState.current.dragging = true;
      swipeState.current.startX = e.touches[0].clientX;
      swipeState.current.currentX = swipeState.current.startX;
      el.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!swipeState.current.dragging) return;
      swipeState.current.currentX = e.touches[0].clientX;

      // drawer از راست باز میشه → حرکت به راست یعنی بستن
      const dx = Math.max(0, swipeState.current.currentX - swipeState.current.startX);
      const max = 220; // کمی بزرگتر از 150 برای حس طبیعی
      const clamped = Math.min(dx, max);

      el.style.transform = `translateX(${clamped}px)`;
    };

    const onTouchEnd = () => {
      if (!swipeState.current.dragging) return;
      swipeState.current.dragging = false;

      const dx = swipeState.current.currentX - swipeState.current.startX;
      el.style.transition = "transform 300ms ease-out";

      // اگر بیشتر از 60px کشیدی → ببند
      if (dx > 60) {
        closeMobileSidebar();
      } else {
        // برگرد به حالت باز
        el.style.transform = "translateX(0px)";
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [closeMobileSidebar]);

  return (
    <>
      {/* =================== DESKTOP (lg+) =================== */}
      <aside
        className={[
          "hidden lg:flex flex-col bg-white border-l border-gray-200",
          "h-[calc(100vh-62px)]",
          "transition-[width] duration-200 ease-out",
          isMini ? "w-[100px]" : "w-[230px]",
        ].join(" ")}
      >
        <div className="flex-1 overflow-y-auto">
          <nav className="py-1">
            {TOP_ITEMS.map((item) =>
              isMini ? (
                <NavItemMini
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                />
              ) : (
                <NavItemFull
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                />
              )
            )}
          </nav>
        </div>

        {!isMini && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-5 py-4">
              <div className="text-sm font-semibold text-gray-800">
                {FOOTER_TITLE}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-gray-600">
                {FOOTER_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="hover:text-gray-900 transition-colors duration-200 ease-out"
                  >
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* =================== MOBILE ( < lg ) =================== */}

      {/* Backdrop */}
      <div
        onClick={closeMobileSidebar}
        className={[
          "fixed inset-0 z-40 bg-black/40 lg:hidden",
          "transition-opacity duration-300 ease-out",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer */}
      <aside
        ref={(node) => {
          drawerRef.current = node;
        }}
        className={[
          "fixed top-[62px] right-0 z-50 lg:hidden",
          "h-[calc(100vh-62px)] w-[150px]",
          "bg-white border-l border-gray-200",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="h-full overflow-y-auto p-2">
          <nav className="grid grid-cols-1 gap-1">
            {TOP_ITEMS.map((item) => (
              <NavItemMobile150
                key={item.href}
                item={item}
                active={isActive(item.href)}
                onClick={closeMobileSidebar}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}