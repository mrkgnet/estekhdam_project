import BrandTopSlider from "@/components/user/home/BrandTopSlider";
import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import NavbarUser from "@/components/navbar/Navbar";
import dynamic from "next/dynamic";
import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";
import HeroSection from "@/components/user/HomePage/HeroSection";
import FilterBar from "@/components/user/HomePage/FilterBar";
import TabHomePage from "@/components/user/tabHomePage/TabHomePage";
import TabHomeComponent from "@/components/user/tabHomePage/TabHomeComponent";
import PlansOffer from "@/components/user/plansTimer/page";
import { Suspense } from "react";
import FetchDataMainSlider from "@/components/user/home/mainslider/FetchDataMainSlider";
import SliderTopLeftComponent from "@/components/user/home/sliderTopLeft/page";
import CategoryGrid from "@/components/user/home/categoryGrid/CategoryGrid";

const BreakingNewsComponent = dynamic(() => import("@/components/user/home/breakingnews/Gov/page"), {
    loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-xl"></div>,
});


export default function page() {
    return (
        <div className="min-h-screen bg-white text-slate-800" dir="rtl">

            <div className="pointer-events-none absolute -top-8 left-0 opacity-30">
                <svg width="856" height="655" viewBox="0 0 856 655" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                        <ellipse cx="166.838" cy="-18.3242" rx="648.861" ry="631.697" transform="rotate(3.73993 166.838 -18.3242)" stroke="url(#paint0)" />
                        <ellipse opacity="0.500465" cx="9" cy="-41" rx="678" ry="583" fill="url(#paint1)" />
                    </g>
                    <defs>
                        <linearGradient id="paint0" x1="-813.07" y1="-52.9581" x2="-68.6958" y2="953.258" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4CAF50" />
                            <stop offset="1" stopColor="#03ACF2" />
                        </linearGradient>
                        <linearGradient id="paint1" x1="-1014.91" y1="-72.964" x2="-356.962" y2="933.995" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#C8E6C9" />
                            <stop offset="1" stopColor="#B3E5FC" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* بخش هدر و ناوبری */}
            <HeaderTopComponnet />
            <NavbarUser />
            <SideBarUserComponent />

            <main className=" mx-auto ">
                <section className="pb-10">
                    <PlansOffer />
                </section>

                {/* اسلایدر برندها */}
                <section className="pb-10">
                    <BrandTopSlider />
                </section>
                {/* کامپوننت فیلتربار */}
                {/* <div className="mb-12">
                    <FilterBar />
                </div> */}


                <section className=" px-4 grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6">
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

                <div className="mb-12">
                    <TabHomeComponent />
                </div>


                {/* هیرو سکشن و اسلایدر - پاس دادن مقدار داینامیک */}
                {/* <section className="mb-16">
                    <HeroSection questionsCount={questionsCount} />
                </section> */}



                <section className="w-full bg-white rounded-2xl">
                    <CategoryGrid />
                </section>

                {/* بخش اخبار فوری */}
                {/* <section className="w-full mb-16">
                    <BreakingNewsComponent />
                </section> */}


            </main>
        </div>
    );
}