import { Calendar, CheckCircle2, PackagePlus } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

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
  examAt: DateObject | null;
  setExamAt: (val: DateObject | null) => void;
  selectedProductsCount: number;
  openModal: () => void;
  isMainSlider: boolean;
  setIsMainSlider: (val: boolean) => void;
}

export default function ScheduleSettingsSection({
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  examAt,
  setExamAt,
  selectedProductsCount,
  openModal,
  isMainSlider,
  setIsMainSlider,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* زمان‌بندی */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-orange-50 text-orange-600 rounded">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">زمان‌بندی و محصولات مرتبط</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ شروع ثبت نام</label>
            <DatePicker
              value={startAt}
              onChange={(val) => setStartAt(val as DateObject | null)}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ پایان ثبت نام</label>
            <DatePicker
              value={endAt}
              onChange={(val) => setEndAt(val as DateObject | null)}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-700">تاریخ برگزاری آزمون</label>
            <DatePicker
              value={examAt}
              onChange={(val) => setExamAt(val as DateObject | null)}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="bottom" key="time_picker" />]}
              inputClass="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600"
              containerClassName="w-full"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-400">
            <label className="text-slate-700 block mb-2">محصولات مرتبط با این آزمون</label>
            <button
              type="button"
              onClick={openModal}
              className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2.5 rounded w-full sm:w-auto"
            >
              <PackagePlus size={18} />
              انتخاب محصولات ({selectedProductsCount} مورد انتخاب شده)
            </button>
          </div>
        </div>
      </div>

      {/* تنظیمات */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">شرایط و تنظیمات</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-slate-700">وضعیت آگهی</label>
            <select
              name="status"
              defaultValue="NEWS"
              className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
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
                name="price"
                type="number"
                placeholder="مثال: 350000"
                className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700">حداکثر سن</label>
              <input
                name="maxAge"
                type="number"
                placeholder="مثال: 40"
                className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* سویچ تاگلی نمایش اسلایدر */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-400">
            <label
              onClick={() => setIsMainSlider(!isMainSlider)}
              className="text-slate-700 font-medium cursor-pointer select-none"
            >
              نمایش به عنوان اسلایدر اصلی سایت
            </label>

            <button
              type="button"
              onClick={() => setIsMainSlider(!isMainSlider)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isMainSlider ? "bg-emerald-500" : "bg-slate-200"
              }`}
              dir="ltr"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isMainSlider ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}