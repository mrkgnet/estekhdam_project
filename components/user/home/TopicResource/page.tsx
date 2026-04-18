import React, { Suspense } from 'react';
import FetchDataLatestProduct from './FetchDataTopicProduct';
import FetchDataBankProduct from './FetchDataTopicProduct';
import FetchDataTopicProduct from './FetchDataTopicProduct';

// 1. طراحی کامپوننت اسکلتون لودینگ
const LatestProductSkeleton = () => {
  return (
    <div className="bg-white text-[13px] relative rounded-2xl p-4 shadow-sm border border-slate-100 w-full animate-pulse overflow-hidden">
      
      {/* اسکلت هدر */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
        <div className="h-5 w-24 bg-slate-100 rounded-md"></div>
      </div>

      {/* اسکلت اسلایدر (نمایش 4 کارت فرضی برای دسکتاپ/تبلت) */}
      <div className="flex gap-[20px] px-1 pb-14 overflow-hidden">
        {[1, 2, 3, 4].map((item) => (
          <div 
            key={item} 
            className="w-[240px] shrink-0 rounded-2xl border border-slate-100 bg-white overflow-hidden"
          >
            {/* اسکلت عکس (نسبت ابعاد 3 به 4) */}
            <div className="w-full aspect-[3/4] bg-slate-200"></div>

            {/* اسکلت محتوا */}
            <div className="p-4 space-y-3">
              {/* اسکلت عنوان (دو خط) */}
              <div className="space-y-2 h-12">
                <div className="h-4 w-full bg-slate-200 rounded-sm"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded-sm"></div>
              </div>

              {/* اسکلت قیمت */}
              <div className="pt-2 border-t border-slate-50 h-12 flex flex-col justify-center gap-1">
                <div className="h-2.5 w-16 bg-slate-100 rounded-sm"></div>
                <div className="h-4 w-24 bg-slate-200 rounded-sm"></div>
              </div>

              {/* اسکلت دکمه‌ها */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="h-8 rounded-lg bg-slate-100"></div>
                <div className="h-8 rounded-lg bg-slate-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. کامپوننت اصلی
export default function TopicProductComponent({catSlug} :{catSlug:string}) {
  
  return (
    <div>
      <Suspense fallback={<LatestProductSkeleton />}>
        <FetchDataTopicProduct catSlug={catSlug} />
      </Suspense>
    </div>
  );
}
