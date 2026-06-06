"use client";
import React from "react";

// تعریف تایپ برای هر رکورد پروژه
export interface ProjectRecord {
  id: string;
  title: string;
  client: string;
  startDate: string;
  endDate: string;
  link: string;
  description: string;
}

interface ProjectsStepProps {
  projects: ProjectRecord[];
  onChange: (projects: ProjectRecord[]) => void;
}

export default function ProjectsStep({ projects = [], onChange }: ProjectsStepProps) {
  
  // افزودن پروژه جدید
  const handleAddProject = () => {
    const newRecord: ProjectRecord = {
      id: Date.now().toString(),
      title: "",
      client: "",
      startDate: "",
      endDate: "",
      link: "",
      description: "",
    };
    onChange([...projects, newRecord]);
  };

  // حذف پروژه
  const handleRemoveProject = (id: string) => {
    const filtered = projects.filter((project) => project.id !== id);
    onChange(filtered);
  };

  // آپدیت کردن یک فیلد خاص در یک پروژه مشخص
  const handleChange = (id: string, field: keyof ProjectRecord, value: string) => {
    const updated = projects.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">پروژه‌ها</h2>
          <p className="text-sm text-slate-500 mt-1">
            پروژه‌های کاری، دانشگاهی یا شخصی برجسته‌ای که انجام داده‌اید را در این بخش اضافه کنید.
          </p>
        </div>
      </div>

      {/* لیست پروژه‌ها */}
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveProject(project.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
              title="حذف این پروژه"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              پروژه {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* عنوان پروژه */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان پروژه</label>
                <input
                  type="text"
                  placeholder="مثال: طراحی وب‌سایت شرکتی..."
                  value={project.title}
                  onChange={(e) => handleChange(project.id, "title", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* کارفرما / درخواست دهنده */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">کارفرما / درخواست دهنده</label>
                <input
                  type="text"
                  placeholder="مثال: شرکت فلان، پروژه شخصی، دانشگاه..."
                  value={project.client}
                  onChange={(e) => handleChange(project.id, "client", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* تاریخ شروع */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ شروع</label>
                <input
                  type="text"
                  placeholder="مثال: اردیبهشت ۱۴۰۲"
                  value={project.startDate}
                  onChange={(e) => handleChange(project.id, "startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* تاریخ پایان */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تاریخ پایان</label>
                <input
                  type="text"
                  placeholder="مثال: آبان ۱۴۰۲ (یا در حال انجام)"
                  value={project.endDate}
                  onChange={(e) => handleChange(project.id, "endDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-right"
                  dir="rtl"
                />
              </div>

              {/* لینک پروژه */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">لینک پروژه (اختیاری)</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={project.link}
                  onChange={(e) => handleChange(project.id, "link", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-left"
                  dir="ltr"
                />
              </div>

              {/* توضیحات */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات</label>
                <textarea
                  rows={3}
                  placeholder="درباره پروژه، تکنولوژی‌های استفاده شده، نقش شما و دستاوردها توضیح دهید..."
                  value={project.description}
                  onChange={(e) => handleChange(project.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن پروژه جدید */}
      <button
        onClick={handleAddProject}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن پروژه جدید
      </button>
    </div>
  );
}