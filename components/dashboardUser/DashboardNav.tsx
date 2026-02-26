"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "خانه", href: "/dashboard" },
  { label: "خریدهای شما", href: "/dashboard/purchases" },
  { label: "رزومه‌ساز", href: "/dashboard/resume-builder" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col md:border-r md:bg-white">
        <div className="p-4 border-b">
          <div className="text-lg font-semibold">داشبورد</div>
          <div className="text-sm text-gray-500">خوش آمدید</div>
        </div>

        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="grid grid-cols-3">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "py-3 text-center text-sm transition",
                  active ? "text-gray-900 font-semibold" : "text-gray-500",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}