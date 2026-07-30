'use client'

import React, { useRef, useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

export type CategoryChild = {
  id: string
  catName: string
  catSlug: string
  imageUrl?: string | null
  badges?: string[]
}

export type ParentCategory = {
  id: string
  catName: string
  catSlug: string
  imageUrl?: string | null
  children: CategoryChild[]
}

type MainTab = 'questions' | 'booklets' | 'free'

type TabHomePageProps = {
  initialData?: ParentCategory[]
}

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

function CategoryBadges({ badges }: { badges?: string[] }) {
  if (!badges?.length) return null
  const colors: Record<string, string> = {
    'درسنامه': 'bg-rose-100 text-rose-700 border-rose-200',
    'تست': 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return (
    <div className="flex gap-1 justify-center flex-wrap mb-1">
      {badges.map((b) => (
        <span
          key={b}
          className={`text-[8px] font-bold px-1 py-0.5 rounded-full border ${
            colors[b] ?? 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {b}
        </span>
      ))}
    </div>
  )
}

export default function TabHomePage({ initialData = [] }: TabHomePageProps) {
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
    if (swiperRef.current) swiperRef.current.update()
  }, [activeTab])

  const activeParent = initialData.find(
    (parent) =>
      parent.catSlug === tabToCategoryMap[activeTab] ||
      parent.catName === tabToCategoryMap[activeTab]
  )

  const currentCategories = activeParent?.children || []

  const handleTabChange = (tab: MainTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', tabToCategoryMap[tab])
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
      setSelectedCategory(null)
    })
  }

  const showArrows = currentCategories.length > 2

  const tabConfig: { key: MainTab; label: string; sub?: string }[] = [
    { key: 'questions', label: 'بانک سوالات', sub: '(درسنامه/تست)' },
    { key: 'booklets', label: 'دفترچه‌های استخدامی', sub: '(درسنامه/تست)' },
    { key: 'free', label: 'منابع رایگان' },
  ]

  // کارت کوچک‌تر: h-28 sm:h-32 md:h-36 به جای h-36 sm:h-40 md:h-44
  const cardClass = (extra = '') =>
    `relative w-full flex flex-col border-[#AF0F12] items-center justify-between p-2 sm:p-3 h-28 sm:h-32 md:h-36 bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-gray-400/50 ${extra}`

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-2.5 sm:p-4 font-sans">
      {/* Tab Bar */}
      <div className="flex flex-wrap items-stretch justify-start gap-1.5 sm:gap-2 relative z-10 -mb-[1px]">
        {tabConfig.map(({ key, label, sub }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex-1 sm:flex-none min-w-0 basis-[30%] sm:basis-auto min-h-[56px] sm:min-h-[34px] flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-3 text-xs sm:text-sm font-semibold rounded-t transition-all duration-200 border truncate ${
              activeTab === key
                ? 'bg-[#FCE3E8] text-rose-950 border-[#AF0F12] border-b-[#FCE3E8] relative z-20'
                : 'bg-white/80 text-gray-800 border-[#BEBABA] border-b-[#AF0F12] hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <span className="whitespace-nowrap text-xs sm:text-sm">{label}</span>
            {sub && <span className="hidden sm:inline text-[10px] sm:text-xs opacity-80 mt-0.5">{sub}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content Box */}
      <div
        className={`bg-[#FCE3E8] border border-[#AF0F12] p-3 sm:p-6 shadow-sm relative z-0 overflow-hidden ${
          activeTab === 'questions' ? 'rounded-b-xl' : ''
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 z-30 bg-[#FCE3E8]/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 transition-all duration-200">
            <DotsLoader />
            <span className="text-xs font-semibold text-rose-950">در حال دریافت اطلاعات...</span>
          </div>
        )}

        <div className="relative min-h-[110px]">
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

          {currentCategories.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-rose-900 text-sm font-medium">
              هیچ زیر‌دسته‌ای برای این بخش یافت نشد.
            </div>
          ) : !isSwiperMounted ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3 w-full">
              {currentCategories.slice(0, 6).map((item, index) => (
                <div key={item.id} className={cardClass(index >= 2 ? 'hidden md:flex' : 'flex')}>
                  <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded-bl">
                    درسنامه تست
                  </span>
                  <CategoryBadges badges={item.badges} />
                  <div className="flex-1 relative flex items-center justify-center p-1.5 rounded-lg bg-rose-50/60 w-full my-1 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.catName}
                        fill
                        className="object-contain p-1"
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">
                    {item.catName}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[FreeMode, Navigation]}
              freeMode
              dir="rtl"
              observer
              observeParents
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              slidesPerView={3}
              spaceBetween={8}
              breakpoints={{
                480: { slidesPerView: 2.5, spaceBetween: 10 },
                640: { slidesPerView: 3.5, spaceBetween: 12 },
                768: { slidesPerView: Math.min(currentCategories.length, 6), spaceBetween: 12 },
              }}
              className="w-full !px-1"
            >
              {currentCategories.map((item) => {
                const isSelected = selectedCategory === item.id
                return (
                  <SwiperSlide key={item.id}>
                    <button
                      onClick={() => setSelectedCategory(item.id)}
                      className={cardClass(
                        isSelected
                          ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                          : 'border-[#AF0F12]'
                      )}
                    >
                      <span className="absolute top-1.5 left-1.5 z-20 bg-rose-600 text-white text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded-bl">
                        درسنامه / تست
                      </span>
                      <CategoryBadges badges={item.badges} />
                      <div className="flex-1 relative flex items-center justify-center p-1.5 rounded-lg w-full my-1 overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.catName}
                            fill
                            className="object-contain p-1"
                            sizes="(max-width: 768px) 50vw, 16vw"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">
                        {item.catName}
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
