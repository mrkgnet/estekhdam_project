"use client";
import React from "react";

// تعریف تایپ برای هر رکورد تحقیق/مقاله
export interface ResearchRecord {
  id: string;
  title: string;
  publisher: string;
  startDate: string;
  endDate: string;
  link: string;
  description: string;
}

interface ResearchStepProps {
  researches: ResearchRecord[];
  onChange: (researches: ResearchRecord[]) => void;
}

export default function ResearchStep({ researches = [], onChange }: ResearchStepProps) {
  
  // افزودن تحقیق جدید
  const handleAddResearch = () => {
    const newRecord: ResearchRecord = {
      id: Date.now().toString(),
      title: "",
      publisher: "",
      startDate: "",
      endDate: "",
      link: "",
      description: "",
    };
    onChange([...researches, newRecord]);
  };

  // حذف تحقیق
  const handleRemoveResearch = (id: string) => {
    const filtered = researches.filter((research) => research.id !== id);
    onChange(filtered);
  };

  // آپدیت کردن یک فیلد خاص
  const handleChange = (id: string, field: keyof ResearchRecord, value: string) => {
    const updated = researches.map((research) =>
      research.id === id ? { ...research, [field]: value } : research
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">تحقیقات و مقالات</h2>
          <p className="text-sm text-slate-500 mt-1">
            سوابق پژوهشی، مقالات چاپ شده، کتب یا پروژه‌های تحقیقاتی خود را وارد کنید.
          </p>
        </div>
      </div>

      {/* لیست تحقیقات */}
      <div className="space-y-6">
        {researches.map((research, index) => (
          <div 
            key={research.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveResearch(research.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
              title="حذف این مورد"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              پژوهش {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* عنوان */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان تحقیق / مقاله</label>
                <input
                  type="text"
                  placeholder="مثال: بررسی تاثیر هوش مصنوعی بر..."
                  value={research.title}
                  onChange={(e) => handleChange(research.id, "title", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* ناشر */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">ناشر / ژورنال / همایش</label>
                <input
                  type="text"
                  placeholder="مثال: ژورنال IEEE، دانشگاه تهران..."
                  value={research.publisher}
                  onChange={(e) => handleChange(research.id, "publisher", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* تاریخ شروع */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ شروع</label>
                <input
                  type="text"
                  placeholder="مثال: بهمن ۱۴۰۱"
                  value={research.startDate}
                  onChange={(e) => handleChange(research.id, "startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* تاریخ پایان */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ پایان (یا انتشار)</label>
                <input
                  type="text"
                  placeholder="مثال: شهریور ۱۴۰۲"
                  value={research.endDate}
                  onChange={(e) => handleChange(research.id, "endDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* لینک مرتبط */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">لینک مرتبط (اختیاری)</label>
                <input
                  type="text"
                  placeholder="https://doi.org/..."
                  value={research.link}
                  onChange={(e) => handleChange(research.id, "link", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-left"
                  dir="ltr"
                />
              </div>

              {/* توضیحات */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات (چکیده یا دستاوردها)</label>
                <textarea
                  rows={3}
                  placeholder="خلاصه‌ای از موضوع تحقیق، روش‌شناسی یا نتایج به دست آمده را بنویسید..."
                  value={research.description}
                  onChange={(e) => handleChange(research.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن تحقیق جدید */}
      <button
        onClick={handleAddResearch}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن پژوهش جدید
      </button>
    </div>
  );
}