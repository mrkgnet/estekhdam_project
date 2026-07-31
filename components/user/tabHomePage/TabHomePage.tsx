'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import SearchBox from '../search/SearchBox'

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

async function fetchCategories(): Promise<ParentCategory[]> {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error('خطا در دریافت اطلاعات')
  return res.json()
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
  if (!badges?.length) return <div className="min-h-[16px] sm:min-h-[20px] mb-1 w-full" />
  const colors: Record<string, string> = {
    'درسنامه': 'bg-rose-100 text-rose-700 border-rose-200',
    'تست': 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return (
    <div className="flex gap-1 justify-center flex-wrap mb-1 min-h-[16px] sm:min-h-[20px]">
      {badges.map((b) => (
        <span
          key={b}
          className={`text-[8px] font-bold px-1 py-0.5 rounded-full border ${colors[b] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
          {b}
        </span>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="relative w-full flex flex-col border-[#AF0F12]/20 items-center justify-between p-2 sm:p-3 h-28 sm:h-32 md:h-36 bg-white rounded-xl border">
      <div className="absolute top-1.5 left-1.5 z-20 w-12 sm:w-14 h-3.5 sm:h-4 skeleton-wave rounded-bl" />
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 my-auto flex-shrink-0">
        <div className="w-7 h-7 sm:w-10 sm:h-10 skeleton-wave rounded-md" />
      </div>
      <div className="w-full flex flex-col items-center gap-1.5 mt-auto">
        <div className="w-10/12 h-2 sm:h-2.5 skeleton-wave rounded-sm" />
        <div className="w-7/12 h-2 sm:h-2.5 skeleton-wave rounded-sm" />
      </div>
    </div>
  )
}

const SKELETON_COUNTS = { lg: 2 }

function TabSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 w-full !px-1 py-1">
      {Array.from({ length: SKELETON_COUNTS.lg }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default function TabHomePage({ initialData = [] }: TabHomePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const swiperRef = useRef<SwiperType | null>(null)
  
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

  const { data: categories = initialData, isFetching } = useQuery<ParentCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    initialData: initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const isTabChanging = activeTabKey !== null && activeTabKey !== activeTab

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.update()
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

  const showArrows = currentCategories.length > 2
  const showSkeleton = !isMounted || isTabChanging

  const tabConfig: { key: MainTab; label: string; sub?: string }[] = [
    { key: 'questions', label: 'بانک سوالات', sub: '(درسنامه/تست)' },
    { key: 'booklets', label: 'دفترچه‌های استخدامی', sub: '(درسنامه/تست)' },
    { key: 'free', label: 'منابع رایگان' },
  ]

  const cardClass = (extra = '') =>
    `relative w-full flex flex-col border-[#AF0F12] items-center justify-between p-2 sm:p-3 h-28 sm:h-32 md:h-36 bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-gray-400/50 ${extra}`

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-2.5 sm:p-4 font-sans">
      {/* تعریف انیمیشن موجی در بالاترین سطح کامپوننت تا همه جا اعمال شود */}
      <style>{`
        @keyframes skeleton-wave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-wave {
          background-color: #e5e7eb;
          background-image: linear-gradient(90deg, #e5e7eb 25%, #f9fafb 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: skeleton-wave 1.5s infinite linear;
        }
      `}</style>

      {/* هدر متنی با قابلیت نمایش اسکلتون */}
      <div className="text-center mb-6 flex flex-col items-center gap-1.5">
        {!isMounted ? (
          <>
            <div className="h-7 sm:h-9 w-10/12 sm:w-2/3 md:w-1/2 skeleton-wave rounded-lg mb-1"></div>
            <div className="h-6 sm:h-7 w-48 sm:w-56 skeleton-wave rounded-full mt-1"></div>
          </>
        ) : (
          <>
            <h1 className="text-lg sm:text-3xl font-medium text-gray-900 tracking-tight">
              اولین وب سایت تخصصی در زمینه استخدامی های دولتی
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-700 bg-blue-100/70 px-3 py-0.5 rounded-full border border-rose-200/80">
              درسنامه و تست به صورت آنلاین
            </p>
          </>
        )}
      </div>

      {/* باکس جستجو با اسکلتون اختصاصی تا قبل از لود کامل */}
      <div className="relative mx-2 w-full flex justify-center mb-10 z-50 px-4">
        <div className="w-full max-w-[650px] [&>div]:!static [&>div]:!p-0 [&>div]:!shadow-none [&>div]:!bg-transparent [&>div]:!border-none">
          {!isMounted ? (
            <div className="w-full h-14 skeleton-wave rounded-xl border border-gray-200"></div>
          ) : (
            <SearchBox
              popularCategories={popularCategories}
              isMobileSearchOpen={true}
              onCloseMobile={() => {}}
            />
          )}
        </div>
      </div>

      {/* تب‌ها: نمایش ثابت تب‌ها بدون لودر/اسکلتون از همان لحظه اول */}
      <div className="flex flex-wrap items-stretch justify-start gap-1.5 sm:gap-2 relative z-10 -mb-[1.4px]">
        {tabConfig.map(({ key, label, sub }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex-1 sm:flex-none min-w-0 basis-[30%] sm:basis-auto min-h-[56px] sm:min-h-[34px] flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-3 text-xs sm:text-sm font-semibold rounded-t transition-all duration-200 border-2 truncate ${
              activeTab === key
                ? 'bg-[#FCE3E8] text-rose-950 border-[#AF0F12] !border-b-[#FCE3E8] relative z-20'
                : 'bg-white/80 text-gray-800 border-[#BEBABA] border-b-[#AF0F12] hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <span className="whitespace-nowrap text-xs sm:text-sm">{label}</span>
            {sub && <span className="hidden sm:inline text-[10px] sm:text-xs opacity-80 mt-0.5">{sub}</span>}
          </button>
        ))}
      </div>

      {/* کانتنت اصلی (باکس صورتی رنگ) */}
      <div className="bg-[#FCE3E8] border-[#AF0F12] border-2 p-3 sm:p-6 shadow-sm relative z-0 overflow-hidden rounded-b-xl">
        {isFetching && !isTabChanging && (
          <div className="absolute inset-0 z-30 bg-[#FCE3E8]/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 transition-all duration-200">
            <DotsLoader />
            <span className="text-xs font-semibold text-rose-950">در حال دریافت اطلاعات...</span>
          </div>
        )}

        <div className="relative min-h-[110px]">
          {showArrows && !showSkeleton && (
            <>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="قبلی"
                className="flex absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 z-20 w-7 h-9 sm:w-9 sm:h-12 items-center justify-center rounded bg-white border border-slate-400 shadow-md hover:bg-rose-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="بعدی"
                className="flex absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 z-20 w-7 h-9 sm:w-9 sm:h-12 items-center justify-center rounded bg-white border border-slate-400 shadow-md hover:bg-rose-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700" />
              </button>
            </>
          )}

          {showSkeleton ? (
            <TabSkeletonGrid />
          ) : currentCategories.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-rose-900 text-sm font-medium">
              هیچ زیر‌دسته‌ای برای این بخش یافت نشد.
            </div>
          ) : (
            <div className="w-full">
              <Swiper
                key={activeTab}
                modules={[FreeMode, Navigation]}
                freeMode
                dir="rtl"
                observer
                observeParents
                resizeObserver
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                slidesPerView={2}
                spaceBetween={8}
                breakpoints={{
                  640: { slidesPerView: 3, spaceBetween: 10 },
                  768: { slidesPerView: 4, spaceBetween: 12 },
                  1024: { slidesPerView: 6, spaceBetween: 12 },
                }}
                className="w-full !px-1 py-1"
              >
                {currentCategories.map((item) => {
                  const categorySlug = item.catSlug || item.catName
                  return (
                    <SwiperSlide key={item.id} className="!h-auto">
                      <Link
                        href={`/resources/main-resource?category=${encodeURIComponent(categorySlug)}`}
                        className={cardClass()}
                      >
                        <span className="absolute top-1.5 left-1.5 z-20 bg-rose-600 text-white text-[10px] sm:text-[8px] font-bold px-1 py-0.5 rounded-bl">
                          درسنامه / تست
                        </span>
                        <CategoryBadges badges={item.badges} />
                        <div className="relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 my-auto flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.catName}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 40px, 56px"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
                          )}
                        </div>
                        <span className="text-12 sm:text-13 font-bold text-gray-800 text-center leading-tight line-clamp-2 mt-auto w-full">
                          {item.catName}
                        </span>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}