"use client";
import React from "react";

// ─── تایپ‌های مربوط به هر بخش ────────────────────────────────────────────────
export interface VolunteerRecord {
  id: string;
  title: string;
  organization: string; // محل
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

export interface ReferenceRecord {
  id: string;
  name: string;
  organization: string; // نام مرکز
  phone: string;
  email: string;
}

export interface HobbyRecord {
  id: string;
  title: string; // به چه تفریحاتی علاقه‌مند هستید
}

interface OtherStepProps {
  volunteering: VolunteerRecord[];
  onChangeVolunteering: (data: VolunteerRecord[]) => void;
  
  references: ReferenceRecord[];
  onChangeReferences: (data: ReferenceRecord[]) => void;
  
  hobbies: HobbyRecord[];
  onChangeHobbies: (data: HobbyRecord[]) => void;
}

export default function OtherStep({
  volunteering = [],
  onChangeVolunteering,
  references = [],
  onChangeReferences,
  hobbies = [],
  onChangeHobbies,
}: OtherStepProps) {

  // ─── توابع هندلر فعالیت‌های داوطلبانه ───
  const handleAddVolunteer = () => {
    onChangeVolunteering([
      ...volunteering,
      { id: Date.now().toString(), title: "", organization: "", startDate: "", endDate: "", city: "", description: "" },
    ]);
  };
  const handleRemoveVolunteer = (id: string) => {
    onChangeVolunteering(volunteering.filter((v) => v.id !== id));
  };
  const handleChangeVolunteer = (id: string, field: keyof VolunteerRecord, value: string) => {
    onChangeVolunteering(volunteering.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  // ─── توابع هندلر معرف‌ها ───
  const handleAddReference = () => {
    onChangeReferences([
      ...references,
      { id: Date.now().toString(), name: "", organization: "", phone: "", email: "" },
    ]);
  };
  const handleRemoveReference = (id: string) => {
    onChangeReferences(references.filter((r) => r.id !== id));
  };
  const handleChangeReference = (id: string, field: keyof ReferenceRecord, value: string) => {
    onChangeReferences(references.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // ─── توابع هندلر تفریحات ───
  const handleAddHobby = () => {
    onChangeHobbies([...hobbies, { id: Date.now().toString(), title: "" }]);
  };
  const handleRemoveHobby = (id: string) => {
    onChangeHobbies(hobbies.filter((h) => h.id !== id));
  };
  const handleChangeHobby = (id: string, value: string) => {
    onChangeHobbies(hobbies.map((h) => (h.id === id ? { ...h, title: value } : h)));
  };

  return (
    <div className="space-y-12">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* بخش اول: فعالیت‌های داوطلبانه */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">فعالیت‌های داوطلبانه</h2>
          <p className="text-sm text-slate-500 mt-1">تجربیات کارهای داوطلبانه و عام‌المنفعه خود را وارد کنید.</p>
        </div>

        <div className="space-y-6">
          {volunteering.map((item, index) => (
            <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm transition-all hover:shadow-md">
              <button
                onClick={() => handleRemoveVolunteer(item.id)}
                className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors z-10"
                title="حذف"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">فعالیت {index + 1}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">عنوان</label>
                  <input type="text" placeholder="مثال: مدرس داوطلب" value={item.title} onChange={(e) => handleChangeVolunteer(item.id, "title", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">محل / سازمان</label>
                  <input type="text" placeholder="مثال: جمعیت هلال احمر" value={item.organization} onChange={(e) => handleChangeVolunteer(item.id, "organization", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">تاریخ شروع</label>
                  <input type="text" placeholder="مثال: فروردین ۱۴۰۱" value={item.startDate} onChange={(e) => handleChangeVolunteer(item.id, "startDate", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm text-right" dir="rtl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">تاریخ پایان</label>
                  <input type="text" placeholder="مثال: اسفند ۱۴۰۱" value={item.endDate} onChange={(e) => handleChangeVolunteer(item.id, "endDate", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm text-right" dir="rtl" />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">شهر</label>
                  <input type="text" placeholder="مثال: تهران" value={item.city} onChange={(e) => handleChangeVolunteer(item.id, "city", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm" />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">توضیحات</label>
                  <textarea rows={2} placeholder="شرح وظایف و فعالیت‌ها..." value={item.description} onChange={(e) => handleChangeVolunteer(item.id, "description", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm resize-y"></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleAddVolunteer} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          افزودن فعالیت داوطلبانه
        </button>
      </div>

      <hr className="border-slate-200" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* بخش دوم: معرف‌ها */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">معرف‌ها (References)</h2>
          <p className="text-sm text-slate-500 mt-1">افرادی که می‌توانند تخصص و مهارت شما را تایید کنند وارد کنید.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {references.map((item) => (
            <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:shadow-md flex flex-col gap-4">
              <button
                onClick={() => handleRemoveReference(item.id)}
                className="absolute top-3 left-3 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg z-10"
                title="حذف معرف"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col gap-1.5 pl-8">
                <label className="text-sm font-medium text-slate-700">نام معرف</label>
                <input type="text" placeholder="مثال: دکتر احمدی" value={item.name} onChange={(e) => handleChangeReference(item.id, "name", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">نام مرکز / سازمان</label>
                <input type="text" placeholder="مثال: دانشگاه تهران" value={item.organization} onChange={(e) => handleChangeReference(item.id, "organization", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">تلفن تماس</label>
                <input type="text" placeholder="مثال: 09120000000" value={item.phone} onChange={(e) => handleChangeReference(item.id, "phone", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm text-left" dir="ltr" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">پست الکترونیک</label>
                <input type="text" placeholder="مثال: email@example.com" value={item.email} onChange={(e) => handleChangeReference(item.id, "email", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 outline-none text-sm text-left" dir="ltr" />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleAddReference} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          افزودن معرف جدید
        </button>
      </div>

      <hr className="border-slate-200" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* بخش سوم: تفریحات */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">تفریحات و علایق</h2>
          <p className="text-sm text-slate-500 mt-1">به چه تفریحاتی علاقه‌مند هستید؟</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {hobbies.map((item) => (
            <div key={item.id} className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 transition-all">
              <input
                type="text"
                placeholder="مثال: مطالعه، ورزش..."
                value={item.title}
                onChange={(e) => handleChangeHobby(item.id, e.target.value)}
                className="px-3 py-2 bg-transparent outline-none text-sm w-40"
              />
              <button
                onClick={() => handleRemoveHobby(item.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="حذف"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          
          <button onClick={handleAddHobby} className="px-4 py-2 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            افزودن تفریح
          </button>
        </div>
      </div>

    </div>
  );
}