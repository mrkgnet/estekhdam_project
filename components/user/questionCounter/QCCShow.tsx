'use client'

import React, { useEffect, useState } from 'react'
import { FileText, BookOpen, Sparkles } from 'lucide-react'

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
type CounterItem = {
  key: string
  label: string
  value: number
  icon: React.ReactNode
  color: {
    bg: string
    text: string
    gradient: string
    glow: string
    border: string
  }
}

/* ---------------------------------- */
/* داده‌های استاتیک */
/* ---------------------------------- */
const COUNTER_DATA: CounterItem[] = [
  {
    key: 'questions',
    label: 'سوالات سراسری',
    value: 15247,
    icon: <FileText className="w-5 h-5" />,
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-200',
    },
  },
  {
    key: 'booklets',
    label: 'دفترچه‌های استخدامی',
    value: 3284,
    icon: <BookOpen className="w-5 h-5" />,
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-500/30',
      border: 'border-blue-200',
    },
  },
  {
    key: 'free',
    label: 'منابع رایگان',
    value: 892,
    icon: <Sparkles className="w-5 h-5" />,
    color: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      gradient: 'from-purple-500 to-pink-600',
      glow: 'shadow-purple-500/30',
      border: 'border-purple-200',
    },
  },
]

/* ---------------------------------- */
/* ✅ کامپوننت تک رقم با انیمیشن واقعی Flip Clock */
/* ---------------------------------- */
function FlipDigit({
  digit,
  delay = 0,
  animate = true,
}: {
  digit: string
  delay?: number
  animate?: boolean
}) {
  const [displayDigit, setDisplayDigit] = useState(animate ? '0' : digit)
  const [previousDigit, setPreviousDigit] = useState(animate ? '0' : digit)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (!animate) {
      setDisplayDigit(digit)
      return
    }

    const timer = setTimeout(() => {
      if (digit !== displayDigit) {
        setPreviousDigit(displayDigit)
        setIsFlipping(true)

        // پس از اتمام نیمه اول انیمیشن، عدد جدید جا می‌افتد
        const flipEndTimer = setTimeout(() => {
          setDisplayDigit(digit)
          setIsFlipping(false)
        }, 600)

        return () => clearTimeout(flipEndTimer)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [digit, delay, animate, displayDigit])

  return (
    <div className="relative w-7 h-10 sm:w-9 sm:h-12 md:w-10 md:h-14 perspective-500 font-mono select-none">
      <div className="relative w-full h-full text-white font-bold text-xl sm:text-2xl md:text-3xl rounded-lg shadow-md bg-slate-900 border border-slate-700/80 overflow-hidden">
        
        {/* ۱. نیمه بالایی ثابت (عدد جدید) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-slate-900 border-b border-slate-950/60 flex items-end justify-center">
          <span className="translate-y-1/2 leading-none">{displayDigit}</span>
        </div>

        {/* ۲. نیمه پایینی ثابت (عدد قدیمی) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-slate-900 flex items-start justify-center">
          <span className="-translate-y-1/2 leading-none">{previousDigit}</span>
        </div>

        {/* ۳. ورقی که از بالا به پایین فلیپ می‌خورد (نیمه بالایی عدد قدیمی) */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-slate-900 border-b border-slate-950/60 flex items-end justify-center origin-bottom z-10 backface-hidden ${
            isFlipping ? 'animate-flip-top' : 'hidden'
          }`}
        >
          <span className="translate-y-1/2 leading-none">{previousDigit}</span>
        </div>

        {/* ۴. ورقی که از بالا روی نیمه پایین می‌افتد (نیمه پایینی عدد جدید) */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-slate-900 flex items-start justify-center origin-top z-10 backface-hidden ${
            isFlipping ? 'animate-flip-bottom' : 'hidden'
          }`}
        >
          <span className="-translate-y-1/2 leading-none">{displayDigit}</span>
        </div>

        {/* خط شیار وسط کارت */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-950/80 z-20 pointer-events-none" />
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* ✅ کامپوننت شمارنده */
/* ---------------------------------- */
function FlipCounter({
  value,
  animate = true,
}: {
  value: number
  animate?: boolean
}) {
  const digits = value.toLocaleString('en-US').split('')

  return (
    <div className="flex items-center gap-1 sm:gap-1.5" dir="ltr">
      {digits.map((digit, index) => {
        if (digit === ',') {
          return (
            <span
              key={`sep-${index}`}
              className="text-slate-400 font-bold text-xl sm:text-2xl md:text-3xl mx-0.5 select-none"
            >
              ,
            </span>
          )
        }

        return (
          <FlipDigit
            key={`${index}-${digit}`}
            digit={digit}
            delay={index * 120} // تاخیر آبشاری برای رقمی شدن
            animate={animate}
          />
        )
      })}
    </div>
  )
}

/* ---------------------------------- */
/* ✅ کامپوننت اصلی */
/* ---------------------------------- */
export default function QCCShow() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="w-full py-8 sm:py-12">
      {/* keyframe‌های انیمیشن استاندارد FlipClock */}
      <style jsx global>{`
        .perspective-500 {
          perspective: 500px;
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @keyframes flip-top-anim {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-90deg);
          }
        }

        @keyframes flip-bottom-anim {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }

        .animate-flip-top {
          animation: flip-top-anim 0.3s ease-in forwards;
        }

        .animate-flip-bottom {
          animation: flip-bottom-anim 0.3s ease-out 0.3s forwards;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* هدر بخش */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs sm:text-sm font-semibold text-slate-600 mb-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            آمار لحظه‌ای
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            مرجع کامل آزمون‌های استخدامی
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            بیشترین تعداد سوالات و منابع استخدامی در یک پلتفرم
          </p>
        </div>

        {/* کارت‌های شمارنده */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {COUNTER_DATA.map((item) => (
            <div
              key={item.key}
              className={`group relative overflow-hidden bg-white rounded-2xl border ${item.color.border} shadow-sm hover:shadow-xl hover:${item.color.glow} transition-all duration-500 hover:-translate-y-1`}
            >
              {/* گرادیان پس‌زمینه */}
              <div
                className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${item.color.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative p-5 sm:p-6">
                {/* آیکون و عنوان */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 ${item.color.bg} ${item.color.text} rounded-xl shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-700">
                    {item.label}
                  </h3>
                </div>

                {/* شمارنده فلیپ */}
                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1">
                    <FlipCounter
                      value={item.value}
                      animate={isMounted}
                    />
                  </div>

                  {/* نشانگر فعال */}
                  <div
                    className={`flex items-center gap-1 px-2 py-1 ${item.color.bg} ${item.color.text} rounded-md shrink-0`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold">
                      فعال
                    </span>
                  </div>
                </div>
              </div>

              {/* نوار رنگی پایین کارت */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color.gradient}`}
              />
            </div>
          ))}
        </div>

        {/* فوتر */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <span className="text-emerald-400">●</span>
            <span>
              مجموع:{' '}
              {COUNTER_DATA.reduce((sum, item) => sum + item.value, 0).toLocaleString('fa-IR')}{' '}
              منبع آموزشی
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}