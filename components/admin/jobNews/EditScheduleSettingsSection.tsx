import { useState } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const DatePicker = dynamic(() => import("react-multi-date-picker"), { ssr: false });

const STATUS_OPTIONS = [
  { key: "OPEN", label: "ثبت نام" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعیه و خبر" },
];

interface Props {
  startAt: DateObject | null;
  setStartAt: (val: DateObject | null) => void;
  endAt: DateObject | null;
  setEndAt: (val: DateObject | null) => void;
  product: any;
}

export default function EditScheduleSettingsSection({ startAt, setStartAt, endAt, setEndAt, product }: Props) {
  // مدیریت وضعیت سویچ اسلایدر بر اساس مقدار اولیه پروداکت
  const [isMainSlider, setIsMainSlider] = useState<boolean>(
    product.isMainSlider === true || product.isMainSlider === "true"
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* بخش زمان‌بندی */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">زمان‌بندی ثبت‌نام</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ شروع</label>
            <DatePicker value={startAt} onChange={setStartAt} calendar={persian} locale={persian_fa} format="YYYY/MM/DD HH:mm" plugins={[<TimePicker position="bottom" />]} inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-600" containerClassName="w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ پایان</label>
            <DatePicker value={endAt} onChange={setEndAt} calendar={persian} locale={persian_fa} format="YYYY/MM/DD HH:mm" plugins={[<TimePicker position="bottom" />]} inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-600" containerClassName="w-full" />
          </div>
        </div>
      </div>

      {/* بخش شرایط و تنظیمات */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">شرایط و تنظیمات</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700 flex items-center gap-2">وضعیت آگهی</label>
            <select name="status" defaultValue={product.status || "NEWS"} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white">
              {STATUS_OPTIONS.map((opt) => (<option key={opt.key} value={opt.key}>{opt.label}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-700">هزینه (تومان)</label>
              <input name="price" defaultValue={product.price} type="number" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700">حداکثر سن</label>
              <input name="maxAge" defaultValue={product.maxAge} type="number" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>

          {/* تغییر یافته به دکمه سویچ با استایل shadcn/ui */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <label 
              onClick={() => setIsMainSlider(!isMainSlider)} 
              className="text-slate-700 font-medium cursor-pointer select-none"
            >
              نمایش در اسلایدر اصلی سایت
            </label>
            
            <button
              type="button"
              onClick={() => setIsMainSlider(!isMainSlider)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isMainSlider ? "bg-emerald-500" : "bg-slate-200"
              }`}
              dir="ltr" // جهت چپ به راست برای انیمیشنِ درستِ سویچ در محیط RTL
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isMainSlider ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            {/* مقدار نهایی فرم از این طریق ارسال می‌شود */}
            <input type="hidden" name="isMainSlider" value={String(isMainSlider)} />
          </div>
        </div>
      </div>
    </div>
  );
}