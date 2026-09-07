import BrandTopSlider from "@/components/user/brands/BrandsTopHome";
import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import NavbarUser from "@/components/navbar/Navbar";
import dynamic from "next/dynamic";
import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";
import HeroSection from "@/components/user/HomePage/HeroSection";
import FilterBar from "@/components/user/HomePage/FilterBar";
import TabHomePage from "@/components/user/hiroSection/TabHomePage";
import TabHomeComponent from "@/components/user/hiroSection/TabHomeComponent";
import PlansOffer from "@/components/user/plansTimer/page";
import { Suspense } from "react";
import FetchDataMainSlider from "@/components/user/home/mainslider/FetchDataMainSlider";
import SliderTopLeftComponent from "@/components/user/home/sliderTopLeft/page";
import CategoryGrid from "@/components/user/home/categoryGrid/CategoryGrid";
import QuestionCounterComponent from "@/components/user/questionCounter/QCComponent";
import QCComponent from "@/components/user/questionCounter/QCComponent";
import BrandsSSR from "@/components/user/brands/BrandsSSR";
import HiroSection from "@/components/user/hiroSection/HiroSection";
import HiroGrid from "@/components/user/hiroGrid/HiroGrid";

const BreakingNewsComponent = dynamic(() => import("@/components/user/home/breakingnews/Gov/page"), {
    loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-xl"></div>,
});


export default function page() {
    return (
        <div className="min-h-screen  text-slate-800" dir="rtl">


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
                    <BrandsSSR />
                </section>
                {/* کامپوننت فیلتربار */}

                {/* سکشن اول: اسلایدر اصلی */}
                <section className="w-full px-4 mb-4 md:mb-6">
                    <div className="w-full bg-white rounded shadow-sm border border-slate-200 overflow-hidden h-[230px] md:h-[260px]">
                        <FetchDataMainSlider />
                    </div>
                </section>
                {/* <div className="mb-12">
                    <HiroSection />
                </div> */}

                <div className="mb-12">
                    <HiroGrid />
                </div>
                {/* سکشن دوم: کامپوننت کناری که حالا زیر اسلایدر قرار گرفته */}
                <section className="w-full px-4">
                    <div className="w-full min-w-0 overflow-hidden">
                        <SliderTopLeftComponent />
                    </div>
                </section>








                {/* <section className="w-full bg-white my-4 rounded-2xl">
                    <CategoryGrid />
                </section> */}

                {/* بخش اخبار فوری */}
                {/* <section className="w-full mb-16">
                    <BreakingNewsComponent />
                </section> */}
                {/* هیرو سکشن و اسلایدر - پاس دادن مقدار داینامیک */}
                {/* <section className="mb-16">
                    <QCComponent />
                </section> */}


            </main>
        </div>
    );
}