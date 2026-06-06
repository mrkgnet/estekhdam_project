"use client";
import React from "react";

// تعریف تایپ برای هر رکورد کارآموزی
export interface InternshipRecord {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

interface InternshipProps {
  internships: InternshipRecord[];
  onChange: (internships: InternshipRecord[]) => void;
}

export default function Internship({ internships = [], onChange }: InternshipProps) {
  
  // افزودن کارآموزی جدید
  const handleAddInternship = () => {
    const newRecord: InternshipRecord = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
    };
    onChange([...internships, newRecord]);
  };

  // حذف کارآموزی
  const handleRemoveInternship = (id: string) => {
    const filtered = internships.filter((item) => item.id !== id);
    onChange(filtered);
  };

  // آپدیت کردن یک فیلد خاص
  const handleChange = (id: string, field: keyof InternshipRecord, value: string) => {
    const updated = internships.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">سوابق کارآموزی</h2>
          <p className="text-sm text-slate-500 mt-1">
            دوره‌های کارآموزی، تجربیات عملی و پروژه‌های کارورزی خود را در این بخش وارد کنید.
          </p>
        </div>
      </div>

      {/* لیست دوره‌های کارآموزی */}
      <div className="space-y-6">
        {internships.map((internship, index) => (
          <div 
            key={internship.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveInternship(internship.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors z-10"
              title="حذف این مورد"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              دوره کارآموزی {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* عنوان شغلی / موقعیت */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان شغلی / سمت کارآموزی</label>
                <input
                  type="text"
                  placeholder="مثال: کارآموز فرانت‌اند، کارورز حسابداری..."
                  value={internship.jobTitle}
                  onChange={(e) => handleChange(internship.id, "jobTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* عنوان مرکز اشتغال / شرکت */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان مرکز اشتغال / شرکت</label>
                <input
                  type="text"
                  placeholder="مثال: شرکت توسعه‌دهندگان وب..."
                  value={internship.company}
                  onChange={(e) => handleChange(internship.id, "company", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* شهر */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">شهر</label>
                <input
                  type="text"
                  placeholder="مثال: تهران، مشهد (یا دورکاری)"
                  value={internship.city}
                  onChange={(e) => handleChange(internship.id, "city", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* تاریخ شروع */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ شروع</label>
                <input
                  type="text"
                  placeholder="مثال: تیر ۱۴۰۱"
                  value={internship.startDate}
                  onChange={(e) => handleChange(internship.id, "startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* تاریخ پایان */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ پایان</label>
                <input
                  type="text"
                  placeholder="مثال: شهریور ۱۴۰۱"
                  value={internship.endDate}
                  onChange={(e) => handleChange(internship.id, "endDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* توضیحات */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات (وظایف و دستاوردها)</label>
                <textarea
                  rows={3}
                  placeholder="شرح وظایف کلیدی، تکنولوژی‌هایی که یاد گرفتید یا پروژه‌هایی که در آن‌ها مشارکت داشتید..."
                  value={internship.description}
                  onChange={(e) => handleChange(internship.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن کارآموزی جدید */}
      <button
        onClick={handleAddInternship}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن دوره کارآموزی جدید
      </button>
    </div>
  );
}