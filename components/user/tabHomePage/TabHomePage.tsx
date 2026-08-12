'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, BookOpen, Layers, Sparkles, Folder } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SearchBox from '../search/SearchBox'
import SearchBoxInPage from '../search/SearchBoxInPage'

export type CategoryChild = {
  id: string
  catName: string
  catSlug: string
  imageUrl?: string | null
  description?: string | null
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

async function fetchCategories(): Promise<ParentCategory[]> {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error('خطا در دریافت اطلاعات')
  return res.json()
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full flex flex-col justify-between p-4 sm:p-5  sm:pt-9 sm:h-60 bg-white rounded-2xl border border-gray-200/100 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* ✅ تصویر بزرگ‌تر در اسکلتون */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 skeleton-wave rounded-2xl shrink-0" />
        <div className="w-1/2 h-4 sm:h-5 skeleton-wave rounded-md" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="w-full h-3 sm:h-3.5 skeleton-wave rounded-sm" />
        <div className="w-3/4 h-3 sm:h-3.5 skeleton-wave rounded-sm" />
      </div>
    </div>
  )
}

function TabSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} className={i > 0 ? 'hidden sm:flex' : ''} />
      ))}
    </div>
  )
}

export default function TabHomePage({ initialData = [] }: TabHomePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const swiperRef = useRef<SwiperType | null>(null)
  const tabSwiperRef = useRef<SwiperType | null>(null)

  const [isMounted, setIsMounted] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState<MainTab | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tabToCategoryMap: Record<MainTab, string> = {
    questions: 'بانک-سوالات',
    booklets: 'دفترچه-های-استخدامی',
    free: 'منابع-رایگان',
  }

  const currentCategoryQuery = searchParams.get('category') || 'بانک-سوالات'
  const activeTab: MainTab =
    (Object.keys(tabToCategoryMap) as MainTab[]).find(
      (key) => tabToCategoryMap[key] === currentCategoryQuery
    ) || 'questions'

  const { data: categories = initialData } = useQuery<ParentCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    initialData: initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const isTabChanging = activeTabKey !== null && activeTabKey !== activeTab

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update()
      swiperRef.current.slideTo(0)
    }
    setActiveTabKey(null)
  }, [activeTab])

  const activeParent = categories.find(
    (parent) =>
      parent.catSlug === tabToCategoryMap[activeTab] ||
      parent.catName === tabToCategoryMap[activeTab]
  )

  const currentCategories = activeParent?.children || []
  const popularCategories = categories.slice(0, 5)

  const handleTabChange = (tab: MainTab) => {
    if (tab === activeTab) return
    setActiveTabKey(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', tabToCategoryMap[tab])
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const showSkeleton = !isMounted || isTabChanging

  const tabConfig: { key: MainTab; label: string; icon: React.ReactNode }[] = [
    { key: 'questions', label: 'بانک سوالات تخصصی', icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { key: 'booklets', label: 'دفترچه‌های استخدامی', icon: <Layers className="w-4 h-4 shrink-0" /> },
    { key: 'free', label: 'منابع و جزوات رایگان', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
  ]

  const bgColors = [
    { bg: 'bg-amber-50 text-amber-600' },
    { bg: 'bg-blue-50 text-blue-600' },
    { bg: 'bg-purple-50 text-purple-600' },
    { bg: 'bg-emerald-50 text-emerald-600' },
    { bg: 'bg-rose-50 text-rose-600' },
    { bg: 'bg-indigo-50 text-indigo-600' },
  ]

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 font-sans overflow-hidden">
      <style>{`
        @keyframes skeleton-wave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-wave {
          background-color: #cbd5e1;
          background-image: linear-gradient(90deg, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%);
          background-size: 200% 100%;
          animation: skeleton-wave 1.5s infinite linear;
        }

        .cards-pagination .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background-color: #cbd5e1;
          opacity: 1;
          margin: 0 3px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .cards-pagination .swiper-pagination-bullet:hover {
          background-color: #94a3b8;
        }
        .cards-pagination .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #0f172a, #334155);
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center gap-1.5 sm:gap-2">
        <h1 className="text-xl sm:text-4xl font-bold sm:font-semibold text-slate-900 tracking-tight">
          مرجع آزمون‌های استخدامی کشور
        </h1>
        <p className="text-xs sm:text-base text-slate-500 max-w-xl px-2">
          دسترسی به جامع‌ترین بانک سوالات، دفترچه‌های آزمون و درسنامه‌های تفکیک‌شده
        </p>
      </div>

      {/* Search Box Container */}
      <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10 px-1">
        {!isMounted ? (
          <div className="w-full h-12 sm:h-14 skeleton-wave rounded-2xl border border-gray-200"></div>
        ) : (
          <div className="w-full relative z-30">
            <SearchBoxInPage
              popularCategories={popularCategories}
              isMobileSearchOpen={true}
              onCloseMobile={() => {}}
            />
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="relative mb-6 sm:mb-8 border-b border-gray-200/100 px-7 sm:pb-4 sm:px-8">
        <button
          type="button"
          onClick={() => tabSwiperRef.current?.slidePrev()}
          aria-label="تب قبلی"
          className="flex absolute top-1/2 -translate-y-1/2 right-0 sm:right-1 z-20 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-slate-600 transition-all sm:hidden"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => tabSwiperRef.current?.slideNext()}
          aria-label="تب بعدی"
          className="flex absolute top-1/2 -translate-y-1/2 left-0 sm:left-1 z-20 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-slate-600 transition-all sm:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <Swiper
          modules={[FreeMode, Navigation]}
          freeMode={{ enabled: true, momentumBounce: false }}
          dir="rtl"
          slidesPerView="auto"
          spaceBetween={8}
          wrapperClass="sm:!justify-center"
          onSwiper={(swiper) => {
            tabSwiperRef.current = swiper
          }}
          className="w-full"
        >
          {tabConfig.map(({ key, label, icon }) => (
            <SwiperSlide key={key} className="!w-auto">
              <button
                type="button"
                onClick={() => handleTabChange(key)}
                className={`flex items-center mb-3 md:mb-2 gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-13 sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-gray-100/80 border border-slate-500 text-slate-600 hover:bg-gray-200/70 hover:text-slate-900'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Cards Swiper Area */}
      <div className="relative min-h-[230px] sm:min-h-[260px]">
        {showSkeleton ? (
          <TabSkeletonGrid />
        ) : currentCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-slate-400 text-xs sm:text-sm">
            <Folder className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5] mb-2" />
            <span>هیچ زیر‌دسته‌ای در این بخش یافت نشد.</span>
          </div>
        ) : (
          <div className="relative px-2 sm:px-4">
            {currentCategories.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="قبلی"
                  className="flex absolute top-1/2 -translate-y-3/4 -right-1 sm:-right-3 z-20 w-8 h-10 sm:w-10 sm:h-12 items-center justify-center rounded bg-white border border-gray-300 shadow-md hover:bg-gray-50 text-slate-700 transition-all"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="بعدی"
                  className="flex absolute top-1/2 -translate-y-3/4 -left-1 sm:-left-3 z-20 w-8 h-10 sm:w-10 sm:h-12 items-center justify-center rounded bg-white border border-gray-300 shadow-md hover:bg-gray-50 text-slate-700 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            <Swiper
              key={activeTab}
              modules={[FreeMode, Navigation, Pagination]}
              freeMode={{ enabled: true, momentumBounce: false }}
              dir="rtl"
              observer
              observeParents
              resizeObserver
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              slidesPerView={1}
              spaceBetween={10}
              pagination={
                currentCategories.length > 1
                  ? { clickable: true, el: '.cards-pagination' }
                  : false
              }
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 14 },
                1024: { slidesPerView: 3, spaceBetween: 16 },
                1280: { slidesPerView: 3, spaceBetween: 16 },
              }}
              className="w-full !py-2"
            >
              {currentCategories.map((item, index) => {
                const categorySlug = item.catSlug || item.catName
                const colorTheme = bgColors[index % bgColors.length]

                return (
                  <SwiperSlide key={item.id} className="!h-auto">
                    <Link
                      href={`/resources/main-resource?category=${encodeURIComponent(categorySlug)}`}
                      className="group relative overflow-hidden flex flex-col justify-between p-4 sm:p-5 sm:pt-9  sm:h-52 bg-white border border-gray-400 rounded-2xl transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                    >
                      {/* Ribbon */}
                      <span className="pointer-events-none absolute top-4 -left-8 z-10 rotate-[-45deg] bg-red-600 text-white text-[11px] sm:text-[12px] font-bold px-8 py-1 shadow-sm">
                        درسنامه / تست
                      </span>

                      <div>
                        {/* Header: Image + Title */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          {/* ✅ تصویر بزرگ‌تر */}
                          <div
                            className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shrink-0 ${colorTheme.bg}`}
                          >
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.catName}
                                fill
                                className="object-contain p-3 sm:p-4"
                                sizes="(max-width: 640px) 80px, 96px"
                              />
                            ) : (
                              <Folder className="w-9 h-9 sm:w-11 sm:h-11" />
                            )}
                          </div>

                          <h3 className="text-14 md:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-6 flex-1">
                            {item.catName}
                          </h3>
                        </div>

                        {/* Body Description */}
                        <p className="text-[13px] sm:text-sm font-bold text-slate-500 leading-relaxed line-clamp-2">
                          {item.description || 'مجموعه سوالات و درسنامه‌های اختصاصی آزمون‌های استخدامی مربوطه.'}
                        </p>
                      </div>

                      {/* Footer Badges */}
                      <div className="flex items-center gap-1.5 pt-3 flex-wrap">
                        {item.badges?.map((badge) => (
                          <span
                            key={badge}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-blue-50 text-blue-700"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>

            {currentCategories.length > 1 && (
              <div className="cards-pagination flex items-center justify-center gap-1 mt-4 sm:mt-5" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}