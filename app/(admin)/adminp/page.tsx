
import UploadImage from "@/components/admin/uploadImage";
import { ArrowUpRight, DollarSign, Users } from "lucide-react";
import Link from "next/link";



export default async function page() {
  // فراخوانی داده‌ها از سمت سرور

  return (
    <div className="max-w-4xl mx-auto w-full mt-3">
      {/* هدر صفحه */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>
        <p className="text-gray-500 mt-1">خلاصه‌ای از وضعیت کسب‌وکار شما در یک نگاه</p>
      </div>

      {/* بخش کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div

          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div  >

            </div>
            <span className="flex items-center gap-1 text-xs font-medium py-1 px-2 rounded-full bg-green-50 text-green-600">

              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500"></p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight"></h3>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href={"/adminp/user-managment"} className="text-xs text-blue-600 font-semibold hover:underline">
              مشاهده جزئیات بیشتر
            </Link>
          </div>
        </div>
      <UploadImage />
      </div>

      {/* بخش پیش‌نمایش نمودار */}
      <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-400">محل قرارگیری نمودار فروش4332341</p>
        </div>
      </div>
    </div>
  );
}
