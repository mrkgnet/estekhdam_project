"use client";
import React from "react";

// تعریف تایپ برای هر رکورد جایزه/افتخار
export interface AwardRecord {
  id: string;
  title: string;
  date: string;
  link: string;
  description: string;
}

interface AwardsAndHonorsProps {
  awards: AwardRecord[];
  onChange: (awards: AwardRecord[]) => void;
}

export default function AwardsAndHonors({ awards = [], onChange }: AwardsAndHonorsProps) {
  
  // افزودن جایزه جدید
  const handleAddAward = () => {
    const newRecord: AwardRecord = {
      id: Date.now().toString(),
      title: "",
      date: "",
      link: "",
      description: "",
    };
    onChange([...awards, newRecord]);
  };

  // حذف جایزه
  const handleRemoveAward = (id: string) => {
    const filtered = awards.filter((award) => award.id !== id);
    onChange(filtered);
  };

  // آپدیت کردن یک فیلد خاص
  const handleChange = (id: string, field: keyof AwardRecord, value: string) => {
    const updated = awards.map((award) =>
      award.id === id ? { ...award, [field]: value } : award
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">جوایز و افتخارات</h2>
          <p className="text-sm text-slate-500 mt-1">
            مقام‌ها، مدال‌ها، گواهینامه‌های معتبر یا افتخاراتی که کسب کرده‌اید را در این بخش وارد کنید.
          </p>
        </div>
      </div>

      {/* لیست جوایز */}
      <div className="space-y-6">
        {awards.map((award, index) => (
          <div 
            key={award.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveAward(award.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors z-10"
              title="حذف این مورد"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              جایزه / افتخار {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* عنوان */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">عنوان جایزه یا افتخار</label>
                <input
                  type="text"
                  placeholder="مثال: رتبه اول مسابقات برنامه‌نویسی ACM، کارمند نمونه سال..."
                  value={award.title}
                  onChange={(e) => handleChange(award.id, "title", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* تاریخ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ دریافت</label>
                <input
                  type="text"
                  placeholder="مثال: دی ۱۴۰۲"
                  value={award.date}
                  onChange={(e) => handleChange(award.id, "date", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* لینک مرتبط */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">لینک مرتبط (اختیاری)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={award.link}
                  onChange={(e) => handleChange(award.id, "link", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-left"
                  dir="ltr"
                />
              </div>

              {/* توضیحات */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات (اختیاری)</label>
                <textarea
                  rows={2}
                  placeholder="نهاد برگزارکننده، دلیل دریافت جایزه یا توضیحات تکمیلی..."
                  value={award.description}
                  onChange={(e) => handleChange(award.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن جایزه جدید */}
      <button
        onClick={handleAddAward}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن جایزه یا افتخار جدید
      </button>
    </div>
  );
}