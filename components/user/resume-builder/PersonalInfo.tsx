"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: string;
  link: string;
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  gender: string;
  marital: string;
  birthDate: string;
  military: string;
  city: string;
  address: string;
  avatar: string;
  about: string;
  socials: SocialLink[];
}

// ─── Default Data ─────────────────────────────────────────────────────────────

export const defaultData: ResumeData = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  phone: "",
  gender: "",
  marital: "",
  birthDate: "",
  military: "",
  city: "",
  address: "",
  avatar: "",
  about: "",
  socials: [],
};

// ─── UI Components ────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={type === "url" || type === "email" ? "ltr" : "rtl"}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>انتخاب کنید...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        className={`${inputCls} resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PersonalInfoProps {
  data: ResumeData;
  update: (field: keyof ResumeData, value: any) => void;
}

export default function PersonalInfo({ data, update }: PersonalInfoProps) {
  // توابع مدیریت شبکه‌های اجتماعی
  const addSocial = () => {
    const currentSocials = data.socials || [];
    update("socials", [...currentSocials, { platform: "", link: "" }]);
  };

  const updateSocial = (index: number, key: keyof SocialLink, val: string) => {
    const newSocials = [...(data.socials || [])];
    newSocials[index][key] = val;
    update("socials", newSocials);
  };

  const removeSocial = (index: number) => {
    const newSocials = (data.socials || []).filter((_, i) => i !== index);
    update("socials", newSocials);
  };

  return (
    <div className="space-y-8">
      {/* ── بخش اطلاعات اصلی ── */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="نام" value={data.firstName} onChange={(v) => update("firstName", v)} placeholder="نام خود را وارد کنید" />
          <Field label="نام خانوادگی" value={data.lastName} onChange={(v) => update("lastName", v)} placeholder="نام خانوادگی" />
        </div>

        <Field label="عنوان شغلی" value={data.jobTitle} onChange={(v) => update("jobTitle", v)} placeholder="مثلاً: توسعه‌دهنده وب" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="ایمیل" value={data.email} onChange={(v) => update("email", v)} placeholder="example@email.com" type="email" />
          <Field label="تلفن" value={data.phone} onChange={(v) => update("phone", v)} placeholder="09xxxxxxxxx" type="tel" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="جنسیت" value={data.gender} onChange={(v) => update("gender", v)} options={["مرد", "زن", "سایر"]} />
          <SelectField label="وضعیت تأهل" value={data.marital} onChange={(v) => update("marital", v)} options={["مجرد", "متأهل"]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="تاریخ تولد" value={data.birthDate} onChange={(v) => update("birthDate", v)} placeholder="مثلاً: بهمن ۱۳۷۳" />
          <SelectField
            label="وضعیت نظام وظیفه"
            value={data.military}
            onChange={(v) => update("military", v)}
            options={["پایان خدمت", "معافیت", "در حال خدمت", "مشمول"]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="شهر" value={data.city} onChange={(v) => update("city", v)} placeholder="شهر محل سکونت" />
          <Field label="آدرس" value={data.address} onChange={(v) => update("address", v)} placeholder="آدرس دقیق" />
        </div>

        <Field label="لینک عکس پروفایل" value={data.avatar} onChange={(v) => update("avatar", v)} placeholder="https://..." type="url" />
      </div>

      <hr className="border-gray-100" />

      {/* ── بخش درباره من ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> درباره من
        </h3>
        <TextAreaField
          label="خلاصه‌ای از خودتان، اهداف و مسیر شغلی‌تان بنویسید"
          value={data.about || ""}
          onChange={(v) => update("about", v)}
          placeholder="من یک توسعه‌دهنده وب با اشتیاق به یادگیری تکنولوژی‌های جدید هستم..."
          rows={5}
        />
      </div>

      <hr className="border-gray-100" />

      {/* ── بخش شبکه‌های اجتماعی ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🌐</span> شبکه‌های اجتماعی و لینک‌ها
          </h3>
          <button
            onClick={addSocial}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            افزودن لینک
          </button>
        </div>

        <div className="space-y-4">
          {(!data.socials || data.socials.length === 0) && (
            <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              هنوز لینکی اضافه نکرده‌اید.
            </div>
          )}
          
          {data.socials?.map((social, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl relative group">
              <div className="w-full md:w-1/3">
                <SelectField
                  label="پلتفرم"
                  value={social.platform}
                  onChange={(v) => updateSocial(index, "platform", v)}
                  options={["لینکدین", "گیت‌هاب", "توییتر (X)", "اینستاگرام", "تلگرام", "وب‌سایت شخصی", "سایر"]}
                />
              </div>
              <div className="w-full md:w-2/3">
                <Field
                  label="لینک (URL)"
                  value={social.link}
                  onChange={(v) => updateSocial(index, "link", v)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              
              {/* دکمه حذف */}
              <button
                onClick={() => removeSocial(index)}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white text-red-500 hover:text-white hover:bg-red-500 border border-red-100 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                title="حذف این لینک"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}