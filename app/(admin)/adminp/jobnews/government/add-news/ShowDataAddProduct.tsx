"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Info } from "lucide-react";
import { createNewsGovermentAction } from "@/actions/admin/jobnews/government/addnews/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import DateObject from "react-date-object";
import BasicInfoSection from "@/components/admin/jobNews/BasicInfoSection";
import CoverImageSection from "@/components/admin/jobNews/CoverImageSection";
import ScheduleSettingsSection from "@/components/admin/jobNews/ScheduleSettingsSection";
import TagsSection from "@/components/admin/jobNews/TagsSection";
import ProductModal from "@/components/admin/jobNews/ProductModal";

// وارد کردن کامپوننت‌های ساخته شده

interface ProductType {
    id: string;
    name?: string;
    title?: string;
}

interface Props {
    getDataProduct: ProductType[];
}

export default function CreateNews({ getDataProduct = [] }: Props) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, formAction, isPending] = useActionState(createNewsGovermentAction, null);

    // State ها
    const [jobs, setJobs] = useState<string[]>([]);
    const [jobInput, setJobInput] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [cityInput, setCityInput] = useState("");
    const [title, setTitle] = useState("");
    const [slugNews, setSlugNews] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [startAt, setStartAt] = useState<DateObject | null>(null);
    const [endAt, setEndAt] = useState<DateObject | null>(null);
    const [isMainSlider, setIsMainSlider] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message);
            // Reset form
            setJobInput(""); setJobs([]); setCities([]); setCityInput("");
            setTitle(""); setSlugNews(""); setDescription("");
            setPreviewImage(null); setExternalImageUrl("");
            setSelectedProductIds([]); setStartAt(null); setEndAt(null);
            setIsMainSlider(true);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
            toast.error(state.message || "خطایی رخ داده است");
        }
    }, [state]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setSlugNews(generatePersianSlug(val));
    };

    const toggleProductSelection = (productId: string) => {
        setSelectedProductIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setExternalImageUrl(url); setPreviewImage(url);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setPreviewImage(URL.createObjectURL(file)); setExternalImageUrl(""); } 
        else { setPreviewImage(null); }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreviewImage(null); setExternalImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative text-xs md:text-sm">
            <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-4">
                <div>
                    <h1 className="text-2xl text-slate-800">ثبت آگهی استخدام جدید</h1>
                    <p className="text-slate-500 mt-1">فرم زیر را با دقت برای ایجاد آگهی جدید تکمیل کنید.</p>
                </div>
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm">
                    <span>بازگشت</span>
                    <ArrowLeft className="w-4 h-4" />
                </button>
            </div>

            <form action={formAction} className="space-y-6">
                {/* فیلدهای مخفی برای ارسال به سرور */}
                <input type="hidden" name="jobs" value={JSON.stringify(jobs)} />
                <input type="hidden" name="cities" value={JSON.stringify(cities)} />
                <input type="hidden" name="productIds" value={JSON.stringify(selectedProductIds)} />
                <input type="hidden" name="description" value={description} />
                <input type="hidden" name="startAt" value={startAt ? startAt.toDate().toISOString() : ""} />
                <input type="hidden" name="endAt" value={endAt ? endAt.toDate().toISOString() : ""} />
                <input type="hidden" name="isMainSlider" value={String(isMainSlider)} />

                {state?.success === false && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                        <Info className="w-5 h-5 shrink-0" />
                        {state.message || state.error}
                    </div>
                )}

                <BasicInfoSection title={title} handleTitleChange={handleTitleChange} slugNews={slugNews} setSlugNews={setSlugNews} description={description} setDescription={setDescription} />

                <CoverImageSection externalImageUrl={externalImageUrl} handleExternalUrlChange={handleExternalUrlChange} fileInputRef={fileInputRef} handleImageChange={handleImageChange} previewImage={previewImage} removeImage={removeImage} />

                <ScheduleSettingsSection startAt={startAt} setStartAt={setStartAt} endAt={endAt} setEndAt={setEndAt} selectedProductsCount={selectedProductIds.length} openModal={() => setIsModalOpen(true)} isMainSlider={isMainSlider} setIsMainSlider={setIsMainSlider} />

                <TagsSection jobs={jobs} setJobs={setJobs} jobInput={jobInput} setJobInput={setJobInput} cities={cities} setCities={setCities} cityInput={cityInput} setCityInput={setCityInput} />

                <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:p-5 flex justify-end z-40 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12">
                    <button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isPending ? (
                            <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> در حال ثبت اطلاعات...</span>
                        ) : (
                            <span className="flex items-center gap-2"><Save className="w-5 h-5" /> ذخیره و انتشار آگهی</span>
                        )}
                    </button>
                </div>
            </form>

            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} products={getDataProduct} selectedIds={selectedProductIds} toggleSelection={toggleProductSelection} />
        </div>
    );
}
