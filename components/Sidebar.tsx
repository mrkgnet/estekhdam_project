// components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { title: " دولتی - سراسری", href: "/jobs/recruitment-government-agencies", icon: Star },
  { title: "بخش خصوصی", href: "/videos", icon: Video },
  { title: "منابع استخدامی", href: "/exam-resources", icon: Radio },
  { title: "منابع استخدامی بانک ها", href: "/exam-resources1", icon: Radio },
   { title: " استخدامی آموزش پرورش", href: "/exam-resources1", icon: Radio },
   { title: " استخدامی  دستگاه های اجرایی", href: "/exam-resources1", icon: Radio },
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

function NavItemMobileDesktop({ item, active }: { item: Item; active: boolean }) {
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

export default function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={[
        "relative",
        // این باعث میشه وقتی بسته است جا هم نگیره
        isSidebarOpen ? "w-[230px]" : "w-0",
        "transition-[width] duration-200 ease-out",
      ].join(" ")}
    >
      <aside
        className={[
          "h-full bg-white border-l border-gray-200 flex flex-col",
          "w-[230px]",
          "transition-transform duration-200 ease-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex-1">
          <nav className="py-1">
            {TOP_ITEMS.map((item) => (
              <NavItemMobileDesktop
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 bg-white">
          <div className="px-5 py-4">
            <div className="text-sm font-semibold text-gray-800">{FOOTER_TITLE}</div>

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
      </aside>
    </div>
  );
}