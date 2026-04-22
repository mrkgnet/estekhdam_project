// file: components/ui/Breadcrumb.jsx

import React from 'react';
import Link from 'next/link';
import { Home, ChevronLeft } from 'lucide-react';

// آدرس اصلی وب‌سایت شما. برای ساخت URL کامل در Schema لازم است.
// بهتر است این مقدار را از فایل .env بخوانید.
const BASE_URL = 'https://your-website.com'; 

/**
 * کامپوننت داینامیک و بهینه برای SEO برای نمایش مسیر راهنما (Breadcrumb)
 * @param {object} props
 * @param {Array<{label: string, href: string}>} props.items - آرایه‌ای از آبجکت‌ها که هر کدام شامل لیبل و آدرس یک صفحه است.
 */
export default function Breadcrumb({ items }) {
  // ساخت JSON-LD Schema برای بهینه‌سازی SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      // آیتم اول: خانه
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: BASE_URL,
      },
      // آیتم‌های بعدی که به صورت داینامیک از props گرفته می‌شوند
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2, // موقعیت از ۲ شروع می‌شود
        name: item.label,
        item: `${BASE_URL}${item.href}`,
      })),
    ],
  };

  return (
    <>
      {/* اسکریپت Schema برای SEO که در صفحه نمایش داده نمی‌شود */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ساختار بصری Breadcrumb با تگ‌های استاندارد */}
      <nav className="flex mb-4 text-slate-600 text-xs sm:font-medium" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          {/* آیتم ثابت "خانه" */}
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100">
              <Home className="w-3.5 h-3.5 ml-1.5 mb-0.5" />
              خانه
            </Link>
          </li>

          {/* آیتم‌های داینامیک */}
          {items.map((item, index) => (
            <li key={item.href}>
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" />
                
                {/* اگر آخرین آیتم بود، به صورت متن نمایش داده شود (غیرقابل کلیک) */}
                {index === items.length - 1 ? (
                  <span className="text-gray-800 border p-1 rounded-full bg-gray-100 px-2 cursor-default">
                    {item.label}
                  </span>
                ) : (
                  // در غیر این صورت به صورت لینک نمایش داده شود
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-emerald-600 transition-colors border p-1 px-2 rounded-full bg-gray-100"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
