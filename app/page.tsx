import LastProduct from "@/components/home/LastProduct";
import MainSlider from "@/components/home/MainSlider";
import NewsList from "@/components/home/NewsList";
import SliderLeftTop from "@/components/home/SliderLeftTop";
import SideBar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      
      {/* سایدبار فقط دسکتاپ */}
      <div className=" hidden lg:block">
        <SideBar />
      </div>

      {/* محتوای اصلی */}
      <main className="flex-1 min-w-0 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          
          <div className="flex flex-col lg:flex-row gap-5">
            
            {/* ستون اصلی */}
            <section className="flex-1 min-w-0 space-y-5">
              
              {/* اسلایدر */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="h-[180px] sm:h-[226px]">
                  <MainSlider />
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-28 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>

              {/* محصولات */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <LastProduct />
              </div>
            </section>

            {/* ستون کناری (فقط دسکتاپ) */}
            <aside className="w-full lg:w-[360px] shrink-0 hidden lg:block text-[14px]">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                
                <div className="p-5 border-b border-slate-100 font-semibold">
                  جدید ترین ها
                </div>

                <div className="p-4 border-b border-slate-100">
                  <SliderLeftTop />
                </div>

                <div className="p-4 space-y-4">
                  <NewsList />
                </div>

              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}