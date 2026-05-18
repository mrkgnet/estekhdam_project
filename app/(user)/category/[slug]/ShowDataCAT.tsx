'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchDataByCategory } from '@/actions/user/getDataByCategory/Actions'
import { ProductListSkeleton_Client } from '@/components/ui/SkeletonLoding/ProductListSkeleton_Client'
import { CreditCard, Play, ShoppingBasket } from 'lucide-react'

/* ---------------------------------- */
/* ✅ Utils */
/* ---------------------------------- */
const toman = (n: number) => {
  if (n === 0) return 'رایگان'
  return `${n?.toLocaleString('fa-IR')} تومان`
}

const getSafeImageUrl = (url?: string | null) => {
  if (!url || url === 'null' || url.trim() === '') {
    return '/images/products/bookExample.jpg'
  }
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `/${url}`
  }
  return url
}

/* ---------------------------------- */
/* ✅ Inline Blur */
/* ---------------------------------- */
const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+'

/* ---------------------------------- */
/* ✅ Progressive Image + Shimmer */
/* ---------------------------------- */
function ProgressiveImage({
  src,
  alt,
  sizes,
  className = '',
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {!loaded && <div className="shimmer-overlay z-10" />}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setLoaded(true)}
        className={`
          transition-all duration-500 ease-out object-contain
          ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-95'}
          ${className}
        `}
      />
    </div>
  )
}

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
interface ProductType {
  id: string
  name: string
  slug: string
  oldPrice: number
  newPrice: number
  imageUrl?: string | null
}

interface CategoryType {
  catName: string
  catSlug: string
  products: ProductType[]
}

interface ShowDataProps {
  initialResponse: {
    success: boolean
    data: CategoryType | null
  }
  slug: string
  searchQuery: string
  currentPage: number
  limit: number
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function ShowDataCat({
  initialResponse,
  slug,
  searchQuery,
  currentPage,
  limit,
}: ShowDataProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  const { data: response, isFetching } = useQuery({
    queryKey: ['category-products', slug, searchQuery, currentPage, limit],
    queryFn: async () =>
      await fetchDataByCategory(slug, searchQuery, currentPage, limit),
    initialData: initialResponse,
    staleTime: 1000 * 60 * 10,
  })

  const hasData = response?.success && response?.data
  const showSkeleton = !mounted || (isFetching && !hasData)

  if (showSkeleton) return <ProductListSkeleton_Client />
  if (!response?.success || !response?.data) return null

  const products = response.data.products

  return (
    <section className="w-full min-h-screen font-sans" dir="rtl">
      {/* ✅ Shimmer CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: #f1f5f9;
          overflow: hidden;
        }
        .shimmer-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.6) 37%,
            transparent 63%
          );
          animation: shimmer 1.2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div
          className={`transition-opacity duration-300 ${
            isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="grid gap-4 mt-2 justify-center md:[grid-template-columns:repeat(auto-fill,250px)]">
            {products.map((p) => (
              <div key={p.id} className="group relative md:w-[250px]">
                <div
                  onClick={() => router.push(`/resources/course/${p.slug}`)}
                  className="bg-white border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-pointer md:w-[250px] flex flex-row md:flex-col"
                >
                  {/* ✅ Image */}
                  <div className="relative w-[110px] md:w-full h-[120px] md:h-[150px] flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">
                    {/* ✅ Label */}
                    <span className="absolute top-2 right-2 z-20 text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white shadow">
                      آنلاین
                    </span>

                    <div className="relative w-full h-full">
                      <ProgressiveImage
                        src={getSafeImageUrl(p.imageUrl)}
                        alt={p.name}
                        sizes="(max-width: 640px) 150px, 200px"
                      />
                    </div>
                  </div>

                  {/* ✅ Content */}
                  <div className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                    <div>
                      {/* ✅ Add to cart (Desktop) */}
                      <div className="hidden md:flex items-center justify-center gap-3 mb-2">
                        <div className="flex-1 h-px bg-gray-200" />

                        <Link
                          href={`/cart/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                        >
                          <ShoppingBasket className="w-4 h-4" />
                        </Link>

                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <h3 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[1.5rem] group-hover:text-emerald-600 transition-colors duration-200">
                        {p.name}
                      </h3>

                      <ul className="mt-2 space-y-2 text-[11px] text-slate-600">
                        {['پاسخ تشریحی', 'بروزرسانی مداوم', 'سوالات طبقه بندی شده'].map(
                          (item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* ✅ Add to cart (Mobile) */}
                    <div className="flex md:hidden items-center justify-center gap-3 my-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <Link
                        href={`/cart/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                      >
                        <ShoppingBasket className="w-4 h-4" />
                      </Link>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* ✅ Price */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-red-600">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {toman(p.newPrice)}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <Play className="w-3.5 h-3.5" />
                        شروع رایگان
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
