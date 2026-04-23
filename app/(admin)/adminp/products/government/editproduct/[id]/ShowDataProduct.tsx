"use client";

import { editDataProductAction } from "@/actions/admin/products/government/editproduct/Actions";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { generatePersianSlug } from "@/lib/generateSlug";
import { ArrowLeft, UploadCloud, X, LayoutList, Tag, DollarSign, ListChecks, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface Category {
    id: string;
    catName: string;
    catSlug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    newPrice: number;
    oldPrice?: number | null;
    imageUrl?: string | null;
    categoryIds?: string[]; // 🟢 این خط اضافه شد (آرایه آیدی‌ها که از دیتابیس می‌آید)
    categories?: Category[]; // این را نگه دارید مشکلی ندارد
    features?: string[]
}

interface EditProductProps {
    productData: Product;
    allCategories: Category[];
}

const initialState = { success: false, message: "" };

export default function ShowDataProduct({ productData, allCategories }: EditProductProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);


    const [state, formAction, isPending] = useActionState(editDataProductAction, initialState);

    // استیت‌ها
    // 🟢 مقداردهی اولیه اصلاح شد: پیدا کردن آبجکت دسته‌بندی‌ها از روی آیدی آن‌ها
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(() => {
        if (productData?.categoryIds && productData.categoryIds.length > 0) {
            // آیدی‌ها را با لیست کل دسته‌بندی‌ها مقایسه کرده و آبجکت‌های کامل را برمی‌گرداند
            return allCategories.filter((cat) => productData.categoryIds!.includes(cat.id));
        }
        return [];
    });

    const [features, setFeatures] = useState<string[]>(() => productData?.features || []);
    const [featureInput, setFeatureInput] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(productData?.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // 🔴 1. مقداردهی اولیه استیت با توضیحات قبلی محصول
    const [description, setDescription] = useState(productData.description || "");




    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                router.back();
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router]);

    const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === "") return;
        const categoryObj = allCategories.find(c => c.id === selectedId);
        if (categoryObj && !selectedCategories.some((cat) => cat.id === selectedId)) {
            setSelectedCategories((prev) => [...prev, categoryObj]);
        }
        e.target.value = "";
    };

    const removeCategory = (idToRemove: string) => {
        setSelectedCategories((prev) => prev.filter((cat) => cat.id !== idToRemove));
    };

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (trimmed && !features.includes(trimmed)) {
            setFeatures([...features, trimmed]);
            setFeatureInput("");
        }
    };

    const removeFeature = (indexToRemove: number) => {
        setFeatures(features.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // 🔴 استیت‌های مربوط به تولید خودکار اسلاگ
    const [productName, setProductName] = useState(productData.name || "");
    const [productSlug, setProductSlug] = useState(productData.slug || "");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setProductName(val);
        setProductSlug(generatePersianSlug(val));
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6" dir="rtl">
            <div className="flex flex-wrap items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">ویرایش محصول</h1>
                    <p className="text-gray-500 text-sm mt-2">تغییرات مورد نیاز را اعمال کرده و ذخیره کنید</p>
                </div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-all shadow-sm font-medium"
                >
                    <span>بازگشت</span>
                    <ArrowLeft className="w-4 h-4" />
                </button>
            </div>

            <form ref={formRef} action={formAction} className="space-y-8">
                <input type="hidden" name="id" value={productData.id} />
                <input type="hidden" name="existingImageUrl" value={productData.imageUrl || ""} />
                 {/* 🔴 2. فیلد مخفی برای ارسال استیت ادیتور به اکشن */}
                <input type="hidden" name="description" value={description} />


                {selectedCategories.map((cat, index) => (
                    <input key={`cat-${index}`} type="hidden" name="categoryIds" value={cat.id} />
                ))}
                {features.map((feature, index) => (
                    <input key={`feat-${index}`} type="hidden" name="features" value={feature} />
                ))}

                <section className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded">
                            <Type className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">اطلاعات اصلی و تصویر</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">نام محصول <span className="text-red-500">*</span></label>
                            {/* 🔴 اینجا value به productName تغییر کرد */}
                            <input
                                type="text"
                                onChange={handleNameChange}
                                name="name"
                                value={productName}
                                required
                                className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex justify-between">
                                <span>اسلاگ (شناسه URL) <span className="text-red-500">*</span></span>
                            </label>
                            {/* 🔴 اینجا value به productSlug تغییر کرد */}
                            <input
                                type="text"
                                onChange={(e) => setProductSlug(e.target.value)}
                                name="slug"
                                value={productSlug}
                                required
                                className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono text-sm"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" /> قیمت قبل (تومان)
                            </label>
                            <input type="number" name="oldPrice" defaultValue={productData.oldPrice || ""} className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" /> قیمت جدید فروش (تومان) <span className="text-red-500">*</span>
                            </label>
                            <input type="number" name="newPrice" defaultValue={productData.newPrice} required className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    </div>

                    {/* آپلود عکس */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="text-sm font-semibold text-gray-700">تصویر محصول <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/50 rounded transition-all overflow-hidden group">
                            <input
                                ref={fileInputRef}
                                type="file"
                                required={!previewImage}
                                name="imageFile"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {!previewImage ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded flex items-center justify-center mb-4 text-gray-500 group-hover:text-blue-500 transition-colors">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">برای انتخاب عکس کلیک کنید یا عکس را اینجا رها کنید</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded shadow-sm backdrop-blur-sm transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 2. دسته‌بندی و ویژگی‌ها */}
                <div className="grid md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-5">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded">
                                <LayoutList className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">دسته‌بندی‌های محصول</h2>
                        </div>
                        <div className="space-y-4">
                            <select defaultValue="" onChange={handleSelectCategory} className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                                <option value="" disabled>جستجو و انتخاب دسته‌بندی...</option>
                                {allCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.catName}</option>
                                ))}
                            </select>
                            <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                                {selectedCategories.map((cat, index) => (
                                    <span key={index} className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded text-sm">
                                        {cat.catName}
                                        <button type="button" onClick={() => removeCategory(cat.id)} className="text-purple-400 hover:text-red-500 bg-white rounded-full p-0.5">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-5">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                                <ListChecks className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">ویژگی‌ها و امکانات</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    placeholder="مثال: دارای پاسخنامه تشریحی"
                                />
                                <button type="button" onClick={addFeature} className="bg-emerald-100 text-emerald-700 px-4 rounded hover:bg-emerald-200 transition-colors font-medium">
                                    افزودن
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                                {features.map((f, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded text-sm">
                                        <span>{f}</span>
                                        <button type="button" onClick={() => removeFeature(index)} className="text-emerald-400 hover:text-red-500 bg-white rounded p-0.5">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

          

                {/* 4. استفاده از کامپوننت ادیتور در بخش توضیحات */}
        {/* 🔴 3. بخش textarea قدیمی حذف شد و کامپوننت ادیتور اصلاح شد */}
                <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-blue-500" /> توضیحات محصول
                    </label>
                    
                    <div className="border border-gray-200 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                        {/* 🔴 فقط از value و onChange استفاده کنید */}
                        <RichTextEditor 
                            value={description}
                            onChange={setDescription} 
                        />
                    </div>
                </section>








                {/* نوار دکمه شناور */}
                <div className=" left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-50">
                    <div className="w-full max-w-5xl flex justify-end gap-4 px-4 sm:px-6 lg:px-8">
                        <button type="button" onClick={() => router.back()} className="px-6 py-3.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors">
                            انصراف
                        </button>
                        <button type="submit" disabled={isPending} className="flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20">
                            {isPending ? "در حال ذخیره..." : "ثبت تغییرات"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
