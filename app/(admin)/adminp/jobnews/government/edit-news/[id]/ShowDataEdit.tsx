"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight, CheckCircle2, MapPin, Plus, Save, Briefcase,
  Calendar, Info, Image as ImageIcon, ArrowLeft, UploadCloud, X, Box, LinkIcon
} from "lucide-react";
import { updateDataEditGov } from "@/actions/admin/jobnews/government/editnews/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import RichTextEditor from "@/components/editor/RichTextEditor";

const DatePicker = dynamic(() => import("react-multi-date-picker"), {
  ssr: false,
});

const STATUS_OPTIONS = [
  { key: "OPEN", label: "ثبت نام" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعیه و خبر" },
];

const toISO = (d?: DateObject | null) => {
  if (!d) return "";
  try {
    return d.toDate().toISOString();
  } catch {
    return "";
  }
};

export default function EditShowJobNewsGov({ getDataGov, getDataProduct }: { getDataGov: any, getDataProduct?: any[] }) {
  const product = getDataGov?.product || {};
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(updateDataEditGov, null);

  const [jobs, setJobs] = useState<string[]>(product.jobs || []);
  const [jobInput, setJobInput] = useState("");

  const [cities, setCities] = useState<string[]>(product.cities || []);
  const [cityInput, setCityInput] = useState("");

  const [description, setDescription] = useState(product.description || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(product.productIds || []);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.back();
    } else {
      toast.error(state.message || state.error);
    }
  }, [state, router]);

  const addJob = () => {
    const value = jobInput.trim();
    if (!value || jobs.includes(value)) return;
    setJobs([...jobs, value]);
    setJobInput("");
  };

  const addCity = () => {
    const value = cityInput.trim();
    if (!value || cities.includes(value)) return;
    setCities([...cities, value]);
    setCityInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // State های مربوط به تصویر
  const [previewImage, setPreviewImage] = useState<string | null>(product.imageUrl || null);
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [hiddenImageUrl, setHiddenImageUrl] = useState(product.imageUrl || ""); // حفظ تصویر قبلی در صورت عدم تغییر

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setExternalImageUrl(url);
    setPreviewImage(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setExternalImageUrl("");
    } else {
      setPreviewImage(hiddenImageUrl || null);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewImage(null);
    setExternalImageUrl("");
    setHiddenImageUrl(""); // پاک کردن تصویر دیتابیس
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [title, setTitle] = useState(product.title || "");
  const [slugNews, setSlugNews] = useState(product.slugNews || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlugNews(generatePersianSlug(val));
  };

  const [startAt, setStartAt] = useState<DateObject | null>(() => {
    if (!product.startAt) return null;
    return new DateObject({ date: new Date(product.startAt), calendar: persian, locale: persian_fa });
  });

  const [endAt, setEndAt] = useState<DateObject | null>(() => {
    if (!product.endAt) return null;
    return new DateObject({ date: new Date(product.endAt), calendar: persian, locale: persian_fa });
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl text-slate-800">ویرایش آگهی استخدام</h1>
          <p className="text-slate-500 mt-1">فرم زیر را برای ویرایش اطلاعات آگهی تکمیل کنید.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
        >
          <span>بازگشت</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={product.id || ""} />
        <input type="hidden" name="jobs" value={JSON.stringify(jobs)} />
        <input type="hidden" name="cities" value={JSON.stringify(cities)} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="productIds" value={JSON.stringify(selectedProductIds)} />
        <input type="hidden" name="startAt" value={toISO(startAt)} />
        <input type="hidden" name="endAt" value={toISO(endAt)} />
        <input type="hidden" name="imageUrl" value={hiddenImageUrl} />

        {state?.success === false && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <Info className="w-5 h-5 shrink-0" />
            {state.message || state.error}
          </div>
        )}

        {/* 1. اطلاعات اصلی */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-slate-800">اطلاعات اصلی</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-700">عنوان آزمون <span className="text-red-500">*</span></label>
              <input name="title" value={title} onChange={handleTitleChange} required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700">شناسه (Slug) <span className="text-red-500">*</span></label>
              <input name="slugNews" value={slugNews} onChange={(e) => setSlugNews(e.target.value)} required dir="ltr" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left font-mono bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700">لینک ثبت نام <span className="text-red-500">*</span></label>
              <input name="registerUrl" required defaultValue={product.registerUrl} dir="ltr" type="url" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left font-mono" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700">مجری آزمون</label>
              <input name="organization" defaultValue={product.organization} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>
        </div>

        {/* 2. تصویر کاور */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-slate-800">تصویر کاور آگهی <span className="text-red-500">*</span></h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full space-y-6 flex-1">
              <div className="space-y-3">
                <label className="text-slate-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  لینک مستقیم تصویر (اولویت اول)
                </label>
                <input
                  type="url"
                  name="externalImageUrl"
                  value={externalImageUrl}
                  onChange={handleExternalUrlChange}
                  disabled={!!(fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-slate-100 disabled:opacity-50 text-left dir-ltr"
                />
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-xs">یا</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="space-y-3">
                <label className="text-slate-700 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-slate-500" />
                  آپلود فایل تصویر
                </label>
                <input
                  type="file"
                  name="imageFile"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={!!externalImageUrl}
                  accept="image/*"
                  className="w-full border border-slate-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
              <span className="text-slate-700 w-full text-right">پیش‌نمایش:</span>
              {previewImage ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm">عکسی انتخاب نشده</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. زمانبندی و شرایط */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-slate-800">زمان‌بندی ثبت‌نام</h2>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-slate-700">تاریخ شروع</label>
                <DatePicker value={startAt} onChange={setStartAt} calendar={persian} locale={persian_fa} format="YYYY/MM/DD HH:mm" plugins={[<TimePicker position="bottom" />]} inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600" containerClassName="w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700">تاریخ پایان</label>
                <DatePicker value={endAt} onChange={setEndAt} calendar={persian} locale={persian_fa} format="YYYY/MM/DD HH:mm" plugins={[<TimePicker position="bottom" />]} inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600" containerClassName="w-full" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-slate-800">شرایط و تنظیمات</h2>
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

              <div className="space-y-2 pt-2">
                <label className="text-slate-700">نمایش در اسلایدر اصلی سایت</label>
                <select name="isMainSlider" defaultValue={product.isMainSlider !== undefined ? String(product.isMainSlider) : "false"} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50">
                  <option value="false">خیر، نمایش داده نشود</option>
                  <option value="true">بله، نمایش داده شود</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 4. تگ‌ها (شغل‌ها و شهرها) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-slate-800">شغل‌های مورد نیاز</h2>
            </div>
            <div className="flex gap-2">
              <input value={jobInput} onChange={(e) => setJobInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, addJob)} placeholder="مثلا: آموزگار ابتدایی (Enter)" className="flex-1 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none" />
              <button type="button" onClick={addJob} className="bg-purple-100 text-purple-700 p-3 rounded-xl hover:bg-purple-200 shrink-0"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] items-start">
              {jobs.length === 0 && <span className="text-slate-400 py-1">موردی اضافه نشده است</span>}
              {jobs.map((job, i) => (
                <span key={i} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                  {job} <button type="button" onClick={() => setJobs(jobs.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-0.5"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-slate-800">شهرهای محل خدمت</h2>
            </div>
            <div className="flex gap-2">
              <input value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, addCity)} placeholder="مثلا: تهران (Enter)" className="flex-1 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none" />
              <button type="button" onClick={addCity} className="bg-rose-100 text-rose-700 p-3 rounded-xl hover:bg-rose-200 shrink-0"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] items-start">
              {cities.length === 0 && <span className="text-slate-400 py-1">موردی اضافه نشده است</span>}
              {cities.map((city, i) => (
                <span key={i} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                  {city} <button type="button" onClick={() => setCities(cities.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-0.5"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. بخش محصولات مرتبط */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-slate-800">محصولات مرتبط</h2>
            </div>
            <p className="text-slate-500 mt-2">
              تعداد <span className="text-indigo-600">{selectedProductIds.length}</span> محصول برای این آگهی انتخاب شده است.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            انتخاب / ویرایش محصولات
          </button>
        </div>

        {/* دکمه ذخیره */}
        <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:p-5 flex justify-end z-40 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>در حال ثبت اطلاعات...</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-5 h-5" />ذخیره تغییرات آگهی</span>
            )}
          </button>
        </div>
      </form>

      {/* مودال انتخاب محصول */}
      <AnimatePresence>
        {isModalOpen && (
          <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <div>
                  <h3 className="text-gray-800">انتخاب محصولات مرتبط</h3>
                  <p className="text-gray-500 mt-1">محصولاتی که می‌خواهید زیر این خبر نمایش داده شوند را تیک بزنید.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                {getDataProduct && getDataProduct.length > 0 ? (
                  <div className="space-y-3">
                    {getDataProduct.map((prod) => (
                      <label key={prod.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          checked={selectedProductIds.includes(prod.id)}
                          onChange={() => toggleProductSelection(prod.id)}
                        />
                        <span className="text-gray-700">{prod.name || prod.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">هیچ محصولی در سیستم یافت نشد.</div>
                )}
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-xl transition-colors"
                >
                  تایید انتخاب‌ها ({selectedProductIds.length} محصول)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
