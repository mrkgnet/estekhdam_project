// components/brands/BrandsTopHome.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBrands, BrandItemType } from "@/hooks/useBrands";

interface Props {
  brands?: BrandItemType[];
  title?: string;
}

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

export default function BrandsTopHome({ brands: initialBrands, title }: Props) {
  // تغذیه از دیتای SSR بدون نیاز به لودر کلاینتی
  const { data: brands = [] } = useBrands(initialBrands);

  const displayBrands = useMemo(() => {
    if (!brands || brands.length === 0) return [];
    if (brands.length < 5) return [...brands, ...brands, ...brands, ...brands];
    if (brands.length < 10) return [...brands, ...brands];
    return brands;
  }, [brands]);

  if (!brands || brands.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded bg-transparent" dir="rtl">
      {title && (
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 px-2">
          {title}
        </h2>
      )}

      <div className="flex overflow-hidden w-full select-none group/marquee">
        <div className="flex shrink-0 items-center justify-around gap-4 sm:gap-6 px-2 marquee-animation">
          {displayBrands.map((brand, index) => (
            <BrandItem
              key={`track1-${brand.id}-${index}`}
              brand={brand}
              priority={index < 4}
            />
          ))}
        </div>

        <div
          className="flex shrink-0 items-center justify-around gap-4 sm:gap-6 px-2 marquee-animation"
          aria-hidden="true"
        >
          {displayBrands.map((brand, index) => (
            <BrandItem
              key={`track2-${brand.id}-${index}`}
              brand={brand}
              priority={false}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeMove {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(100%, 0, 0);
          }
        }
        .marquee-animation {
          will-change: transform;
          animation: marqueeMove 45s linear infinite;
        }
        :global(.group\/marquee:hover) .marquee-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

const BrandItem = React.memo(function BrandItem({
  brand,
  priority,
}: {
  brand: BrandItemType;
  priority: boolean;
}) {
  return (
    <Link
      href={`/brands/${brand.id}`}
      className="flex flex-col items-center gap-2.5 shrink-0 w-20 sm:w-24 outline-none"
      title={brand.title}
    >
      <div className="relative w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] flex items-center justify-center p-3 rounded-full bg-white shadow-sm border border-slate-100/80">
        <Image
          src={brand.imageUrl}
          alt={`لوگو ${brand.title}`}
          fill
          sizes="(max-width: 480px) 64px, (max-width: 768px) 76px, 84px"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-contain p-3.5 mix-blend-multiply"
        />
      </div>

      <span className="font-medium text-slate-600 text-center line-clamp-1 w-full px-1 text-[13px] sm:text-[14px]">
        {brand.title}
      </span>
    </Link>
  );
});