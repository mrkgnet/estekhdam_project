export function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          {/* عنوان */}
          <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
          {/* مقدار */}
          <div className="h-8 w-12 bg-slate-200 rounded mb-3"></div>
          {/* متن راهنما */}
          <div className="h-3 w-24 bg-slate-200 rounded"></div>
        </div>

        {/* آیکون */}
        <div className="w-11 h-11 rounded-2xl bg-slate-200 flex-shrink-0"></div>
      </div>

      {/* نوار پیشرفت پایین کارت */}
      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}
