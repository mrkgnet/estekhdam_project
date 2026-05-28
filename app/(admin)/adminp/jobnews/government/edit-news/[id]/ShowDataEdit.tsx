"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Info } from "lucide-react";
import { updateDataEditGov } from "@/actions/admin/jobnews/government/editnews/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import EditBasicInfoSection from "@/components/admin/jobNews/EditBasicInfoSection";
import CoverImageSection from "@/components/admin/jobNews/CoverImageSection";
import EditScheduleSettingsSection from "@/components/admin/jobNews/EditScheduleSettingsSection";
import TagsSection from "@/components/admin/jobNews/TagsSection";
import EditRelatedProductsSection from "@/components/admin/jobNews/EditRelatedProductsSection";
import ProductModal from "@/components/admin/jobNews/ProductModal";

// وارد کردن کامپوننت‌های فرعی

const toISO = (d?: DateObject | null) => {
  if (!d) return "";
  try { return d.toDate().toISOString(); } catch { return ""; }
};

export default function EditShowJobNewsGov({ getDataGov, getDataProduct }: { getDataGov: any, getDataProduct?: any[] }) {
  const product = getDataGov?.product || {};
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(updateDataEditGov, null);

  // State ها
  const [jobs, setJobs] = useState<string[]>(product.jobs || []);
  const [jobInput, setJobInput] = useState("");
  const [cities, setCities] = useState<string[]>(product.cities || []);
  const [cityInput, setCityInput] = useState("");
  const [description, setDescription] = useState(product.description || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(product.productIds || []);
  const [previewImage, setPreviewImage] = useState<string | null>(product.imageUrl || null);
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [hiddenImageUrl, setHiddenImageUrl] = useState(product.imageUrl || "");
  const [title, setTitle] = useState(product.title || "");
  const [slugNews, setSlugNews] = useState(product.slugNews || "");

  const [startAt, setStartAt] = useState<DateObject | null>(() => {
    return product.startAt ? new DateObject({ date: new Date(product.startAt), calendar: persian, locale: persian_fa }) : null;
  });
  const [endAt, setEndAt] = useState<DateObject | null>(() => {
    return product.endAt ? new DateObject({ date: new Date(product.endAt), calendar: persian, locale: persian_fa }) : null;
  });

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.back();
    } else {
      toast.error(state.message || state.error);
    }
  }, [state, router]);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) => prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlugNews(generatePersianSlug(val));
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setExternalImageUrl(url); setPreviewImage(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); setExternalImageUrl("");
    } else {
      setPreviewImage(hiddenImageUrl || null);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewImage(null); setExternalImageUrl(""); setHiddenImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl text-slate-800 font-bold">ویرایش آگهی استخدام</h1>
          <p className="text-slate-500 mt-1">فرم زیر را برای ویرایش اطلاعات آگهی تکمیل کنید.</p>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm">
          <span>بازگشت</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        {/* فیلدهای مخفی */}
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

        <EditBasicInfoSection title={title} handleTitleChange={handleTitleChange} slugNews={slugNews} setSlugNews={setSlugNews} description={description} setDescription={setDescription} product={product} />

        <CoverImageSection externalImageUrl={externalImageUrl} handleExternalUrlChange={handleExternalUrlChange} fileInputRef={fileInputRef} handleImageChange={handleImageChange} previewImage={previewImage} removeImage={removeImage} />

        <EditScheduleSettingsSection startAt={startAt} setStartAt={setStartAt} endAt={endAt} setEndAt={setEndAt} product={product} />

        <TagsSection jobs={jobs} setJobs={setJobs} jobInput={jobInput} setJobInput={setJobInput} cities={cities} setCities={setCities} cityInput={cityInput} setCityInput={setCityInput} />

        <EditRelatedProductsSection selectedCount={selectedProductIds.length} openModal={() => setIsModalOpen(true)} />

        <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:p-5 flex justify-end z-40 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12">
          <button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none">
            {isPending ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>در حال ثبت اطلاعات...</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-5 h-5" />ذخیره تغییرات آگهی</span>
            )}
          </button>
        </div>
      </form>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} products={getDataProduct || []} selectedIds={selectedProductIds} toggleSelection={toggleProductSelection} />
    </div>
  );
}
