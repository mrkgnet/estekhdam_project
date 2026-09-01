"use client";

import Image from "next/image";
import Link from "next/link";

/* ---------------------------------- */
/* ✅ Data (Static) */
/* ---------------------------------- */

const BANKS_DATA = [
  { id: 1, name: "بانک ملی", logo: "/images/topSlider/بانک_ملی.png", href: "/" },
  { id: 2, name: "بانک ملت", logo: "/images/topSlider/بانک_ملت.png", href: "/" },
  { id: 3, name: "بانک صادرات", logo: "/images/topSlider/بانک_صادرات.png", href: "/" },
  { id: 4, name: "وزارت ارتباطات", logo: "/images/topSlider/وزارت_ارتباطات.png", href: "/" },
  { id: 5, name: "بانک سپه", logo: "/images/topSlider/بانک_سپه.png", href: "/" },
  { id: 6, name: "آموزش و پرورش", logo: "/images/topSlider/آموزش و پرورش.jpg", href: "/" },
  { id: 7, name: "وزارت بهداشت", logo: "/images/topSlider/وزارت_بهداشت.jpg", href: "/" },
  { id: 8, name: "بانک اقتصاد نوین", logo: "/images/topSlider/بانک_اقتصاد_نوین.png", href: "/" },
  { id: 9, name: "بانک پارسیان", logo: "/images/topSlider/بانک_پارسیان.png", href: "/" },
  { id: 10, name: "وزارت دفاع", logo: "/images/topSlider/وزارت_دفاع.png", href: "/" },
  { id: 11, name: "سازمان امور مالیاتی", logo: "/images/topSlider/سازمان_امور_مالیاتی.jpg", href: "/" },
  { id: 12, name: "دانشگاه فرهنگیان", logo: "/images/topSlider/دانشگاه_فرهنگیان.png", href: "/" },
  { id: 13, name: "سازمان فنی حرفه ایی", logo: "/images/topSlider/سازمان_آموزش_فنی_حرفه_ایی.png", href: "/" },
  { id: 14, name: "بانک دی", logo: "/images/topSlider/بانک_دی.png", href: "/" },
  { id: 15, name: "بانک رفاه", logo: "/images/topSlider/بانک_رفاه.png", href: "/" },
  { id: 16, name: "وزارت دادگستری", logo: "/images/topSlider/وزارت_دادگستری.png", href: "/" },
];

/* ---------------------------------- */
/* ✅ Blur Placeholder */
/* ---------------------------------- */

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

/* ---------------------------------- */
/* ✅ Main Component */
/* ---------------------------------- */

export default function BrandTopSlider({ title }: { title?: string }) {
  return (
    <div className="relative py-4 overflow-hidden rounded bg-transparent" dir="rtl">
      {title && (
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-1.5 h-5 bg-green-500 rounded-full" />
          <h2 className="font-bold text-slate-800">{title}</h2>
        </div>
      )}

      {/* 
        ✅ کانتینر اصلی Marquee
      */}
      <div className="flex overflow-hidden w-full">
        
        {/* لیست اول */}
        <div className="flex shrink-0 animate-marquee">
          {BANKS_DATA.map((bank, index) => (
            <div key={`track1-${bank.id}`} className="px-2.5 sm:px-3 md:px-4">
              <BrandItem bank={bank} index={index} priority={index < 5} />
            </div>
          ))}
        </div>

        {/* لیست دوم */}
        <div className="flex shrink-0 animate-marquee" aria-hidden="true">
          {BANKS_DATA.map((bank, index) => (
            <div key={`track2-${bank.id}`} className="px-2.5 sm:px-3 md:px-4">
              <BrandItem bank={bank} index={index} priority={false} />
            </div>
          ))}
        </div>

      </div>

      {/* استایل‌های انیمیشن با سرعت کمتر و بدون هاور */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); } 
        }
        .animate-marquee {
          animation: marquee 70s linear infinite; /* زمان بیشتر = سرعت کمتر */
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------- */
/* ✅ Item */
/* ---------------------------------- */

function BrandItem({
  bank,
  index,
  priority,
}: {
  bank: { name: string; logo: string; href: string };
  index: number;
  priority: boolean;
}) {
  return (
    <Link
      href={bank.href}
      className="flex flex-col items-center gap-3 w-full h-full outline-none"
      title={bank.name}
    >
      <div
        className="relative w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px]
        flex items-center justify-center p-3 rounded-full bg-white shadow-sm border border-slate-100/80"
      >
        <Image
          src={bank.logo}
          alt={`منابع آزمون استخدامی ${bank.name}`}
          fill
          sizes="(max-width: 480px) 64px, (max-width: 768px) 76px, 84px"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          className="object-contain p-3.5 mix-blend-multiply"
        />
      </div>

      <span className="font-medium text-slate-600 text-center line-clamp-1 w-full px-1 text-[13px] sm:text-[15px]">
        {bank.name}
      </span>
    </Link>
  );
}