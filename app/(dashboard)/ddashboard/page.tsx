// app/dashboard/page.tsx
import DashboardHeader from "@/components/user/dashboard/header/DashboardHeader";
import QuickActions from "@/components/user/dashboard/QuickActions";
import ProfileCompletion from "@/components/user/dashboard/ProfileCompletion";
import KpiGrid from "@/components/user/dashboard/kpicard/page";
// import MyCourses from "@/components/user/dashboard/mycourse/page";
import RecentOrders from "@/components/user/dashboard/recentorder/page";
import PlansOffer from "@/components/user/plansTimer/page";

// ۱. اضافه کردن تایپ برای searchParams
interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ۲. اضافه کردن async و دریافت searchParams
export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <div className="min-h-screen">
      <section className="pb-10">
        <PlansOffer />
      </section>


      <div className="max-w-7xl mx-auto  px-3 py-5 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">



          {/* Main */}
          <div className="lg:col-span-8 space-y-5">
            <DashboardHeader />
            <KpiGrid />
            {/* <MyCourses /> */}

            {/* ۳. پاس دادن searchParams به کامپوننت RecentOrders */}
            <RecentOrders searchParams={searchParams} />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <ProfileCompletion />
            <QuickActions />
          </aside>
        </div>
      </div>
    </div>
  );
}
