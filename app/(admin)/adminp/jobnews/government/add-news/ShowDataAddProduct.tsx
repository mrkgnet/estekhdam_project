"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    ArrowRight, CheckCircle2, MapPin, Plus, Save, Briefcase,
    Calendar, Info, Image as ImageIcon, ArrowLeft, UploadCloud, X,
    PackagePlus
} from "lucide-react";
import { createNewsGovermentAction } from "@/actions/admin/jobnews/government/addnews/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Persian Date Picker
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import RichTextEditor from "@/components/editor/RichTextEditor";

// وضعیت‌های قابل انتخاب
const STATUS_OPTIONS = [
    { key: "OPEN", label: "ثبت نام" },
    { key: "CARD_RECEIVED", label: "دریافت کارت" },
    { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
    { key: "NEWS", label: "اطلاعیه و خبر" },
];

// تعریف تایپ برای محصولات دریافتی (اگر تایپ دقیق‌تری دارید جایگزین کنید)
interface ProductType {
    id: string;
    name: string;
}

interface Props {
    getDataProduct: ProductType[];
}

export default function CreateNews({ getDataProduct = [] }: Props) {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, formAction, isPending] = useActionState(createNewsGovermentAction, null);

    const [jobs, setJobs] = useState<string[]>([]);
    const [jobInput, setJobInput] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [cityInput, setCityInput] = useState("");
    
    // استیت توضیحات برای RichTextEditor
    const [description, setDescription] = useState("");

    // --- استیت‌های جدید برای محصولات ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    // ------------------------------------

    // ✅ تاریخ‌های فارسی
    const [startAt, setStartAt] = useState<DateObject | null>(null);
    const [endAt, setEndAt] = useState<DateObject | null>(null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message);
            setJobInput("");
            setJobs([]);
            setCities([]);
            setCityInput("");
            setTitle("");
            setSlugNews("");
            setDescription(""); // خالی کردن ادیتور
            setPreviewImage(null);
            setSelectedProductIds([]);
            setStartAt(null);
            setEndAt(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            // router.push("/adminp/jobnews/government");
        } else {
            toast.error(state.message || "خطایی رخ داده است");
        }
    }, [state, router]);

    // توابع مدیریت آرایه‌ها
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

    // --- تابع انتخاب/حذف محصول از لیست ---
    const toggleProductSelection = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // slug generator 
    const [title, setTitle] = useState("");
    const [slugNews, setSlugNews] = useState("");
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setSlugNews(generatePersianSlug(val));
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative text-xs md:text-sm">
            {/* هدر صفحه */}
            <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-4">
                <div>
                    <h1 className="text-2xl text-slate-800">ثبت آگهی استخدام جدید</h1>
                    <p className="text-slate-500 mt-1">فرم زیر را با دقت برای ایجاد آگهی جدید تکمیل کنید.</p>
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
                <input type="hidden" name="jobs" value={JSON.stringify(jobs)} />
                <input type="hidden" name="cities" value={JSON.stringify(cities)} />

                {/* --- اینپوت مخفی برای ارسال محصولات به اکشن سرور --- */}
                <input type="hidden" name="productIds" value={JSON.stringify(selectedProductIds)} />

                {/* ارسال محتوای RichTextEditor به سرور */}
                <input type="hidden" name="description" value={description} />

                {/* ✅ تاریخ‌ها به صورت ISO ارسال می‌شوند */}
                <input
                    type="hidden"
                    name="startAt"
                    value={startAt ? startAt.toDate().toISOString() : ""}
                />
                <input
                    type="hidden"
                    name="endAt"
                    value={endAt ? endAt.toDate().toISOString() : ""}
                />

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
                        <div className="space-y-3">
                            <label className="text-slate-700">عنوان آزمون <span className="text-red-500">*</span></label>
                            <input name="title" value={title} onChange={handleTitleChange} required placeholder="مثال: آزمون استخدامی آموزش و پرورش" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-slate-700">شناسه (Slug) <span className="text-red-500">*</span></label>
                            <input name="slugNews" value={slugNews} onChange={(e) => setSlugNews(e.target.value)} required dir="ltr" placeholder="اسلاگ خودکار تولید می شود" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left font-mono placeholder:text-slate-400 bg-slate-50" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-slate-700">لینک ثبت نام <span className="text-red-500">*</span></label>
                            <input name="registerUrl" dir="ltr" type="url" required placeholder="https://..." className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left font-mono placeholder:text-slate-400" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-slate-700">مجری آزمون</label>
                            <input name="organization" placeholder="مثال: جهاد دانشگاهی" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>
                    </div>

                    {/* بخش ادیتور متن */}
                    <div className="space-y-3">
                        <label className="text-slate-700">توضیحات تکمیلی</label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <label className="text-slate-700 flex items-center gap-2">تصویر کاور آگهی <span className="text-red-500">*</span></label>
                        <div className="relative group w-full sm:w-96">
                            <input type="file" required={!previewImage} name="imageFile" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className={`w-full border-2 border-dashed rounded-2xl overflow-hidden transition-all flex flex-col items-center justify-center gap-2 ${previewImage ? 'border-blue-500 bg-blue-50 h-48' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 h-32'}`}>
                                {previewImage ? (
                                    <div className="relative w-full h-full group-hover:opacity-90 transition-opacity">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md" title="حذف تصویر"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors"><UploadCloud className="w-6 h-6" /></div>
                                        <span className="text-slate-500">برای انتخاب عکس کلیک کنید یا فایل را بکشید</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. زمانبندی و شرایط */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
                            <h2 className="text-slate-800">زمان‌بندی و محصولات مرتبط</h2>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-slate-700">تاریخ شروع</label>
                                <DatePicker
                                    value={startAt}
                                    onChange={(val) => setStartAt(val as DateObject | null)}
                                    calendar={persian}
                                    locale={persian_fa}
                                    format="YYYY/MM/DD HH:mm"
                                    plugins={[<TimePicker position="bottom" />]}
                                    inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600"
                                    containerClassName="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-700">تاریخ پایان</label>
                                <DatePicker
                                    value={endAt}
                                    onChange={(val) => setEndAt(val as DateObject | null)}
                                    calendar={persian}
                                    locale={persian_fa}
                                    format="YYYY/MM/DD HH:mm"
                                    plugins={[<TimePicker position="bottom" />]}
                                    inputClass="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-600"
                                    containerClassName="w-full"
                                />
                            </div>

                            {/* --- دکمه باز کردن مودال انتخاب محصول --- */}
                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                <label className="text-slate-700 block mb-2">محصولات مرتبط با این آزمون</label>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2.5 rounded-xl w-full sm:w-auto"
                                >
                                    <PackagePlus size={18} />
                                    انتخاب محصولات ({selectedProductIds.length} مورد انتخاب شده)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                            <h2 className="text-slate-800">شرایط و تنظیمات</h2>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-slate-700">وضعیت آگهی</label>
                                <select name="status" defaultValue="NEWS" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                                    {STATUS_OPTIONS.map((opt) => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-slate-700">هزینه (تومان)</label>
                                    <input name="price" type="number" placeholder="مثال: 350000" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-700">حداکثر سن</label>
                                    <input name="maxAge" type="number" placeholder="مثال: 40" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

            {/* ============== مودال انتخاب محصول ============== */}
            <AnimatePresence>
                {isModalOpen && (
                    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                        <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
                            <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                <div>
                                    <h3 className="text-gray-800 font-bold">انتخاب محصولات مرتبط</h3>
                                    <p className="text-gray-500 mt-1">محصولاتی که می‌خواهید زیر این خبر نمایش داده شوند را تیک بزنید.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                            </div>

                            <div className="p-5 overflow-y-auto flex-1">
                                {getDataProduct && getDataProduct.length > 0 ? (
                                    <div className="space-y-3">
                                        {getDataProduct.map((product) => (
                                            <label key={product.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                    checked={selectedProductIds.includes(product.id)}
                                                    onChange={() => toggleProductSelection(product.id)}
                                                />
                                                <span className="text-gray-700 font-medium">{product.name}</span>
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
                                    className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
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
