export default function FilterFreeResourceSkeleton() {
  return (
    <>
      {/* دکمه موبایل skeleton */}
      <div className="lg:hidden w-full mb-4">
        <div className="w-full h-[52px] bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* سایدبار دسکتاپ skeleton */}
      <aside className="hidden lg:flex flex-col w-full lg:w-1/4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6 gap-4">
        {/* هدر */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="h-5 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        {/* search input */}
        <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
        {/* آیتم‌های فیلتر */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-11 w-full bg-gray-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.1 }} />
        ))}
      </aside>
    </>
  );
}
