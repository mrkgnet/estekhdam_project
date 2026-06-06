"use client";
import React from "react";

// تعریف تایپ برای هر رکورد مهارت نرم‌افزاری
export interface SoftwareSkillRecord {
  id: string;
  title: string;
  level: string; // سطح تسلط (مثلاً ضعیف، متوسط، و...)
  description: string;
}

interface SoftwareSkillsStepProps {
  softwareSkills: SoftwareSkillRecord[];
  onChange: (softwareSkills: SoftwareSkillRecord[]) => void;
}

export default function SoftwareSkillsStep({ softwareSkills = [], onChange }: SoftwareSkillsStepProps) {
  
  // افزودن مهارت نرم‌افزاری جدید
  const handleAddSkill = () => {
    const newRecord: SoftwareSkillRecord = {
      id: Date.now().toString(),
      title: "",
      level: "متوسط", // مقدار پیش‌فرض
      description: "",
    };
    onChange([...softwareSkills, newRecord]);
  };

  // حذف مهارت نرم‌افزاری
  const handleRemoveSkill = (id: string) => {
    const filtered = softwareSkills.filter((skill) => skill.id !== id);
    onChange(filtered);
  };

  // آپدیت کردن یک فیلد خاص
  const handleChange = (id: string, field: keyof SoftwareSkillRecord, value: string) => {
    const updated = softwareSkills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">مهارت‌های نرم‌افزاری</h2>
          <p className="text-sm text-slate-500 mt-1">
            نرم‌افزارها، ابزارها و برنامه‌هایی که به آن‌ها مسلط هستید را به همراه سطح خود وارد کنید.
          </p>
        </div>
      </div>

      {/* لیست مهارت‌های نرم‌افزاری */}
      <div className="space-y-6">
        {softwareSkills.map((skill, index) => (
          <div 
            key={skill.id} 
            className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md"
          >
            {/* دکمه حذف */}
            <button
              onClick={() => handleRemoveSkill(skill.id)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors z-10"
              title="حذف این مهارت"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">
              نرم‌افزار {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* عنوان مهارت نرم‌افزاری */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">عنوان نرم‌افزار / ابزار</label>
                <input
                  type="text"
                  placeholder="مثال: Photoshop, Excel, VS Code..."
                  value={skill.title}
                  onChange={(e) => handleChange(skill.id, "title", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  dir="auto"
                />
              </div>

              {/* سطح مهارت (منوی دراپ‌داون) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">سطح تسلط</label>
                <div className="relative">
                  <select
                    value={skill.level}
                    onChange={(e) => handleChange(skill.id, "level", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="آشنایی نسبی">آشنایی نسبی (ضعیف)</option>
                    <option value="متوسط">متوسط</option>
                    <option value="خوب">خوب</option>
                    <option value="عالی">عالی</option>
                    <option value="مسلط (حرفه‌ای)">مسلط (حرفه‌ای)</option>
                  </select>
                  {/* آیکون فلش */}
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* توضیحات */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">توضیحات (اختیاری)</label>
                <textarea
                  rows={2}
                  placeholder="افزونه‌های خاصی که مسلط هستید یا کاربرد این نرم‌افزار در کار شما..."
                  value={skill.description}
                  onChange={(e) => handleChange(skill.id, "description", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-y"
                ></textarea>
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
        افزودن مهارت نرم‌افزاری جدید
      </button>
    </div>
  );
}