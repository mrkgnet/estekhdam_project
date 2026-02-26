"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  GraduationCap,
  ClipboardList,
  Hospital,
  Layers,
  BriefcaseBusiness,
  Instagram,
  Youtube,
  X,
} from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { useUiStore } from "@/store/useUiStore";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { title: "خانه", href: "/", icon: Home },
  { title: "استخدامی بخش دولتی", href: "/jobs/recruitment-government-agencies", icon: Building2 },
   { title: "استخدام بخش خصوصی", href: "/jobs/private", icon: BriefcaseBusiness },
  { title: "منابع آزمون بانک ها", href: "/exam-resources", icon: GraduationCap },
  { title: "منابع آزمون آموزش و پرورش", href: "/exam-resources1", icon: GraduationCap },
  { title: "منابع آزمون دستگاه های اجرایی", href: "/exam-resources2", icon: ClipboardList },
  { title: " منابع آزمون وزارت بهداشت", href: "/exam-resources3", icon: Hospital },
  { title: "سایر دستگاه ها", href: "/exam-resources4", icon: Layers },
  { title: "سوالات  آزمون های استخدامی", href: "/employment-questions", icon: Layers },
 
];

const otherPages = [
  { title: "جدیدترین‌ها", href: "/latest" },
  { title: "پادکست", href: "/podcast" },
  { title: "دانلود اپلیکیشن", href: "/app" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سردبیر", href: "/editor" },
  { title: "دسته‌بندی‌ها", href: "/categories" },
  { title: "قوانین و کپی‌رایت", href: "/copyright" },
  { title: "حریم خصوصی", href: "/privacy" },
];

export default function SideBar() {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  const stroke = 2.8;

  return (
    // این wrapper باعث میشه سایدبار همیشه یک ستون کنار main باشه
    <div className="flex">
      {/* ------------------- سایدبار بزرگ ------------------- */}
      <aside
        className={[
          "bg-white border-l overflow-hidden",
          "transition-[width] duration-300 ease-in-out",
          sidebarOpen ? "w-[260px]" : "w-0",
        ].join(" ")}
      >
        <div className="w-[260px] h-full">
          <nav className="py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={[
                    "flex gap-4 items-center px-5 py-4",
                    "text-[15px] leading-none transition-colors",
                    "border-b border-slate-100 last:border-b-0",
                    isActive
                      ? "bg-slate-100 text-sky-800 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                  ].join(" ")}
                >
                  <Icon
                    className={isActive ? "w-5 h-5 text-sky-800" : "w-5 h-5 text-slate-500"}
                    strokeWidth={stroke}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-100 mt-2 pt-4 px-5 pb-5">
              <h3 className="text-center text-sky-800 font-semibold text-lg">
                دیگر صفحات سایت
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-y-4 text-[15px] text-slate-600">
                {otherPages.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-slate-900 transition-colors"
                    onClick={() => {
                      if (window.innerWidth < 768) closeSidebar();
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-slate-500">
                <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-slate-800 transition-colors">
                  <Instagram className="w-6 h-6" strokeWidth={stroke} />
                </Link>
                <Link href="https://youtube.com" aria-label="YouTube" className="hover:text-slate-800 transition-colors">
                  <Youtube className="w-6 h-6" strokeWidth={stroke} />
                </Link>
                <Link href="https://x.com" aria-label="X" className="hover:text-slate-800 transition-colors">
                  <X className="w-6 h-6" strokeWidth={stroke} />
                </Link>
                <Link href="https://t.me" aria-label="Telegram" className="hover:text-slate-800 transition-colors">
                  <FaTelegram size={23} />
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-slate-500">
                تمام حقوق مادی و معنوی این سایت متعلق به
                <span className="font-semibold text-slate-700"> استخدامی </span>
                می‌باشد.
              </p>
            </div>
          </nav>
        </div>
      </aside>

      {/* ------------------- سایدبار کوچک ------------------- */}
      <aside
        className={[
          "bg-white border-l overflow-hidden hidden lg:block",
          "transition-[width] duration-300 ease-in-out",
          sidebarOpen ? "w-0" : "w-[80px]",
        ].join(" ")}
      >
        <div className="w-[80px] h-full">
          <nav className="py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={[
                    "flex flex-col gap-2 items-center px-2 py-4",
                    "text-[11px] leading-4 transition-colors",
                    "border-b border-slate-100 last:border-b-0",
                    isActive
                      ? "bg-slate-100 text-sky-800 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                  ].join(" ")}
                >
                  <Icon
                    className={isActive ? "w-5 h-5 text-sky-800" : "w-5 h-5 text-slate-500"}
                    strokeWidth={stroke}
                  />
                  <span className="text-center leading-5">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}
