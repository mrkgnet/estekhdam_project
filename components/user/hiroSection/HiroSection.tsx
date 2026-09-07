import React from 'react'
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
  children?: CategoryChild[]
}

type HeroSectionProps = {
  categories?: ParentCategory[]
}

export default function HeroSection({ categories = [] }: HeroSectionProps) {
  const popularCategories = categories.slice(0, 5)

  return (
    <section
      dir="rtl"
      aria-label="بخش جستجو و معرفی آزمون‌ها"
      className="w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 font-sans"
    >
      {/* =====================================================
          HEADER (SEO Optimized H1 & Semantic Description)
      ===================================================== */}
      <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
          مرجع کامل{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            آزمون‌های استخدامی
            <svg
              className="absolute -bottom-2 left-0 w-full pointer-events-none"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2 6C50 2 150 2 198 6"
                stroke="url(#hero-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="hero-gradient" x1="0" y1="0" x2="200" y2="0">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          بزرگ‌ترین مجموعه سوالات و منابع استخدامی کشور با به‌روزرسانی مداوم
        </p>
      </header>

      {/* =====================================================
          SEARCH BOX CONTAINER
      ===================================================== */}
      <div className="w-full max-w-2xl mx-auto relative z-20">
        <SearchBoxInPage
          popularCategories={popularCategories}
          isMobileSearchOpen={true}
          onCloseMobile={() => {}}
        />
      </div>
    </section>
  )
}