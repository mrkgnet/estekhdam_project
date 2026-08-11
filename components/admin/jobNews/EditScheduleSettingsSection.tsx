import { useState, useEffect } from "react";
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

// توابع کمکی فرمت‌دهی ۳ رقم ۳ رقم اعداد
const formatNumberWithCommas = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === "") return "";
  const rawValue = String(value).replace(/,/g, "");
  if (isNaN(Number(rawValue))) return "";
  return new Intl.NumberFormat("en-US").format(Number(rawValue));
};

interface Props {
  startAt: DateObject | null;
  setStartAt: (val: DateObject | null) => void;
  endAt: DateObject | null;
  setEndAt: (val: DateObject | null) => void;
  examAt: DateObject | null;
  setExamAt: (val: DateObject | null) => void;
  product: any;
}

// ✅ کامپوننت اسکلتون لودر موجی
function SkeletonLoader() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-wave {
          background: linear-gradient(
            90deg,
            #e2e8f0 0%,
            #f1f5f9 40%,
            #f8fafc 50%,
            #f1f5f9 60%,
            #e2e8f0 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite linear;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* اسکلتون کارت زمان‌بندی */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-orange-50 rounded">
            <div className="w-5 h-5 skeleton-wave rounded"></div>
          </div>
          <div className="h-5 w-40 skeleton-wave rounded"></div>
        </div>
        <div className="space-y-5">
          {/* فیلد ۱: تاریخ شروع */}
          <div className="space-y-2">
            <div className="h-4 w-40 skeleton-wave rounded"></div>
            <div className="h-12 w-full skeleton-wave rounded"></div>
          </div>
          {/* فیلد ۲: تاریخ پایان */}
          <div className="space-y-2">
            <div className="h-4 w-40 skeleton-wave rounded"></div>
            <div className="h-12 w-full skeleton-wave rounded"></div>
          </div>
          {/* فیلد ۳: تاریخ آزمون */}
          <div className="space-y-2">
            <div className="h-4 w-36 skeleton-wave rounded"></div>
            <div className="h-12 w-full skeleton-wave rounded"></div>
          </div>
        </div>
      </div>

      {/* اسکلتون کارت شرایط */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-emerald-50 rounded">
            <div className="w-5 h-5 skeleton-wave rounded"></div>
          </div>
          <div className="h-5 w-32 skeleton-wave rounded"></div>
        </div>
        <div className="space-y-5">
          {/* select وضعیت */}
          <div className="space-y-2">
            <div className="h-4 w-24 skeleton-wave rounded"></div>
            <div className="h-12 w-full skeleton-wave rounded"></div>
          </div>

          {/* input قیمت و سن */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 skeleton-wave rounded"></div>
              <div className="h-12 w-full skeleton-wave rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 skeleton-wave rounded"></div>
              <div className="h-12 w-full skeleton-wave rounded"></div>
            </div>
          </div>

          {/* سویچ ۱ */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-400">
            <div className="h-4 w-40 skeleton-wave rounded"></div>
            <div className="h-6 w-11 skeleton-wave rounded-full"></div>
          </div>

          {/* سویچ ۲ */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="h-4 w-48 skeleton-wave rounded"></div>
            <div className="h-6 w-11 skeleton-wave rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditScheduleSettingsSection({
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  examAt,
  setExamAt,
  product,
}: Props) {
  // ✅ استیت mount شدن برای جلوگیری از هیدراتیشن و نمایش لودر
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // وضعیت سویچ اسلایدر اصلی
  const [isMainSlider, setIsMainSlider] = useState<boolean>(
    product.isMainSlider === true || product.isMainSlider === "true"
  );

  // وضعیت سویچ فعال/غیرفعال بودن (isActive)
  const [isActive, setIsActive] = useState<boolean>(
    product.isActive !== undefined ? Boolean(product.isActive) : true
  );

  // استیت فرمت‌یافته قیمت برای نمایش ۳ رقم ۳ رقم
  const [formattedPrice, setFormattedPrice] = useState<string>(
    formatNumberWithCommas(product.price)
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawVal)) {
      setFormattedPrice(formatNumberWithCommas(rawVal));
    }
  };

  // ✅ نمایش لودر موجی تا زمانی که کامپوننت کامل مانت نشده
  if (!isMounted) {
    return <SkeletonLoader />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* بخش زمان‌بندی */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-orange-50 text-orange-600 rounded">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">زمان‌بندی ثبت‌نام و آزمون</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ شروع ثبت نام در آزمون</label>
            <DatePicker
              value={startAt}
              onChange={setStartAt}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-700">تاریخ پایان ثبت نام در آزمون</label>
            <DatePicker
              value={endAt}
              onChange={setEndAt}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-700">تاریخ برگزاری آزمون</label>
            <DatePicker
              value={examAt}
              onChange={setExamAt}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>
        </div>
      </div>

      {/* بخش شرایط و تنظیمات */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">شرایط و تنظیمات</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700 flex items-center gap-2">وضعیت آگهی</label>
            <select
              name="status"
              defaultValue={product.status || "NEWS"}
              className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-700">هزینه (تومان)</label>
              <input
                type="text"
                value={formattedPrice}
                onChange={handlePriceChange}
                placeholder="مثال: ۳۵۰,۰۰۰"
                className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              {/* ارسال مقدار عددی بدون کاما به بک‌اند */}
              <input
                type="hidden"
                name="price"
                value={formattedPrice.replace(/,/g, "")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700">حداکثر سن</label>
              <input
                name="maxAge"
                defaultValue={product.maxAge}
                type="number"
                className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* سویچ تاگلی ۱: فعال / غیرفعال بودن آگهی (isActive) */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-400">
            <label
              onClick={() => setIsActive(!isActive)}
              className="text-slate-700 font-medium cursor-pointer select-none"
            >
              وضعیت انتشار (فعال / غیرفعال)
            </label>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
              dir="ltr"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>

          {/* سویچ تاگلی ۲: نمایش در اسلایدر اصلی (isMainSlider) */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
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
                isMainSlider ? "bg-emerald-500" : "bg-slate-400"
              }`}
              dir="ltr"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isMainSlider ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <input type="hidden" name="isMainSlider" value={String(isMainSlider)} />
          </div>
        </div>
      </div>
    </div>
  );
}