"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function NavItemMobile({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "group relative flex  flex-col gap-2.5  items-center justify-center",
        "px-5 py-3.5",
        "text-[15px] leading-none",
        "transition-colors duration-200 ease-out",
        active ? "bg-gray-100" : "hover:bg-gray-50",
      ].join(" ")}
    >
      {/* متن */}
      <span
        className={[
          "transition-colors duration-200 ease-out",
          active ? "text-blue-700 font-semibold" : "text-gray-700",
        ].join(" ")}
      >
        {item.title}
      </span>

      {/* آیکن سمت راست */}
      <Icon
        size={20}
        className={[
          "shrink-0 transition-colors duration-200 ease-out",
          active ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700",
        ].join(" ")}
      />

      {/* نوار خیلی ظریف سمت راست برای حس active مثل سایت‌ها */}
      <span
        className={[
          "absolute right-0 top-0 h-full w-[3px] rounded-l",
          "transition-opacity duration-200 ease-out",
          active ? "bg-blue-700 opacity-100" : "opacity-0 group-hover:opacity-20 bg-gray-400",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}

function NavItemMobileDesktop({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "group relative flex     items-center justify-start gap-3",
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
      {/* متن */}
      <span
        className={[
          "transition-colors duration-200 ease-out",
          active ? "text-blue-700 font-semibold" : "text-gray-700",
        ].join(" ")}
      >
        {item.title}
      </span>

      {/* آیکن سمت راست */}

      {/* نوار خیلی ظریف سمت راست برای حس active مثل سایت‌ها */}
      <span
        className={[
          "absolute right-0 top-0 h-full w-[3px] rounded-l",
          "transition-opacity duration-200 ease-out",
          active ? "bg-blue-700 opacity-100" : "opacity-0 group-hover:opacity-20 bg-gray-400",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex">
      {/* دکستاپ */}
      <aside className="w-[230px] h-full bg-white border-l border-gray-200 flex flex-col">
        {/* بخش اسکرولی بالا */}
        <div className="flex-1 ">
          {/* هدر خیلی ساده مثل نمونه (فقط جهت spacing) */}

          <nav className="py-1">
            {TOP_ITEMS.map((item) => (
              <NavItemMobileDesktop key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </nav>
        </div>

        {/* فوتر پایین مثل نمونه */}
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

      {/* موبایل */}
      <aside className="w-[100px] hidden lg:block h-full bg-white border-l border-gray-200 flex flex-col">
        {/* بخش اسکرولی بالا */}
        <div className="flex-1  ">
          {/* هدر خیلی ساده مثل نمونه (فقط جهت spacing) */}

          <nav className="py-1">
            {TOP_ITEMS.map((item) => (
              <NavItemMobile key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
