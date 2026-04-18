// components/dashboard/QuickActions.tsx
import Link from "next/link";
import { BookOpen, CreditCard, FileText, Headphones } from "lucide-react";

const actions = [
  { title: "شروع آزمون جدید", desc: "از بین آزمون‌ها انتخاب کن", href: "/resources", icon: FileText },
  { title: "مطالعه درس‌ها", desc: "رفتن به درس‌ها و دوره‌ها", href: "/resources", icon: BookOpen },
  { title: "پشتیبانی", desc: "سوال داری؟ پیام بده", href: "/ddashboard/support/tickets", icon: Headphones },
];

export default function QuickActions() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="font-extrabold text-slate-900">دسترسی سریع</div>
      <div className="text-sm text-slate-500 mt-1">کارهای پرتکرار همینجاست</div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.title}
              href={a.href}
              className="rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900">{a.title}</div>
                <div className="text-[13px] text-slate-500 mt-1">{a.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}