export default function DotsLoaderBrands() {
  return (
    <div className="w-full h-[120px] border rounded-2xl border-slate-400 md:h-[140px] flex items-center justify-center    ">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 blink-dot" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 blink-dot delay-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 blink-dot delay-400" />
        </div>
        <p className="text-slate-500 text-xs mt-3">لطفاً صبر کنید...</p>
      </div>

      
    </div>
  );
}
