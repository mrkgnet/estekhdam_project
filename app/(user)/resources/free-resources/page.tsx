"use client";
import { useState } from "react";

const FILTERS = [
  { id: "banks", label: "منابع بانک‌ها", sub: "ملت، مهر، صادرات و..." },
  { id: "edu", label: "منابع آموزش و پرورش", sub: "آموزگاری، دبیری و..." },
  { id: "military", label: "منابع نیروهای مسلح", sub: "ارتش، سپاه و..." },
  { id: "insurance", label: "منابع بیمه", sub: "تأمین اجتماعی، خدمات درمانی و..." },
];

const PRODUCTS = [
  { id: 1, title: "بسته آزمون بانک ملت", category: "banks", price: "رایگان", image: "/images/bank.jpg" },
  { id: 2, title: "سوالات آزمون آموزگاری", category: "edu", price: "رایگان", image: "/images/edu.jpg" },
  { id: 3, title: "منابع استخدامی سپاه", category: "military", price: "رایگان", image: "/images/military.jpg" },
  { id: 4, title: "دفترچه بیمه تأمین اجتماعی", category: "insurance", price: "رایگان", image: "/images/insurance.jpg" },
];

export default function FreeResourcesPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activeFilters = Object.keys(checked).filter((k) => checked[k]);
  const filtered =
    activeFilters.length === 0
      ? PRODUCTS
      : PRODUCTS.filter((p) => activeFilters.includes(p.category));

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">منابع رایگان استخدامی</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">فیلتر منابع</h2>
          <div className="space-y-3">
            {FILTERS.map((f) => (
              <label
                key={f.id}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                  checked[f.id]
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={!!checked[f.id]}
                    onChange={() => toggle(f.id)}
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      checked[f.id]
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked[f.id] && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </aside>

        {/* Products */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x160?text=تصویر";
                  }}
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                  {FILTERS.find((f) => f.id === p.category)?.label}
                </span>
                <h3 className="text-sm font-bold text-gray-800 mt-2">{p.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-green-600 font-semibold text-sm">{p.price}</span>
                  <button className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                    مشاهده
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-16">
              محصولی برای فیلتر انتخابی یافت نشد.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
