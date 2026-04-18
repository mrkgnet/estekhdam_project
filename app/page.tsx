import SideBar from "@/components/user/Sidebar";
// import Header from "@/components/Header"; 
import FetchDataMainSlider from "../components/user/home/mainslider/FetchDataMainSlider";
import BreakingNewsComponent from "@/components/user/home/breakingnews/Gov/page";
import LatestProductComponent from "@/components/user/home/productAndCategories/page";
import BrandTopSlider from "@/components/user/home/BrandTopSlider";
// import BankProductComponent from "@/components/user/home/TopicResource/page"; // این مورد استفاده نشده بود
import TopicProductComponent from "@/components/user/home/TopicResource/page";
import SliderTopLeftComponent from "@/components/user/home/sliderTopLeft/page";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/user/home/categoryGrid/CategoryGrid";
import ProductAndCategories from "@/components/user/home/productAndCategories/page";

import NavbarUser from "@/components/navbar/Navbar";
import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import { ChevronLeft, Flame } from "lucide-react";
import Link from "next/link";
import { employmentNotebooksTabs, publicEmploymentTabs } from "@/lib/constats";
import TabProductCat from "@/components/tabProductCat/TabProductCat";
import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";

export default function HomePage() {
  return (
    <div>
      <HeaderTopComponnet />
      <NavbarUser />

      <div className="flex min-h-screen  font-sans">
        {/* 
        نکته UX: سایدبار در حالت موبایل معمولا باید مخفی شود (مثلا hidden lg:flex) 
        و با یک دکمه همبرگری باز شود. فرض بر این است که این هندلینگ داخل خود کامپوننت SideBar انجام شده است.
      */}


       <SideBarUserComponent />

        <main className="min-w-0 max-w-7xl m-auto flex-1 flex flex-col py-4 md:py-4 overflow-x-hidden">
          <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-6 lg:space-y-8">

            <section className="w-full">
              <BrandTopSlider />
            </section>
            <section className="w-full">
              <HeroSearch />
            </section>
            <section className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
                  <FetchDataMainSlider />
                </div>
              </div>
              <div className="lg:col-span-1 min-w-0  overflow-hidden h-full">
                <SliderTopLeftComponent />
              </div>
            </section>
            <section>
              {/* جدیدترین خبرها */}
              <div className="w-full">
                <BreakingNewsComponent />
              </div>
            </section>


            {/* categor section  */}
            <section className="w-full">
              <CategoryGrid />
            </section>

            {/* ============================== */}
            {/* بخش اول:   پرمخاطب */}
            {/* ============================== */}
   
            <div>
              <TabProductCat />
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}
