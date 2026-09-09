'use client'

import React, { useState, useEffect } from 'react'
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

export default function HiroGrid({ data }: HiroGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null)

  useEffect(() => {
    if (!activeCategory) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCategory(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeCategory])

  if (!data || data.length === 0) return null

  return (
    <>
      <section aria-label="دسته‌بندی‌های اصلی" className="w-full mx-auto px-2 py-2">
        <div className="grid grid-cols-2 sm:grid-cols-4  gap-1.5 items-start">
          {data.map((category, index) => {
            const imageSrc = category.imageUrl || DEFAULT_FALLBACK_IMAGE
            const hasChildren = Boolean(category.children && category.children.length > 0)

            return (
              <div
                key={category.id}
                className="group flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow  hover:border-slate-400 "
              >
                <Link href={`/resources/main-resource?category=${category.catSlug}`} className="flex flex-col w-full">
                  {/* ظرف تصویر با ارتفاع فشرده */}
                  <div className="aspect-[4/3] max-h-26 sm:max-h-38 flex items-center justify-center overflow-hidden relative w-full p-1 ">
                    <div className="relative w-full h-full">
                      <Image
                        src={imageSrc}
                        alt={category.catName}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 10vw"
                        className="object-contain"
                        priority={index < 8}
                      />
                    </div>
                  </div>

                  {/* عنوان فشرده */}
                  <div className="px-1 py-1 text-center my-2">
                    <h2 className="text-[13px] sm:text-[15px] font-semibold text-slate-700 tracking-tight  group-hover:text-primary transition-colors leading-tight">
                    <span>
                        {category.catName} 
                        </span>| <span>درسنامه/تست/انلاین</span>
                    </h2>
                  </div>
                </Link>

                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className="w-full py-1.5 px-1 flex items-center justify-between text-[13px] sm:text-[15px] font-medium text-slate-700 bg-slate-50 border-t border-slate-100 hover:bg-slate-100 active:bg-slate-200 cursor-pointer transition-colors"
                  >
                    <span className='border border-slate-500 p-1 rounded-full'> مشاهده زیردسته ({category.children?.length})</span>
                    <svg
                      className="w-4 h-4 text-slate-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {activeCategory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setActiveCategory(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">زیردسته‌های:</span>
                <h3 className="text-xs font-bold text-slate-900">{activeCategory.catName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                aria-label="بستن"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3 overflow-y-auto flex flex-wrap gap-1.5">
              {activeCategory.children?.map((subCat) => (
                <Link
                  key={subCat.id}
                  href={`/resources/main-resource?category=${subCat.catSlug}`}
                  onClick={() => setActiveCategory(null)}
                  className="px-2.5 py-1 text-[13px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white rounded border border-slate-200 transition-colors"
                >
                  {subCat.catName}
                </Link>
              ))}
            </div>

            <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 text-left">
              <Link
                href={`/categories/${activeCategory.catSlug}`}
                onClick={() => setActiveCategory(null)}
                className="text-[12px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                مشاهده همه محصولات {activeCategory.catName}
                <span aria-hidden="true">&larr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
