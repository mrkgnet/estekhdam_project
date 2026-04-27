export function SkeletonUserTicketsLoader() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
      
      {/* اسکلتون هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-start gap-2.5">
          {/* آیکون هدر */}
          <div className="p-2 bg-slate-100 rounded-xl w-10 h-10 shrink-0"></div>
          <div>
            {/* عنوان */}
            <div className="w-40 h-6 bg-slate-200 rounded-md mb-2.5 mt-1"></div>
            {/* زیرنویس */}
            <div className="w-64 h-3 bg-slate-100 rounded-md"></div>
          </div>
        </div>
        {/* دکمه ثبت تیکت جدید */}
        <div className="w-full sm:w-40 h-12 bg-slate-200 rounded-xl shrink-0"></div>
      </div>

      {/* اسکلتون لیست تیکت‌ها */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* ایجاد ۴ ردیف خالی برای شبیه‌سازی لودینگ */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="block p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              
              {/* اطلاعات سمت راست تیکت (بخش اصلی) */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  {/* بج وضعیت */}
                  <div className="w-24 h-7 bg-slate-200 rounded-full"></div>
                  {/* موضوع تیکت */}
                  <div className="w-48 sm:w-64 h-5 bg-slate-200 rounded-md"></div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {/* شناسه */}
                  <div className="w-32 h-4 bg-slate-100 rounded-md"></div>
                  {/* اولویت */}
                  <div className="w-24 h-6 bg-slate-100 rounded-md"></div>
                </div>
              </div>

              {/* زمان و آیکون ورود (سمت چپ در فارسی) */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 mt-2 sm:mt-0">
                {/* تاریخ */}
                <div className="w-28 h-4 bg-slate-200 rounded-md"></div>
                {/* دایره آیکون فلش */}
                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0"></div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}