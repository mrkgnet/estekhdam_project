"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Edit, CheckCircle, XCircle, Star, Image as ImageIcon
} from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteNewsGovAction } from "@/actions/admin/jobnews/government/deletenews/Actions";
import SearchBar from "@/components/ui/SearchBar";

// 👇 ایمپورت کامپوننت جدید (مسیر را بر اساس پوشه‌بندی خود تنظیم کنید)
import StatusBadge from "@/components/ui/StatusBadge"; 

interface ShowDataProps {
  jobNewsData: {
    success: boolean;
    data?: any[];
    message?: string;
  };
}

export default function ShowData({ jobNewsData }: ShowDataProps) {
  const [news, setNews] = useState<any[]>(jobNewsData.data || []);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNews(jobNewsData.data || []);
  }, [jobNewsData]);


  // تبدیل تاریخ میلادی به شمسی
  const toJalali = (date: string) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // اگر سرور خطا داد یا دیتایی نبود
  if (!jobNewsData.success && !news.length) {
    return (
      <div className=" mx-auto p-6">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-center font-medium">
          {jobNewsData.message || "خطا در دریافت اطلاعات"}
        </div>
      </div>
    );
  }

  // 🌟 منطق فیلتر
  const filterdNews = news.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    const matchTitle = item.title?.toLowerCase().includes(query) ?? false;
    const matchOrg = item.organization?.toLowerCase().includes(query) ?? false;
    const matchSlug = item.slugNews?.toLowerCase().includes(query) ?? false;

    const matchJobs = item.jobs?.some((job: string) =>
      job.toLowerCase().includes(query)
    ) ?? false;

    const matchCities = item.cities?.some((city: string) =>
      city.toLowerCase().includes(query)
    ) ?? false;

    return matchTitle || matchOrg || matchSlug || matchJobs || matchCities;
  });

  return (
    <div className="p-6  mx-auto space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          مدیریت اخبار استخدامی دولتی
        </h1>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="جستجو (عنوان، سازمان، شهر، جاب)..."
          className="md:w-1/3"
        />

        <Link
          href="./add-news"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          ثبت آگهی جدید
        </Link>
      </div>

      {/* لیست آگهی‌ها - حالت جدولی */}
      {news.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">هیچ خبری تاکنون ثبت نشده است.</p>
        </div>
      ) : filterdNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">هیچ نتیجه‌ای برای جستجوی شما یافت نشد.</p>
          </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-gray-600 bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold w-16 text-center">ردیف</th>
                  <th scope="col" className="px-6 py-4 font-semibold">تصویر</th>
                  <th scope="col" className="px-6 py-4 font-semibold">عنوان، سازمان و اسلاگ</th>
                  <th scope="col" className="px-6 py-4 font-semibold">جاب (تگ)</th>
                  <th scope="col" className="px-6 py-4 font-semibold">شهرها</th>
                  <th scope="col" className="px-6 py-4 font-semibold w-40">وضعیت آگهی</th>
                  <th scope="col" className="px-6 py-4 font-semibold w-56">بازه زمانی</th>
                  <th scope="col" className="px-6 py-4 font-semibold w-32 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filterdNews.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50/30 transition-colors ${deletingId === item.id ? "opacity-50 pointer-events-none bg-red-50" : ""}`}
                  >
                    {/* ردیف */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 font-medium">
                      {index + 1}
                    </td>

                    {/* تصویر بندانگشتی */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.imageUrl && item.imageUrl !== "###" ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>

                    {/* عنوان و سازمان و اسلاگ */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[200px]">
                        <h2 className="text-sm text-gray-800 line-clamp-2 leading-relaxed" title={item.title}>
                          {item.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.organization && (
                            <span className="inline-block text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                              {item.organization}
                            </span>
                          )}
                          {item.slugNews && (
                            <span className="inline-block text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              {item.slugNews}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* جاب و تگ ها */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 min-w-[150px]">
                        {item.jobs && item.jobs.length > 0 ? (
                          item.jobs.map((job: string, i: number) => (
                            <span key={i} className="inline-block text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2 py-1 rounded-md">
                              {job}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>

                    {/* استان ها */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 min-w-[150px]">
                        {item.cities && item.cities.length > 0 ? (
                          item.cities.map((city: string, i: number) => (
                            <span key={i} className="inline-block text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 rounded-md">
                              {city}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 text-center w-full block">سراسر کشور</span>
                        )}
                      </div>
                    </td>

                    {/* وضعیت‌ها */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {/* وضعیت ثبت نام (پالس دار) - استفاده از کامپوننت مجزا */}
                        <StatusBadge status={item.status || 'NEWS'} />

                        {/* وضعیت فعال بودن در سایت */}
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-fit">
                            <CheckCircle className="w-3 h-3" /> نمایش فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit">
                            <XCircle className="w-3 h-3" /> عدم نمایش
                          </span>
                        )}

                        {/* وضعیت اسلایدر */}
                        {item.isMainSlider && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md w-fit">
                            <Star className="w-3 h-3" /> اسلایدر اصلی
                          </span>
                        )}
                      </div>
                    </td>

                    {/* بازه زمانی */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">از:</span>
                          <span className="text-gray-700">{item.startAt ? toJalali(item.startAt) : '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">تا:</span>
                          <span className="text-gray-700">{item.endAt ? toJalali(item.endAt) : '-'}</span>
                        </div>
                      </div>
                    </td>

                    {/* عملیات */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`./edit-news/${item.id}`}
                          title="ویرایش"
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        >
                          ویرایش
                        </Link>
                        <DeleteButton
                          id={item.id}
                          action={deleteNewsGovAction}
                          itemName="این خبر"
                          className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
                        >
                          حذف
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
