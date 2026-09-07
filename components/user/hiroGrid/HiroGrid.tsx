'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ParentCategory {
  id: string | number
  title: string
  slug: string
  imageUrl: string
}

const PARENT_CATEGORIES: ParentCategory[] = [
  {
    id: 1,
    title: 'بانک سوالات',
    slug: 'category-1',
    imageUrl: 'https://mrkg.s3.ir-thr-at1.arvanstorage.ir/1788694875612-5.png',
  },
  {
    id: 2,
    title: 'دفترچه‌های استخدامی',
    slug: 'category-2',
    imageUrl: 'https://mrkg.s3.ir-thr-at1.arvanstorage.ir/1788694875612-5.png',
  },
  {
    id: 3,
    title: 'منابع رایگان',
    slug: 'category-3',
    imageUrl: 'https://mrkg.s3.ir-thr-at1.arvanstorage.ir/1788694875612-5.png',
  },
  
]

export default function HiroGrid() {
  return (
    <section aria-label="دسته‌بندی‌های اصلی" className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        {PARENT_CATEGORIES.map((category, index) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="
              group 
              relative 
              overflow-hidden 
              border border-slate-200 bg-white 
              shadow-xs 
              transition-all duration-300 
              hover:shadow-md hover:border-slate-300 
              hover:-translate-y-0.5
            "
          >
            {/* تصویر اصلی با نسبت ابعادی بلندتر */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src={category.imageUrl}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 500px"
                className="
                  object-cover 
                  w-full 
                  h-full 
                  transition-transform duration-500 ease-out 
                  group-hover:scale-105
                "
                priority={index < 2}
              />
            </div>

            {/* عنوان دسته‌بندی */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 flex items-end bg-white/95 backdrop-blur-[2px]">
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                {category.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
