import { Suspense } from "react";
import dynamic from "next/dynamic";

// 1. کامپوننت‌های بالای صفحه (بدون تغییر - لود فوری)
import NavbarUser from "@/components/navbar/Navbar";
import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";
import BrandTopSlider from "@/components/user/home/BrandTopSlider";
import HeroSearch from "@/components/HeroSearch";
import FetchDataMainSlider from "../components/user/home/mainslider/FetchDataMainSlider";

// 🟢 فقط کامپوننت فچ‌کننده را ایمپورت می‌کنیم (فایل‌های اضافی حذف شدند)
import FetchDataFRC from "@/components/user/freeResourceComponent/FetchDataFRC";

// 2. کامپوننت‌های پایین صفحه (Lazy Load با next/dynamic)
const SliderTopLeftComponent = dynamic(() => import("@/components/user/home/sliderTopLeft/page"), {
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl min-h-[220px]"></div>,
});

const BreakingNewsComponent = dynamic(() => import("@/components/user/home/breakingnews/Gov/page"), {
  loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-xl"></div>,
});

const CategoryGrid = dynamic(() => import("@/components/user/home/categoryGrid/CategoryGrid"), {
  loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl"></div>,
});

const TabProductCat = dynamic(() => import("@/components/tabProductCat/TabProductCat"), {
  loading: () => <div className="h-96 w-full bg-slate-100 animate-pulse rounded-xl"></div>,
});

export default function HomePage() {
  return (
    <div>
      <HeaderTopComponnet />
      <NavbarUser />

      <div className="flex min-h-screen font-sans">
        <SideBarUserComponent />

        <main className="min-w-0 max-w-7xl m-auto flex-1 flex flex-col py-4 md:py-4 overflow-x-hidden">
          <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 space-y-4 md:space-y-6 lg:space-y-8">

            {/* بخش‌های بالای صفحه - لود فوری */}
            <section className="w-full">
              <BrandTopSlider />
            </section>

            <section className="w-full bg-white">
              <HeroSearch />
            </section>

            <section className="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6">
              <div className="lg:col-span-4">
                <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden h-[220px] md:h-full">
                  <Suspense fallback={<div className="h-full w-full bg-slate-100 animate-pulse"></div>}>
                    <FetchDataMainSlider />
                  </Suspense>
                </div>
              </div>
              <div className="lg:col-span-2 min-w-0 overflow-hidden h-full">
                <SliderTopLeftComponent />
              </div>
            </section>

            {/* بخش‌های پایین صفحه - لود تنبل */}
            <section className="w-full">
              <BreakingNewsComponent />
            </section>

            <section className="w-full bg-white rounded-2xl">
              <CategoryGrid />
            </section>

            <section className="w-full">
              <TabProductCat />
            </section>

            {/* 🟢 بخش منابع رایگان با اضافه شدن Suspense برای لودینگ اسکلتونی */}
            <section className="w-full mb-8">
              <Suspense fallback={<div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl"></div>}>
                <FetchDataFRC />
              </Suspense>
            </section>
            
         
          </div>
        </main>
      </div>
    </div>
  );
}