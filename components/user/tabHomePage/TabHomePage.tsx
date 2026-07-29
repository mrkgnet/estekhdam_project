'use client'

import React, { useRef, useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

type Category = {
  id: string
  title: string
  icon: React.ReactNode
}

type MainTab = 'questions' | 'booklets' | 'free'

function DotsLoader() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.6s' }}
        />
      ))}
    </div>
  )
}

export default function TabHomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const swiperRef = useRef<SwiperType | null>(null)
  const [isSwiperMounted, setIsSwiperMounted] = useState(false)

  useEffect(() => {
    setIsSwiperMounted(true)
  }, [])

  const tabToCategoryMap: Record<MainTab, string> = {
    questions: 'بانک-سوالات',
    booklets: 'دفترچه-های-استخدامی',
    free: 'free-resources',
  }

  const currentCategoryQuery = searchParams.get('category') || 'بانک-سوالات'
  const activeTab: MainTab =
    (Object.keys(tabToCategoryMap) as MainTab[]).find(
      (key) => tabToCategoryMap[key] === currentCategoryQuery
    ) || 'questions'

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update()
    }
  }, [activeTab])

  const categoriesData: Record<MainTab, Category[]> = {
    questions: [
      {
        id: 'q-banks',
        title: 'بانک سوالات بانک‌ها',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-3 7 3" />
            <path d="M4 10v11" /><path d="M20 10v11" />
            <path d="M8 14v3" /><path d="M12 14v3" /><path d="M16 14v3" />
          </svg>
        ),
      },
      {
        id: 'q-med',
        title: 'بانک سوالات وزارت بهداشت',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
            <path d="M9 12l-5 5" /><path d="M12 9l5-5" />
          </svg>
        ),
      },
      {
        id: 'q-edu',
        title: 'بانک سوالات آموزش و پرورش',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" /><path d="M8 11h8" />
          </svg>
        ),
      },
      {
        id: 'q-gov',
        title: 'بانک سوالات دستگاه‌های دولتی',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        id: 'q-army',
        title: 'بانک سوالات نیروهای مسلح',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
      {
        id: 'q-oil',
        title: 'بانک سوالات نفت و پتروشیمی',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        ),
      },
    ],
    booklets: [
      {
        id: 'b-banks',
        title: 'دفترچه‌های استخدامی بانک‌ها',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: 'b-edu',
        title: 'دفترچه‌های استخدامی آموزش و پرورش',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        ),
      },
    ],
    free: [
      {
        id: 'f-banks',
        title: 'منابع رایگان بانک‌ها',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        id: 'f-edu',
        title: 'منابع رایگان آموزش و پرورش',
        icon: (
          <svg className="w-6 h-6 stroke-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        ),
      },
    ],
  }

  const handleTabChange = (tab: MainTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', tabToCategoryMap[tab])
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
      setSelectedCategory(null)
    })
  }

  const currentCategories = categoriesData[activeTab]
  const showArrows = currentCategories.length > 3

  const tabConfig: { key: MainTab; label: string; sub?: string }[] = [
    { key: 'questions', label: 'بانک سوالات', sub: '(درسنامه/تست)' },
    { key: 'booklets', label: 'دفترچه‌های استخدامی', sub: '(درسنامه/تست)' },
    { key: 'free', label: 'منابع رایگان' },
  ]

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-2.5 sm:p-4 font-sans">
      {/* Tab Bar */}
      <div className="flex flex-wrap items-stretch justify-start gap-1.5 sm:gap-2 relative z-10 -mb-[1px]">
        {tabConfig.map(({ key, label, sub }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex-1 sm:flex-none min-w-0 basis-[30%] sm:basis-auto min-h-[56px] sm:min-h-[34px] flex flex-col items-center justify-center px-4 sm:px-4 py-3 sm:py-2 text-[11px] xs:text-xs sm:text-sm font-semibold rounded-t transition-all duration-200 border truncate ${
              activeTab === key
                ? 'bg-[#FCE3E8] text-rose-950 border-[#AF0F12] border-b-[#FCE3E8] relative z-20'
                : 'bg-white/80 text-gray-800 border-[#BEBABA] border-b-[#AF0F12] hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <span className="whitespace-nowrap text-12 sm:text-14">{label}</span>
            {sub && <span className="hidden sm:inline text-[10px] sm:text-xs opacity-80 mt-0.5">{sub}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content Box */}
      <div
        className={`bg-[#FCE3E8] border border-[#AF0F12] p-3 sm:p-6 shadow-sm relative z-0 overflow-hidden ${
          activeTab === 'questions' ? 'rounded-b-xl ' : ''
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 z-30 bg-[#FCE3E8]/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 transition-all duration-200">
            <DotsLoader />
            <span className="text-xs font-semibold text-rose-950">
              در حال دریافت اطلاعات...
            </span>
          </div>
        )}

        <div className="relative min-h-[100px]">
          {showArrows && (
            <>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="قبلی"
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 z-20 w-9 h-9 items-center justify-center rounded-full bg-white border border-rose-300 shadow-md hover:bg-rose-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-rose-700" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="بعدی"
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 z-20 w-9 h-9 items-center justify-center rounded-full bg-white border border-rose-300 shadow-md hover:bg-rose-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-rose-700" />
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="قبلی"
                className="md:hidden absolute top-1/2 -translate-y-1/2 -right-1 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-rose-300 shadow-sm active:scale-95 transition-transform"
              >
                <ChevronRight className="w-4 h-4 text-rose-700" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="بعدی"
                className="md:hidden absolute top-1/2 -translate-y-1/2 -left-1 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-rose-300 shadow-sm active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-4 h-4 text-rose-700" />
              </button>
            </>
          )}

          {!isSwiperMounted ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 w-full">
              {currentCategories.slice(0, 6).map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col border-[#AF0F12] items-center justify-between p-2 sm:p-3.5 h-24 sm:h-28 md:h-32 bg-white rounded-xl border transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-400/50 ${
                    index >= 3 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-rose-50/60 w-full mb-1.5 sm:mb-2">
                    {item.icon}
                  </div>
                  <span className="text-[10px] sm:text-sm font-medium text-gray-800 text-center leading-tight line-clamp-2">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[FreeMode, Navigation]}
              freeMode
              dir="rtl"
              observer={true}
              observeParents={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              slidesPerView={3}
              spaceBetween={8}
              breakpoints={{
                480: { slidesPerView: 3.2, spaceBetween: 10 },
                768: {
                  slidesPerView: Math.min(currentCategories.length, 6),
                  spaceBetween: 12,
                },
              }}
              className="w-full !px-1"
            >
              {currentCategories.map((item) => {
                const isSelected = selectedCategory === item.id
                return (
                  <SwiperSlide key={item.id}>
                    <button
                      onClick={() => setSelectedCategory(item.id)}
                      className={`w-full flex flex-col border-[#AF0F12] items-center justify-between p-2 sm:p-3.5 h-24 sm:h-28 md:h-32 bg-white rounded-xl border transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-400/50 ${
                        isSelected
                          ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                          : 'border-[#AF0F12]'
                      }`}
                    >
                      <div className="flex-1 flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-rose-50/60 w-full mb-1.5 sm:mb-2">
                        {item.icon}
                      </div>
                      <span className=" text-12 sm:text-14 font-medium text-gray-800 text-center leading-tight line-clamp-2">
                        {item.title}
                      </span>
                    </button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  )
}
