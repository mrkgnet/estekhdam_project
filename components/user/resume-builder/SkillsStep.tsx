"use client";
import React from "react";

// تعریف تایپ برای هر رکورد مهارت
export interface SkillRecord {
  id: string;
  title: string;
  level: string; // تغییر تایپ به استرینگ برای مقادیر دراپ‌داون
}

interface SkillsStepProps {
  skills: SkillRecord[];
  onChange: (skills: SkillRecord[]) => void;
}

export default function SkillsStep({ skills = [], onChange }: SkillsStepProps) {
  
  // افزودن مهارت جدید
  const handleAddSkill = () => {
    const newRecord: SkillRecord = {
      id: Date.now().toString(),
      title: "",
      level: "متوسط", // سطح پیش‌فرض را روی متوسط می‌گذاریم
    };
    onChange([...skills, newRecord]);
  };

  // حذف مهارت
  const handleRemoveSkill = (id: string) => {
    const filtered = skills.filter((skill) => skill.id !== id);
    onChange(filtered);
  };

  // آپدیت عنوان مهارت
  const handleChangeTitle = (id: string, title: string) => {
    const updated = skills.map((skill) =>
      skill.id === id ? { ...skill, title } : skill
    );
    onChange(updated);
  };

  // آپدیت سطح مهارت
  const handleChangeLevel = (id: string, level: string) => {
    const updated = skills.map((skill) =>
      skill.id === id ? { ...skill, level } : skill
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">مهارت‌ها</h2>
          <p className="text-sm text-slate-500 mt-1">
            مهارت‌های تخصصی و نرم خود را وارد کنید و سطح تسلط خود را انتخاب نمایید.
          </p>
        </div>
      </div>

      {/* لیست مهارت‌ها */}
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md flex flex-col gap-4"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveSkill(skill.id)}
              className="absolute top-3 left-3 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors z-10"
              title="حذف این مهارت"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* بخش فیلدها کنار هم */}
            <div className="flex flex-col sm:flex-row gap-4 pl-10">
              
              {/* عنوان مهارت */}
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان مهارت</label>
                <input
                  type="text"
                  placeholder="مثال: Next.js، فن بیان، فتوشاپ..."
                  value={skill.title}
                  onChange={(e) => handleChangeTitle(skill.id, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              {/* سطح مهارت (منوی دراپ‌داون) */}
              <div className="w-full sm:w-1/3 flex flex-col gap-1.5 relative">
                <label className="text-sm font-medium text-slate-700">سطح تسلط</label>
                <div className="relative">
                  <select
                    value={skill.level}
                    onChange={(e) => handleChangeLevel(skill.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="ضعیف">ضعیف</option>
                    <option value="متوسط">متوسط</option>
                    <option value="خوب">خوب</option>
                    <option value="عالی">عالی</option>
                    <option value="بسیار عالی">بسیار عالی</option>
                  </select>
                  {/* آیکون فلش برای دراپ‌داون */}
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن مهارت جدید */}
      <button
        onClick={handleAddSkill}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        افزودن مهارت جدید
      </button>
    </div>
  );
}