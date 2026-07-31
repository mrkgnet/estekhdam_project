import React, { Suspense } from 'react'
import DataFetcher from './TabHomeFetchData'

type Props = {
  searchParams?: Promise<{ category?: string }>
}

function FullPageLoader() {
  return (
    // لایه نگه‌دارنده برای جلوگیری از به هم ریختن چیدمان سایر المان‌های صفحه
    <div className="w-full min-h-[50vh]" dir="rtl">
      
      {/* لایه تیره کننده که کل صفحه (از بالا تا پایین مرورگر) را می‌پوشاند */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        
        {/* انیمیشن سه نقطه با سایز کمی بزرگتر برای حالت تمام صفحه */}
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-600 animate-bounce"
            style={{ animationDelay: '0s', animationDuration: '0.6s' }}
          />
          <span
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-600 animate-bounce"
            style={{ animationDelay: '0.15s', animationDuration: '0.6s' }}
          />
          <span
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-600 animate-bounce"
            style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}
          />
        </div>
        
        <span className="text-sm sm:text-base font-semibold text-rose-950 mt-4">
          در حال دریافت اطلاعات...
        </span>

      </div>
    </div>
  )
}

export default async function TabHomeComponent({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {}
  // اگر category در URL نبود، حالت پیش‌فرض را بانک سوالات در نظر می‌گیریم
  const category = resolvedParams.category || 'بانک-سوالات'

  return (
    // پاس دادن category به عنوان key برای رندر مجدد در صورت تغییر تب
    <Suspense key={category} fallback={<FullPageLoader />}>
      <DataFetcher category={category} />
    </Suspense>
  )
}