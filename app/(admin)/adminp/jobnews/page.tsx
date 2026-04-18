import Link from "next/link";
import { Building2, Landmark, ArrowLeft, Pencil } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">

        {/* title */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            مدیریت آگهی استخدام
          </h1>
          <p className="text-slate-500 mt-2">
            عملیات مورد نظر را انتخاب کنید
          </p>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* create government */}
          <Link
            href="./jobnews/government/add-news"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl transition"
          >
            <div className="relative flex flex-col h-full">

              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-5">
                <Landmark size={28} />
              </div>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                ثبت آگهی استخدام دولتی
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                انتشار آگهی استخدام برای سازمان‌ها و نهادهای دولتی
              </p>

              <div className="mt-auto flex items-center gap-2 text-blue-600 font-medium">
                ثبت آگهی
                <ArrowLeft size={18} />
              </div>

            </div>
          </Link>


          
          {/* edit government */}
          <Link
            href="./jobnews/government/edit-news"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl transition"
          >
            <div className="relative flex flex-col h-full">

              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-5">
                <Pencil size={28} />
              </div>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                مشاهده و ویرایش آگهی استخدام دولتی 
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                مشاهده و ویرایش آگهی‌های استخدامی دولتی ثبت شده
              </p>

              <div className="mt-auto flex items-center gap-2 text-amber-600 font-medium">
                ویرایش آگهی
                <ArrowLeft size={18} />
              </div>

            </div>
          </Link>

          {/* create private */}
          <Link
            href="/"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl transition"
          >
            <div className="relative flex flex-col h-full">

              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-5">
                <Building2 size={28} />
              </div>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                ثبت آگهی استخدام خصوصی
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                مناسب شرکت‌ها و کسب‌وکارهای خصوصی
              </p>

              <div className="mt-auto flex items-center gap-2 text-emerald-600 font-medium">
                ثبت آگهی
                <ArrowLeft size={18} />
              </div>

            </div>
          </Link>


          {/* edit private */}
          <Link
            href="/adminp/news-managment/edit-private"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl transition"
          >
            <div className="relative flex flex-col h-full">

              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-5">
                <Pencil size={28} />
              </div>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                ویرایش آگهی استخدام خصوصی
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                مشاهده و ویرایش آگهی‌های استخدامی خصوصی ثبت شده
              </p>

              <div className="mt-auto flex items-center gap-2 text-purple-600 font-medium">
                ویرایش آگهی
                <ArrowLeft size={18} />
              </div>

            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
