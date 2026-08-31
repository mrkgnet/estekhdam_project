
'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  Folder,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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

  if (!res.ok) {
    throw new Error('خطا در دریافت اطلاعات')
  }

  return res.json()
}

/* =========================================================
   SKELETON
========================================================= */

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        w-full
        flex
        flex-col
        justify-between
        p-2
        sm:p-4
        sm:pt-6
        min-h-[180px]
        sm:h-52
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-xs
        ${className}
      `}
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
        <div className="w-14 h-14 sm:w-20 sm:h-20 skeleton-wave rounded-2xl shrink-0" />

        <div className="w-3/4 sm:w-1/2 h-4 sm:h-5 skeleton-wave rounded-md" />
      </div>

      <div className="space-y-2 mt-3">
        <div className="w-full h-3 skeleton-wave rounded-sm" />
        <div className="w-3/4 h-3 skeleton-wave rounded-sm" />
      </div>
    </div>
  )
}

function TabSkeletonGrid() {
  return (
    <div
      className="
        grid
        grid-cols-3
        sm:grid-cols-3
        lg:grid-cols-3
        gap-2
        sm:gap-4
        w-full
      "
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TabHomePage({
  initialData = [],
}: TabHomePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const swiperRef = useRef<SwiperType | null>(null)
  const tabSwiperRef = useRef<SwiperType | null>(null)

  const [isMounted, setIsMounted] = useState(false)

  const [activeTabKey, setActiveTabKey] =
    useState<MainTab | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /* =========================================================
     TAB MAP
  ========================================================= */

  const tabToCategoryMap: Record<MainTab, string> = {
    questions: 'بانک-سوالات',
    booklets: 'دفترچه-های-استخدامی',
    free: 'منابع-رایگان',
  }

  /* =========================================================
     CURRENT TAB
  ========================================================= */

  const currentCategoryQuery =
    searchParams.get('category') || 'بانک-سوالات'

  const activeTab: MainTab =
    (Object.keys(tabToCategoryMap) as MainTab[]).find(
      (key) =>
        tabToCategoryMap[key] === currentCategoryQuery
    ) || 'questions'

  /* =========================================================
     DATA
  ========================================================= */

  const { data: categories = initialData } =
    useQuery<ParentCategory[]>({
      queryKey: ['categories'],
      queryFn: fetchCategories,
      initialData:
        initialData.length > 0
          ? initialData
          : undefined,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    })

  const isTabChanging =
    activeTabKey !== null &&
    activeTabKey !== activeTab

  /* =========================================================
     RESET SWIPER
  ========================================================= */

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update()
      swiperRef.current.slideTo(0)
    }

    setActiveTabKey(null)
  }, [activeTab])

  /* =========================================================
     ACTIVE CATEGORY
  ========================================================= */

  const activeParent = categories.find(
    (parent) =>
      parent.catSlug ===
        tabToCategoryMap[activeTab] ||
      parent.catName ===
        tabToCategoryMap[activeTab]
  )

  const currentCategories =
    activeParent?.children || []

  const popularCategories = categories.slice(0, 5)

  /* =========================================================
     TAB CHANGE
  ========================================================= */

  const handleTabChange = (tab: MainTab) => {
    if (tab === activeTab) return

    setActiveTabKey(tab)

    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set(
      'category',
      tabToCategoryMap[tab]
    )

    router.push(`?${params.toString()}`, {
      scroll: false,
    })
  }

  const showSkeleton =
    !isMounted || isTabChanging

  /* =========================================================
     TAB CONFIG
  ========================================================= */

  const tabConfig: {
    key: MainTab
    label: string
    description: string
    icon: React.ReactNode
  }[] = [
    {
      key: 'questions',
      label: 'بانک سوالات ',
      description:
        'دسته‌بندی سوالات تخصصی آزمون‌های استخدامی',
      icon: (
        <BookOpen className="w-[19px] h-[19px]" />
      ),
    },
    {
      key: 'booklets',
      label: 'دفترچه‌های استخدامی',
      description:
        'دفترچه‌ها و نمونه آزمون‌های استخدامی',
      icon: (
        <Layers className="w-[19px] h-[19px]" />
      ),
    },
    {
      key: 'free',
      label: ' رایگان',
      description:
        'منابع آموزشی و جزوات رایگان',
      icon: (
        <Sparkles className="w-[19px] h-[19px]" />
      ),
    },
  ]

  /* =========================================================
     CARD COLORS
  ========================================================= */

  const bgColors = [
    'bg-amber-50 text-amber-600',
    'bg-blue-50 text-blue-600',
    'bg-purple-50 text-purple-600',
    'bg-emerald-50 text-emerald-600',
    'bg-rose-50 text-rose-600',
    'bg-indigo-50 text-indigo-600',
  ]

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      dir="rtl"
      className="
        w-full
       
        mx-auto
        px-3
        sm:px-4
        py-6
        sm:py-8
        font-sans
        overflow-hidden
      "
    >
      <style>{`
        /* =====================================================
           SKELETON
        ===================================================== */

        @keyframes skeleton-wave {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-wave {
          background-color: #cbd5e1;

          background-image:
            linear-gradient(
              90deg,
              #cbd5e1 25%,
              #e2e8f0 50%,
              #cbd5e1 75%
            );

          background-size: 200% 100%;

          animation:
            skeleton-wave 1.5s infinite linear;
        }

        /* =====================================================
           PAGINATION
        ===================================================== */

        .cards-pagination
          .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background-color: #cbd5e1;
          opacity: 1;
          margin: 0 3px !important;

          transition:
            width 0.2s ease,
            background-color 0.2s ease;

          cursor: pointer;
        }

        .cards-pagination
          .swiper-pagination-bullet:hover {
          background-color: #94a3b8;
        }

        .cards-pagination
          .swiper-pagination-bullet-active {
          width: 22px;
          background: #0f172a;
          border-radius: 9999px;
        }

        /* =====================================================
           TAB SYSTEM
        ===================================================== */

        .tab-navigation-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tab-navigation-scroll::-webkit-scrollbar {
          display: none;
        }

        /* =====================================================
           TAB BUTTON
        ===================================================== */

        .creative-tab {
          position: relative;
          min-height: 54px;

          display: inline-flex;
          align-items: center;

          gap: 10px;
          padding: 0 18px;

          background: #ffffff;

          border: 1px solid #dbe1e8;
          border-bottom-color: #cbd5e1;

          border-radius: 12px 12px 0 0;

          color: #64748b;

          font-size: 14px;
          font-weight: 500;

          white-space: nowrap;

          transition:
            background-color 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .creative-tab:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .creative-tab:focus-visible {
          outline: none;

          box-shadow:
            0 0 0 3px
            rgba(15, 118, 110, 0.13);
        }

        /* =====================================================
           ACTIVE TAB
        ===================================================== */

        .creative-tab-active {
          z-index: 5;

          color: #0f172a;

          border-color: #cbd5e1;
          border-bottom-color: #ffffff;

          background: #ffffff;

          font-weight: 700;

          box-shadow:
            0 -1px 3px
            rgba(15, 23, 42, 0.02);
        }

        .creative-tab-active::after {
          content: '';

          position: absolute;

          left: 10px;
          right: 10px;
          bottom: -1px;

          height: 3px;

          border-radius: 999px 999px 0 0;

          background: #0f172a;
        }

        /* =====================================================
           TAB ICON
        ===================================================== */

        .creative-tab-icon {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #f1f5f9;
          color: #64748b;

          transition:
            background-color 0.18s ease,
            color 0.18s ease;
        }

        .creative-tab-active
          .creative-tab-icon {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* =====================================================
           TAB CONTENT FRAME
        ===================================================== */

        .tab-content-frame {
          position: relative;

          border: 1px solid #cbd5e1;

          border-radius: 12px;

          background: #ffffff;

          padding: 18px;

          margin-top: -1px;

          box-shadow:
            0 1px 2px
            rgba(15, 23, 42, 0.03);
        }

        /* =====================================================
           CARDS SWIPER
        ===================================================== */

        .categories-swiper {
          width: 100%;
        }

        .categories-swiper
          .swiper-slide {
          height: auto;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 639px) {

          .creative-tab {
            min-height: 48px;

            padding: 0 13px;

            font-size: 13px;

            border-radius:
              10px 10px 0 0;

            gap: 7px;
          }

          .creative-tab-icon {
            width: 30px;
            height: 30px;

            border-radius: 8px;
          }

          .tab-content-frame {
            padding: 12px;

            border-radius: 10px;
          }

          .creative-tab-active::after {
            left: 8px;
            right: 8px;

            height: 2px;
          }

          /*
             کارت‌های موبایل:
             فضای بیشتر برای تصویر و عنوان
          */

          .mobile-category-card {
            min-height: 190px;
          }

          .mobile-category-image {
            width: 60px;
            height: 60px;
          }

          .mobile-category-title {
            font-size: 12px;
            line-height: 1.7;
          }

          .mobile-category-description {
            font-size: 9px;
            line-height: 1.7;
          }
        }

        /* =====================================================
           REDUCE MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .creative-tab {
            transition: none;
          }

          .creative-tab-icon {
            transition: none;
          }

          .skeleton-wave {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="text-center mb-12 sm:mb-16 my-4">
        <h1
          className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            lg:text-5xl
            font-black
            text-slate-900
            dark:text-slate-50
            mb-4
            tracking-tight
          "
        >
          مرجع کامل{' '}
          <span className="relative inline-block">
            <span
              className="
                relative
                z-10
                bg-gradient-to-r
                from-emerald-600
                to-teal-600
                bg-clip-text
                text-transparent
              "
            >
              آزمون‌های استخدامی
            </span>

            <svg
              className="
                absolute
                -bottom-2
                left-0
                w-full
              "
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C50 2 150 2 198 6"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="200"
                  y2="0"
                >
                  <stop stopColor="#10b981" />

                  <stop
                    offset="1"
                    stopColor="#0891b2"
                  />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p
          className="
            text-sm
            sm:text-base
            md:text-lg
            text-slate-600
            dark:text-slate-400
            max-w-2xl
            mx-auto
            leading-relaxed
          "
        >
          بزرگ‌ترین مجموعه سوالات و منابع استخدامی کشور
          با به‌روزرسانی مداوم
        </p>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div
        className="
          w-full
          max-w-2xl
          mx-auto
          mb-8
          sm:mb-10
          px-1
        "
      >
        {!isMounted ? (
          <div
            className="
              w-full
              h-12
              sm:h-14
              skeleton-wave
              rounded-2xl
              border
              border-gray-200
            "
          />
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

      {/* =====================================================
          CREATIVE TAB SECTION
      ===================================================== */}

      <section
        className="w-full"
        aria-label="دسته‌بندی منابع"
      >
        {/* ===================================================
            TAB HEADERS
        =================================================== */}

        <div className="relative">
          {/* Mobile Previous */}

          <button
            type="button"
            onClick={() =>
              tabSwiperRef.current?.slidePrev()
            }
            aria-label="تب قبلی"
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              z-30
              flex
              sm:hidden
              items-center
              justify-center
              w-8
              h-8
              rounded-lg
              bg-white
              border
              border-gray-200
              text-slate-600
              shadow-sm
              hover:bg-gray-50
              transition-colors
            "
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Mobile Next */}

          <button
            type="button"
            onClick={() =>
              tabSwiperRef.current?.slideNext()
            }
            aria-label="تب بعدی"
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              z-30
              flex
              sm:hidden
              items-center
              justify-center
              w-8
              h-8
              rounded-lg
              bg-white
              border
              border-gray-200
              text-slate-600
              shadow-sm
              hover:bg-gray-50
              transition-colors
            "
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="mx-9 sm:mx-0">
            <Swiper
              modules={[FreeMode]}
              freeMode={{
                enabled: true,
                momentumBounce: false,
              }}
              dir="rtl"
              slidesPerView="auto"
              spaceBetween={6}
              wrapperClass="sm:!justify-start"
              onSwiper={(swiper) => {
                tabSwiperRef.current = swiper
              }}
              className="
                tab-navigation-scroll
                !overflow-visible
              "
            >
              {tabConfig.map(
                ({
                  key,
                  label,
                  description,
                  icon,
                }) => {
                  const isActive =
                    activeTab === key

                  return (
                    <SwiperSlide
                      key={key}
                      className="!w-auto"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${key}`}
                        onClick={() =>
                          handleTabChange(key)
                        }
                        className={`
                          creative-tab
                          ${
                            isActive
                              ? 'creative-tab-active'
                              : ''
                          }
                        `}
                      >
                        <span
                          className="
                            creative-tab-icon
                            shrink-0
                          "
                        >
                          {icon}
                        </span>

                        <span
                          className="
                            flex
                            flex-col
                            items-start
                            justify-center
                            text-right
                          "
                        >
                          <span className="leading-5">
                            {label}
                          </span>

                          <span
                            className="
                              hidden
                              lg:block
                              text-[10px]
                              font-normal
                              text-slate-400
                              leading-4
                            "
                          >
                            {description}
                          </span>
                        </span>
                      </button>
                    </SwiperSlide>
                  )
                }
              )}
            </Swiper>
          </div>
        </div>

        {/* ===================================================
            CONTENT FRAME
        =================================================== */}

        <div
          className="tab-content-frame"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              mb-4
              px-1
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                min-w-0
              "
            >
              <span
                className="
                  w-1.5
                  h-5
                  rounded-full
                  bg-slate-900
                  shrink-0
                "
              />

              <h2
                className="
                  text-sm
                  sm:text-base
                  font-bold
                  text-slate-800
                  truncate
                "
              >
                {
                  tabConfig.find(
                    (tab) =>
                      tab.key === activeTab
                  )?.label
                }
              </h2>
            </div>

            <span
              className="
                hidden
                sm:inline-flex
                items-center
                shrink-0
                text-[11px]
                text-slate-400
              "
            >
              {currentCategories.length}{' '}
              مورد
            </span>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              relative
              min-h-[230px]
              sm:min-h-[260px]
            "
          >
            {showSkeleton ? (
              <TabSkeletonGrid />
            ) : currentCategories.length === 0 ? (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-10
                  sm:py-12
                  text-slate-400
                  text-xs
                  sm:text-sm
                "
              >
                <Folder
                  className="
                    w-8
                    h-8
                    sm:w-10
                    sm:h-10
                    stroke-[1.5]
                    mb-2
                  "
                />

                <span>
                  هیچ زیر‌دسته‌ای در این بخش
                  یافت نشد.
                </span>
              </div>
            ) : (
              <div className="relative px-0 sm:px-2">
                {/* =================================================
                    CARD NAVIGATION
                ================================================= */}

                {currentCategories.length > 1 && (
                  <>
                    {/* Previous */}

                    <button
                      type="button"
                      onClick={() =>
                        swiperRef.current?.slidePrev()
                      }
                      aria-label="قبلی"
                      className="
                        flex
                        absolute
                        top-1/2
                        -translate-y-1/2
                        -right-2
                        sm:-right-3
                        z-20
                        w-8
                        h-10
                        sm:w-10
                        sm:h-12
                        items-center
                        justify-center
                        rounded
                        bg-white
                        border
                        border-gray-300
                        shadow-md
                        hover:bg-gray-50
                        text-slate-700
                        transition-all
                      "
                    >
                      <ChevronRight
                        className="
                          w-4
                          h-4
                          sm:w-5
                          sm:h-5
                        "
                      />
                    </button>

                    {/* Next */}

                    <button
                      type="button"
                      onClick={() =>
                        swiperRef.current?.slideNext()
                      }
                      aria-label="بعدی"
                      className="
                        flex
                        absolute
                        top-1/2
                        -translate-y-1/2
                        -left-2
                        sm:-left-3
                        z-20
                        w-8
                        h-10
                        sm:w-10
                        sm:h-12
                        items-center
                        justify-center
                        rounded
                        bg-white
                        border
                        border-gray-300
                        shadow-md
                        hover:bg-gray-50
                        text-slate-700
                        transition-all
                      "
                    >
                      <ChevronLeft
                        className="
                          w-4
                          h-4
                          sm:w-5
                          sm:h-5
                        "
                      />
                    </button>
                  </>
                )}

                {/* =================================================
                    CARDS SWIPER

                    MOBILE  = 3
                    TABLET  = 3
                    DESKTOP = 5
                ================================================= */}

                <Swiper
                  key={activeTab}
                  modules={[
                    FreeMode,
                    Navigation,
                    Pagination,
                  ]}
                  freeMode={{
                    enabled: true,
                    momentumBounce: false,
                  }}
                  dir="rtl"
                  observer
                  observeParents
                  resizeObserver
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper
                  }}
                  /*
                    موبایل: 3 کارت
                    تبلت: 3 کارت
                    دسکتاپ: 5 کارت
                  */
                  slidesPerView={3}
                  spaceBetween={6}
                  pagination={
                    currentCategories.length > 1
                      ? {
                          clickable: true,
                          el: '.cards-pagination',
                        }
                      : false
                  }
                  breakpoints={{
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },

                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 12,
                    },
                  }}
                  className="
                    categories-swiper
                    w-full
                    !py-2
                  "
                >
                  {currentCategories.map(
                    (item, index) => {
                      const categorySlug =
                        item.catSlug ||
                        item.catName

                      const colorTheme =
                        bgColors[
                          index %
                            bgColors.length
                        ]

                      return (
                        <SwiperSlide
                          key={item.id}
                          className="!h-auto"
                        >
                          <Link
                            href={`/resources/main-resource?category=${encodeURIComponent(
                              categorySlug
                            )}`}
                            className="
                              group
                              relative
                              overflow-hidden
                              flex
                              flex-col
                              justify-between
                              p-2
                              sm:p-3
                              sm:pt-5

                              min-h-[190px]
                              sm:min-h-[190px]

                              mobile-category-card

                              bg-white
                              border
                              border-gray-300
                              rounded-2xl

                              transition-all
                              duration-200

                              hover:border-gray-400
                              hover:shadow-md
                            "
                          >
                            {/* =================================================
                                RIBBON
                            ================================================= */}

                            <span
                              className="
                                pointer-events-none
                                absolute
                                top-3
                                -left-9
                                z-10
                                rotate-[-45deg]
                                bg-red-600
                                text-white
                                text-[8px]
                                sm:text-[9px]
                                font-bold
                                px-8
                                py-1
                                shadow-sm
                              "
                            >
                              درسنامه / تست
                            </span>

                            {/* =================================================
                                CARD BODY
                            ================================================= */}

                            <div>
                              <div
                                className="
                                  flex
                                  flex-col
                                  items-center
                                  gap-2
                                  mb-2
                                "
                              >
                                {/* =================================================
                                    IMAGE

                                    MOBILE = 60x60
                                    DESKTOP = 64x64
                                ================================================= */}

                                <div
                                  className={`
                                    relative
                                    flex
                                    items-center
                                    justify-center

                                    w-[60px]
                                    h-[60px]

                                    sm:w-16
                                    sm:h-16

                                    mobile-category-image

                                    rounded-xl
                                    shrink-0

                                    ${colorTheme}
                                  `}
                                >
                                  {item.imageUrl ? (
                                    <Image
                                      src={
                                        item.imageUrl
                                      }
                                      alt={
                                        item.catName
                                      }
                                      fill
                                      className="
                                        object-contain
                                        p-2
                                        sm:p-2.5
                                      "
                                      sizes="
                                        (max-width: 639px)
                                        60px,
                                        64px
                                      "
                                    />
                                  ) : (
                                    <Folder
                                      className="
                                        w-7
                                        h-7

                                        sm:w-8
                                        sm:h-8
                                      "
                                    />
                                  )}
                                </div>

                                {/* =================================================
                                    TITLE

                                    MOBILE = 12px
                                    DESKTOP = قبلی
                                ================================================= */}

                                <h3
                                  className="
                                    text-[12px]
                                    sm:text-xs
                                    md:text-sm

                                    mobile-category-title

                                    font-semibold
                                    text-slate-900

                                    group-hover:text-blue-600

                                    transition-colors

                                    line-clamp-2

                                    leading-5

                                    text-center

                                    w-full
                                  "
                                >
                                  {item.catName}
                                </h3>
                              </div>

                              {/* =================================================
                                  DESCRIPTION
                              ================================================= */}

                              <p
                                className="
                                  text-[9px]
                                  sm:text-[11px]

                                  mobile-category-description

                                  font-bold
                                  text-slate-500

                                  leading-relaxed

                                  line-clamp-2

                                  text-center
                                "
                              >
                                {item.description ||
                                  'مجموعه سوالات و درسنامه‌های اختصاصی آزمون‌های استخدامی مربوطه.'}
                              </p>
                            </div>

                            {/* =================================================
                                BADGES
                            ================================================= */}

                            <div
                              className="
                                flex
                                items-center
                                justify-center
                                gap-1
                                pt-2
                                flex-wrap
                              "
                            >
                              {item.badges?.map(
                                (badge) => (
                                  <span
                                    key={badge}
                                    className="
                                      inline-flex
                                      items-center

                                      px-1.5
                                      py-0.5

                                      rounded-md

                                      text-[8px]
                                      sm:text-[9px]

                                      font-medium

                                      bg-blue-50
                                      text-blue-700
                                    "
                                  >
                                    {badge}
                                  </span>
                                )
                              )}
                            </div>
                          </Link>
                        </SwiperSlide>
                      )
                    }
                  )}
                </Swiper>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {currentCategories.length > 1 && (
                  <div
                    className="
                      cards-pagination
                      flex
                      items-center
                      justify-center
                      gap-1
                      mt-4
                      sm:mt-5
                    "
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

