"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Star, CheckCircle2 } from "lucide-react";

interface TabSectionCRProps {
  product?: any;
  isLoading?: boolean;
}

export default function TabSectionCR({ product, isLoading }: TabSectionCRProps) {
  const tabs = [
    { id: "description", label: "درباره محصول", icon: BookOpen },
    { id: "features", label: "ویژگی‌ها", icon: Star },
  ];


  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // وضعیت آماده‌بودن محتوا (برای نمایش اسکلتون کوتاه‌مدت مانند مثال قبل)
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // زمانی که محصول آماده است و در حالت لودینگ نیست، یک فریم بعد محتوای اصلی را نمایش بده
    if (!isLoading && product) {
      setIsReady(false);
      const raf = requestAnimationFrame(() => setIsReady(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsReady(false);
    }
  }, [isLoading, product]);

  // ================= حالت لودینگ اسکلتونی (وقتی هنوز دیتا نیامده) =================
  if (isLoading || !product) {
    return (
      <div>
        <div className="bg-white rounded shadow-sm overflow-hidden min-h-[380px]">
          {/* هدر تب‌ها (اسکلتون) */}
          <div className="flex overflow-x-auto border-b border-slate-300 bg-slate-50/50 p-2 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[50px] w-[130px] sm:w-[150px] bg-slate-200/60 rounded-2xl animate-pulse shrink-0"
              />
            ))}
          </div>

          {/* محتوای تب‌ها (اسکلتون) */}
          <div className="p-5 sm:p-6 md:p-8 space-y-6">
            <div className="h-7 w-48 bg-slate-200/60 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-11/12 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-4/5 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= حالت نمایش محتوای اصلی + لودر اسکلتونی کوتاه مثل قبل =================
  return (
    <div>
      <div className="relative bg-white sm:rounded overflow-hidden min-h-[380px] border border-slate-300">
        {/* لودر اسکلتونی Overlay - مشابه قبل به جای اسپینر تا آماده شدن محتوا */}
        {!isReady && (
          <div className="absolute inset-0 z-10 bg-white">
            <div className="flex overflow-x-hidden border-b border-slate-300 bg-slate-50/50 p-2 gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[50px] w-[130px] sm:w-[150px] bg-slate-200/60 rounded-2xl animate-pulse shrink-0"
                />
              ))}
            </div>
            <div className="p-5 sm:p-6 md:p-8 space-y-6">
              <div className="h-7 w-48 bg-slate-200/60 rounded-lg animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-11/12 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-4/5 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* محتوای واقعی با ترنزیشن شفافیت تا آماده شدن */}
        <div
          className={`transition-opacity duration-300 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* هدر تب‌ها */}
          <div
            role="tablist"
            className="flex overflow-x-auto border-b border-slate-300 bg-slate-50/50 p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center font-bold text-13 md:text-14 lg:text-13 justify-center cursor-pointer gap-2 px-5 sm:px-6 py-3.5 transition-colors whitespace-nowrap rounded-2xl flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-exam"
                      className="absolute inset-0 bg-white shadow-sm border border-slate-300 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                        isActive ? "text-green-600" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={
                        isActive ? "text-green-700" : "text-slate-500 hover:text-slate-800"
                      }
                    >
                      {tab.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* محتوای تب‌ها */}
          <div className="p-5 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "description" && (
                  <div className="space-y-4 sm:space-y-5">
                   

                    <div className="text-slate-600 leading-[2.2] text-justify">
                      {product?.description ? (
                        <div
                          className="prose max-w-none prose-slate"
                          dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                      ) : (
                        <span className="text-slate-400 italic">
                          توضیحاتی برای این آزمون ثبت نشده است.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-5 sm:space-y-6">
                    <h2 className="font-black text-slate-800 flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-500" />
                      امکانات و ویژگی‌ها
                    </h2>
                    {product?.features && product.features.length > 0 ? (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.features.map((feature: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-300 transition-colors hover:bg-green-50/50 hover:border-green-100"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 bg-slate-50 p-4 rounded-xl text-center border border-slate-300">
                        ویژگی خاصی ثبت نشده است.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}