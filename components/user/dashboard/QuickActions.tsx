// components/dashboard/QuickActions.tsx
import Link from "next/link";
import { Headphones, ArrowLeft, MessageCircle } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-300 dark:border-slate-700 p-4 md:p-5 shadow-sm">
      
      {/* هدر بخش */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-base">دسترسی سریع</div>
        </div>
      </div>

      {/* کارت پشتیبانی - رنگ قرمز */}
      <Link
        href="/ddashboard/support/tickets"
        className="group relative block rounded-lg border-2 border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-rose-100/60 dark:from-rose-950/40 dark:to-rose-900/20 p-4 hover:shadow-md hover:border-rose-400 dark:hover:border-rose-700 transition-all overflow-hidden"
      >
        {/* لایه دکوراتیو در گوشه */}
        <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-rose-200/40 dark:bg-rose-800/20 blur-2xl pointer-events-none group-hover:bg-rose-300/50 transition-colors" />

        <div className="relative flex items-start gap-3">
          {/* آیکون بزرگ */}
          <div className="shrink-0 w-11 h-11 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-sm shadow-rose-300/50 dark:shadow-rose-900/50 border-2 border-rose-600 group-hover:scale-105 transition-transform">
            <Headphones size={20} strokeWidth={2.2} />
          </div>

          {/* محتوای متنی */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                پشتیبانی و تیکت
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-400/40 text-[10px] font-medium text-rose-700 dark:text-rose-400">
                <MessageCircle className="w-2.5 h-2.5" />
                آنلاین
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              سوال یا مشکلی دارید؟ تیم پشتیبانی آماده پاسخگویی است.
            </p>

            {/* لینک CTA */}
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 dark:text-rose-400 group-hover:gap-2.5 transition-all">
              <span>ورود به بخش پشتیبانی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>

    </section>
  );
}