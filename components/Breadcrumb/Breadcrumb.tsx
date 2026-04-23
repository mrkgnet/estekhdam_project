// file: components/ui/Breadcrumb.jsx

import React from 'react';
import Link from 'next/link';
import { Home, ChevronLeft } from 'lucide-react';

const BASE_URL = 'https://your-website.com';

export default function Breadcrumb({ items = [] }) {
  // حذف آیتم‌هایی که label خالی/نامعتبر دارند
  const filteredItems = items.filter(
    (item) => item?.label && item.label.trim() !== ''
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: BASE_URL,
      },
      ...filteredItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `${BASE_URL}${item.href}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex mb-4 text-slate-600 text-xs sm:font-medium" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100">
              <Home className="w-3.5 h-3.5 ml-1.5 mb-0.5" />
              خانه
            </Link>
          </li>

          {filteredItems.map((item, index) => (
            <li key={`${item.href}-${index}`}>
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" />

                {index === filteredItems.length - 1 ? (
                  <span className="text-gray-800 border p-1 rounded-full bg-gray-100 px-2 cursor-default">
                    {item.label}
                  </span>
                ) : (
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
