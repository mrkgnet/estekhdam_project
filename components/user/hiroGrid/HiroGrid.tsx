'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface SubCategoryItem {
  id: string
  catName: string
  catSlug: string
}

export interface CategoryItem {
  id: string
  catName: string
  catSlug: string
  imageUrl?: string | null
  children?: SubCategoryItem[]
}

interface HiroGridProps {
  data: CategoryItem[]
}

const DEFAULT_FALLBACK_IMAGE = '/images/placeholder.png'

// کامپوننت تصویر کارت دسته‌بندی با هندلینگ بدون تداخل LCP
function CategoryCardImage({
  src,
  alt,
  priority,
}: {
  src: string
  alt: string
  priority: boolean
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          aria-hidden="true"
        >
          <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      <Image
        src={src}
        alt={`تصویر دسته‌بندی ${alt}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        className={`object-contain transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

export default function HiroGrid({ data }: HiroGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null)

  // متد بستن مدال با پاکسازی ایمن استایل بدنه
  const closeModal = useCallback(() => {
    document.body.style.overflow = ''
    setActiveCategory(null)
  }, [])

  const openModal = useCallback((category: CategoryItem) => {
    document.body.style.overflow = 'hidden'
    setActiveCategory(category)
  }, [])

  useEffect(() => {
    if (!activeCategory) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeCategory, closeModal])

  if (!data || data.length === 0) return null

  return (
    <>
      <section aria-label="دسته‌بندی‌های اصلی" className="w-full mx-auto px-4 py-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-start">
          {data.map((category, index) => {
            const imageSrc = category.imageUrl || DEFAULT_FALLBACK_IMAGE
            const hasChildren = Boolean(category.children && category.children.length > 0)
            const isPriority = index < 2 // بهینه‌سازی دقیق LCP فقط برای اولین ردیف دستگاه‌های استاندارد

            return (
              <article
                key={category.id}
                className="group flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs hover:border-slate-400 transition-colors"
              >
                {/* لینک اصلی کارت */}
                <Link
                  href={`/resources/main-resource?category=${category.catSlug}`}
                  className="flex flex-col w-full"
                  title={`مشاهده منابع ${category.catName}`}
                >
                  <div className="aspect-[4/3] max-h-30 sm:max-h-36 flex items-center justify-center overflow-hidden relative w-full ">
                    <CategoryCardImage
                      src={imageSrc}
                      alt={category.catName}
                      priority={isPriority}
                    />
                  </div>

                  <div className="px-2 py-1.5 text-center my-1">
                    <h2 className="text-[13px] sm:text-[15px] font-semibold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                      {category.catName}
                    </h2>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      درسنامه / تست / آنلاین
                    </span>
                  </div>
                </Link>

                {/* دکمه باز کردن مدال زیردسته‌ها */}
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => openModal(category)}
                    aria-haspopup="dialog"
                    aria-expanded={activeCategory?.id === category.id}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs font-medium text-slate-700 bg-slate-50 border-t border-slate-100 hover:bg-slate-100 active:bg-slate-200 cursor-pointer transition-colors"
                  >
                    <span className="border border-slate-300 px-2.5 py-0.5 rounded-full text-[14px]">
                      مشاهده زیردسته‌ها ({category.children?.length})
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* لینک‌های کرول‌پذیر برای گوگل بدون aria-hidden برای جلوگیری از حذف از ایندکس */}
                {hasChildren && (
                  <nav className="sr-only" aria-label={`زیرمجموعه‌های ${category.catName}`}>
                    <ul>
                      {category.children?.map((subCat) => (
                        <li key={subCat.id}>
                          <Link href={`/resources/main-resource?category=${subCat.catSlug}`}>
                            {subCat.catName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* مدال تعاملی با حفظ یکپارچگی دسترسی‌پذیری و جریان لینک‌ها */}
      {activeCategory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-category-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* هدر مدال */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">زیردسته‌های:</span>
                <h3 id="modal-category-title" className="text-xs font-bold text-slate-900">
                  {activeCategory.catName}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                aria-label="بستن پنجره"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* بدنه و تگ‌های زیردسته */}
            <div className="p-3 overflow-y-auto flex flex-wrap gap-1.5">
              {activeCategory.children?.map((subCat) => (
                <Link
                  key={subCat.id}
                  href={`/resources/main-resource?category=${subCat.catSlug}`}
                  onClick={closeModal}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white rounded border border-slate-200 transition-colors"
                >
                  {subCat.catName}
                </Link>
              ))}
            </div>

            {/* فوتر مدال: آدرس هماهنگ و یکپارچه با لینک اصلی کارت */}
            <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 text-left">
              <Link
                href={`/resources/main-resource?category=${activeCategory.catSlug}`}
                onClick={closeModal}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                مشاهده همه منابع {activeCategory.catName}
                <span aria-hidden="true">&larr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}