"use client";
import React from "react";

// تعریف تایپ برای هر رکورد شغلی
export interface WorkRecord {
  id: string;
  jobTitle: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkStepProps {
  experiences: WorkRecord[];
  onChange: (experiences: WorkRecord[]) => void;
}

export default function WorkStep({ experiences = [], onChange }: WorkStepProps) {
  
  // افزودن سابقه شغلی جدید
  const handleAddWork = () => {
    const newRecord: WorkRecord = {
      id: Date.now().toString(), // تولید یک ID یکتا
      jobTitle: "",
      company: "",
      city: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange([...experiences, newRecord]);
  };

  // حذف سابقه شغلی
  const handleRemoveWork = (id: string) => {
    const filtered = experiences.filter((work) => work.id !== id);
    onChange(filtered);
  };

  // به‌روزرسانی فیلد خاص در یک سابقه مشخص
  const handleChange = (id: string, field: keyof WorkRecord, value: string) => {
    const updated = experiences.map((work) =>
      work.id === id ? { ...work, [field]: value } : work
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">سوابق شغلی</h2>
          <p className="text-sm text-slate-500 mt-1">
            تجربیات کاری و سوابق اشتغال خود را از جدیدترین به قدیمی‌ترین وارد کنید.
          </p>
        </div>
      </div>

      {/* لیست تجربیات کاری */}
      <div className="space-y-6">
        {experiences.map((work, index) => (
          <div 
            key={work.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveWork(work.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
              title="حذف این سابقه شغلی"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              سابقه شغلی {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* عنوان شغلی / سمت */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان شغلی / سمت</label>
                <input
                  type="text"
                  placeholder="مثال: توسعه‌دهنده فرانت‌اند، مدیر فروش..."
                  value={work.jobTitle}
                  onChange={(e) => handleChange(work.id, "jobTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* نام شرکت / سازمان */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">نام شرکت / سازمان</label>
                <input
                  type="text"
                  placeholder="مثال: شرکت داده‌پردازی پویان..."
                  value={work.company}
                  onChange={(e) => handleChange(work.id, "company", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* شهر محل کار */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">شهر</label>
                <input
                  type="text"
                  placeholder="مثال: تهران، اصفهان (یا دورکاری)"
                  value={work.city}
                  onChange={(e) => handleChange(work.id, "city", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* تاریخ شروع همکاری */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ شروع (ماه و سال)</label>
                <input
                  type="text"
                  placeholder="مثال: فروردین ۱۴۰۰"
                  value={work.startDate}
                  onChange={(e) => handleChange(work.id, "startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* تاریخ پایان همکاری */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ پایان (ماه و سال)</label>
                <input
                  type="text"
                  placeholder="مثال: اسفند ۱۴۰۲ (یا در حال اشتغال)"
                  value={work.endDate}
                  onChange={(e) => handleChange(work.id, "endDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* توضیحات، وظایف و دستاوردها */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات (وظایف و دستاوردها)</label>
                <textarea
                  rows={4}
                  placeholder="شرح وظایف کلیدی، دستاوردهای شاخص، تکنولوژی‌ها یا ابزارهای استفاده شده..."
                  value={work.description}
                  onChange={(e) => handleChange(work.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن سابقه شغلی جدید */}
      <button
        onClick={handleAddWork}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن سابقه شغلی جدید
      </button>
    </div>
  );
}