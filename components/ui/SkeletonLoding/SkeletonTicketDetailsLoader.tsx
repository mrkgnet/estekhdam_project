 export function SkeletonTicketDetailsLoader() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
      
      {/* اسکلتون دکمه بازگشت */}
      <div className="w-48 h-10 bg-white rounded-xl border border-slate-200 shadow-sm"></div>

      {/* اسکلتون باکس اطلاعات اصلی تیکت */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm relative overflow-hidden">
        {/* نوار رنگی بالای کارت (حالت لودینگ طوسی) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200"></div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mt-2">
          <div className="space-y-4 flex-1 w-full">
            {/* عنوان تیکت */}
            <div className="w-3/4 sm:w-1/2 h-8 bg-slate-200 rounded-lg"></div>
            
            {/* باکس متادیتا (شناسه و تاریخ) */}
            <div className="w-full sm:w-[340px] h-12 bg-slate-50 rounded-2xl border border-slate-100"></div>
          </div>
          
          {/* باکس بج‌های وضعیت و اولویت */}
          <div className="w-48 h-12 bg-slate-50 rounded-2xl border border-slate-100 shrink-0"></div>
        </div>
      </div>

      {/* اسکلتون باکس چت / تاریخچه پیام‌ها */}
      <div className="bg-slate-50/50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* هدر بخش چت */}
        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
          {/* عنوان هدر */}
          <div className="w-32 h-5 bg-slate-200 rounded-md"></div>
          {/* تعداد پیام */}
          <div className="w-16 h-4 bg-slate-100 rounded-md"></div>
        </div>
        
        {/* محیط چت (شبیه‌سازی چند پیام) */}
        <div className="p-4 md:p-6 space-y-6">
          
          {/* شبیه‌سازی پیام کاربر (سمت راست - justify-start در RTL) */}
          <div className="flex w-full justify-start">
            <div className="flex max-w-[90%] sm:max-w-[75%] gap-3 flex-row">
              <div className="flex-shrink-0 mt-1">
                {/* آواتار کاربر */}
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"></div>
              </div>
              {/* حباب پیام کاربر */}
              <div className="w-64 sm:w-80 h-24 bg-blue-100/50 rounded-2xl rounded-tr-sm"></div>
            </div>
          </div>

          {/* شبیه‌سازی پیام پشتیبانی (سمت چپ - justify-end در RTL) */}
          <div className="flex w-full justify-end">
            <div className="flex max-w-[90%] sm:max-w-[75%] gap-3 flex-row-reverse">
              <div className="flex-shrink-0 mt-1">
                {/* آواتار پشتیبانی */}
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"></div>
              </div>
              {/* حباب پیام پشتیبانی */}
              <div className="w-72 sm:w-96 h-32 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm"></div>
            </div>
          </div>

          {/* شبیه‌سازی پیام دوم کاربر (کوتاه‌تر) */}
          <div className="flex w-full justify-start">
            <div className="flex max-w-[90%] sm:max-w-[75%] gap-3 flex-row">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"></div>
              </div>
              <div className="w-48 sm:w-60 h-16 bg-blue-100/50 rounded-2xl rounded-tr-sm"></div>
            </div>
          </div>

        </div>
        
        {/* اسکلتون بخش فرم پاسخ‌گویی در پایین چت */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="w-full h-14 bg-slate-100 rounded-2xl border border-slate-100"></div>
        </div>
      </div>

    </div>
  );
}