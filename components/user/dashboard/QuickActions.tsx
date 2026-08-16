// components/dashboard/QuickActions.tsx
import Link from "next/link";
import { BookOpen, FileText, Headphones } from "lucide-react";

const actions = [
  { title: "صفحه بانک سوالات", desc: "از بین بانک سوالات انتخاب کن", href: "/resources?category=بانک-سوالات", icon: FileText },
  { title: "صفحه دفترچه‌های آزمون‌ها", desc: "از بین دفترچه های آزمون انتخاب کن", href: "/resources?category=دفترچه-های-استخدامی", icon: BookOpen },
  { title: "پشتیبانی", desc: "سوال داری؟ پیام بده", href: "/ddashboard/support/tickets", icon: Headphones },
];

export default function QuickActions() {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-5 shadow-sm">
      <div className="font-extrabold text-slate-900 dark:text-slate-100">دسترسی سریع</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">کارهای پرتکرار همینجاست</div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.title}
              href={a.href}
              className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-800">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 dark:text-slate-100">{a.title}</div>
                <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{a.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}