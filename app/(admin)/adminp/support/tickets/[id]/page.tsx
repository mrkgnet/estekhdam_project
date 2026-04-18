import React, { Suspense } from 'react';
import FetchDataUTA from './FetchDataUTA';

// تعریف کامپوننت اسکلتون در همین فایل
function SkeletonLoader() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-pulse">
      
      {/* اسکلتون هدر اصلی تیکت */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <div className="w-6 h-6 bg-slate-200 rounded-md shrink-0"></div>
            <div className="h-7 bg-slate-200 rounded-lg w-full max-w-[300px]"></div>
          </div>
          <div className="w-24 h-8 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="w-32 h-8 bg-slate-100 rounded-full"></div>
          <div className="w-28 h-8 bg-slate-100 rounded-full"></div>
        </div>
      </div>

      {/* اسکلتون اطلاعات کاربر و تنظیمات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-32 h-5 bg-slate-200 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-slate-50 rounded-lg w-full"></div>
            <div className="h-10 bg-slate-50 rounded-lg w-full"></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-32 h-5 bg-slate-200 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="w-24 h-4 bg-slate-200 rounded-md block"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-slate-50 rounded-xl"></div>
              <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* اسکلتون بخش چت و فرم پاسخ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="w-32 h-5 bg-slate-200 rounded-md"></div>
        </div>
        <div className="p-6 space-y-6 bg-slate-50/50">
          <div className="flex justify-end">
            <div className="w-2/3 md:w-1/2 flex flex-col gap-1.5 items-end">
              <div className="w-16 h-3 bg-slate-200 rounded mt-1"></div>
              <div className="w-full h-16 bg-slate-100 rounded-2xl rounded-tl-sm"></div>
              <div className="w-24 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-3/4 md:w-2/3 flex flex-col gap-1.5 items-start">
              <div className="w-24 h-3 bg-slate-200 rounded mt-1"></div>
              <div className="w-full h-24 bg-slate-200 rounded-2xl rounded-tr-sm"></div>
              <div className="w-24 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex flex-col gap-3">
            <div className="w-full h-28 bg-slate-50 rounded-xl border border-slate-100"></div>
            <div className="flex justify-end">
              <div className="w-32 h-10 bg-blue-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

// کامپوننت اصلی صفحه
export default async function page({params} : {params : Promise <{id:string}>}) {
    const {id} = await params;
    
    return (
    <div>
      {/* 
        قراردادن اسکلتون در ویژگی fallback 
        تا زمان لود شدن FetchDataUTA، محتوای SkeletonLoader نمایش داده می‌شود
      */}
      <Suspense fallback={<SkeletonLoader />}>
        <FetchDataUTA ticketId={id} />
      </Suspense>
    </div>
  )
}
