// app/dashboard/page.tsx
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiGrid from "@/components/dashboard/KpiGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentOrders from "@/components/dashboard/RecentOrders";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import MyCourses from "@/components/dashboard/MyCourses";
import ProfileCompletion from "@/components/dashboard/ProfileCompletion";

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
            <ActivityFeed />
          </aside>
        </div>
      </div>
    </div>
  );
}