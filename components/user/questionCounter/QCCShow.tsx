'use client'

import React, { useEffect, useState } from 'react'
import { FileText, BookOpen, Sparkles, Users } from 'lucide-react'
import { PlatformStats } from '@/actions/stats'

/* ---------------------------------- */
/* انواع داده */
/* ---------------------------------- */
type CounterItem = {
  key: keyof PlatformStats
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'emerald' | 'blue' | 'purple' | 'amber'
}

/* ---------------------------------- */
/* هوک انیمیشن شمارنده */
/* ---------------------------------- */
function useAnimatedCount(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setCount(0)
      return
    }

    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeOutValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      setCount(Math.floor(easeOutValue * target))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration])

  return count
}

/* ---------------------------------- */
/* فرمت اعداد به فارسی */
/* ---------------------------------- */
function formatFarsiNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num)
}

/* ---------------------------------- */
/* استایل‌های رنگ مینیمال */
/* ---------------------------------- */
const COLOR_VARIANTS = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/30',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/30',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/30',
  },
}

/* ---------------------------------- */
/* کامپوننت اسکلتون با موج راست به چپ */
/* ---------------------------------- */
function SkeletonCard() {
  // موج از راست به چپ: شروع از translateX(100%) و پایان در -100%
  const shimmerClass = "relative overflow-hidden bg-slate-200 dark:bg-slate-800 before:absolute before:inset-0 before:translate-x-full before:animate-[shimmer-rtl_1.5s_infinite] before:bg-gradient-to-l before:from-transparent before:via-white/60 dark:before:via-white/20 before:to-transparent"

  return (
    <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      {/* آیکون اسکلتون */}
      <div className={`w-11 h-11 rounded-lg shrink-0 ${shimmerClass}`} />
      
      {/* متن‌های اسکلتون */}
      <div className="flex flex-col gap-2 w-full">
        <div className={`h-7 w-20 rounded-md ${shimmerClass}`} />
        <div className={`h-3 w-32 rounded-md ${shimmerClass}`} />
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* کامپوننت کارت اصلی */
/* ---------------------------------- */
function CounterCard({ item }: { item: CounterItem }) {
  const animatedValue = useAnimatedCount(item.value)
  const styles = COLOR_VARIANTS[item.color]
  const Icon = item.icon

  return (
    <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-400/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${styles.bg} ${styles.text} ${styles.border} border`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">
          {formatFarsiNumber(animatedValue)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
          {item.label}
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* کامپوننت اصلی */
/* ---------------------------------- */
export default function QCCShow({ stats }: { stats: PlatformStats }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const counterItems: CounterItem[] = [
    {
      key: 'questions',
      label: 'سوالات استخدامی و تالیفی',
      value: stats.questions,
      icon: FileText,
      color: 'emerald',
    },
    {
      key: 'booklets',
      label: 'دفترچه‌های آزمون',
      value: stats.booklets,
      icon: BookOpen,
      color: 'blue',
    },
    {
      key: 'free',
      label: 'منابع رایگان',
      value: stats.free,
      icon: Sparkles,
      color: 'purple',
    },
    {
      key: 'users',
      label: 'داوطلبان و کاربران',
      value: stats.users,
      icon: Users,
      color: 'amber',
    },
  ]

  return (
    <section className="w-full ">
      {/* کیفریم انیمیشن شیمر RTL: از راست (100%) به چپ (-100%) */}
      <style>{`
        @keyframes shimmer-rtl {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* هدر بخش همراه با نشانگر زنده */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              آمار لحظه‌ای پلتفرم
            </h2>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            همگام با پایگاه داده
          </span>
        </div>

        {/* گرید ۴ ستونه با شرط نمایش اسکلتون */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {!mounted 
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : counterItems.map((item) => <CounterCard key={item.key} item={item} />)
          }
        </div>

      </div>
    </section>
  )
}