// app/dashboard/page.tsx
import DashboardHeader from "@/components/user/dashboard/header/DashboardHeader";

import QuickActions from "@/components/user/dashboard/QuickActions";

import ActivityFeed from "@/components/user/dashboard/ActivityFeed";

import ProfileCompletion from "@/components/user/dashboard/ProfileCompletion";
import KpiGrid from "@/components/user/dashboard/kpicard/page";
import MyCourses from "@/components/user/dashboard/mycourse/page";
import RecentOrders from "@/components/user/dashboard/recentorder/page";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 py-5 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main */}
          <div className="lg:col-span-8 space-y-5">
            <KpiGrid />
            <MyCourses />
            <RecentOrders />
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