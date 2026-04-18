"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import addCategoryAction from "@/actions/category/addcategory/Actions";
import toast from "react-hot-toast";
// 🟢 اضافه شدن آیکون‌های آپلود و ضربدر
import { Edit, Trash2, UploadCloud, X } from "lucide-react"; 
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteItemCategoryAction } from "@/actions/category/deletecategory/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import Image from "next/image"; // 🟢 برای نمایش بهینه عکس در جدول

type Category = {
    id: string;
    catId: number;
    catName: string;
    catSlug: string;
    imageUrl?: string; // 🟢 اضافه شدن فیلد عکس به تایپ
};

export default function CategoryManager({ getDataCat }: { getDataCat: any }) {
    const categories: Category[] = Array.isArray(getDataCat) ? getDataCat : (getDataCat?.data || []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(addCategoryAction, null);

    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // 🟢 اضافه شدن Ref برای اینپوت فایل

    const [catName, setCatName] = useState("");
    const [catSlug, setCatSlug] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null); // 🟢 استیت پیش‌نمایش عکس

    useEffect(() => {
        if (state?.success) {
            setIsModalOpen(false);
            formRef.current?.reset();
            setCatName("");
            setCatSlug("");
            clearImage(); // 🟢 پاک کردن عکس بعد از ثبت موفق
            toast.success(state?.message || "با موفقیت ثبت شد");
        }
    }, [state]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCatName(val);
        setCatSlug(generatePersianSlug(val)); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCatName("");
        setCatSlug("");
        clearImage(); // 🟢 پاک کردن عکس هنگام بستن مودال
    };

    // 🟢 مدیریت عکس
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="p-6 text-xs md:text-sm" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-base font-bold text-gray-800">لیست دسته‌بندی‌ها</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    + افزودن دسته
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 border-b w-16 text-center">ردیف</th>
                            <th className="p-4 border-b w-24 text-center">تصویر</th> {/* 🟢 ستون تصویر */}
                            <th className="p-4 border-b">نام دسته</th>
                            <th className="p-4 border-b">اسلاگ (Slug)</th>
                            <th className="p-4 border-b">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat, index) => (
                                <tr key={cat.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                                    <td className="p-4 text-gray-500 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    {/* 🟢 نمایش عکس در جدول */}
                                    <td className="p-4 text-center">
                                        {cat.imageUrl ? (
                                            <div className="w-12 h-12 relative mx-auto bg-gray-100 rounded-lg overflow-hidden border">
                                                <Image src={cat.imageUrl} alt={cat.catName} fill className="object-cover mix-blend-multiply" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">بدون عکس</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-900 ">{cat.catName}</td>
                                    <td className="p-4 text-gray-500 font-mono" dir="ltr">{cat.catSlug}</td>
                                
                                    <td className="p-4 text-gray-700">
                                        <DeleteButton
                                            id={cat.id}
                                            action={deleteItemCategoryAction}
                                            itemName="این آیتم"
                                            className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            حذف
                                        </DeleteButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* 🟢 تغییر colSpan به 5 */}
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    هیچ دسته‌بندی یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {/* بقیه کد مودال بدون تغییر... فقط بخش عکس همانی است که خودتان داده بودید */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-gray-800">افزودن دسته جدید</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg leading-none transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form ref={formRef} action={formAction} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
                                {state?.success === false && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                        {state.message || state.error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 mb-1.5">نام دسته</label>
                                    <input
                                        type="text"
                                        required
                                        name="catName"
                                        value={catName}
                                        onChange={handleNameChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="مثال: لپ‌تاپ"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1.5">اسلاگ</label>
                                    <input
                                        type="text"
                                        name="catSlug"
                                        required
                                        value={catSlug}
                                        onChange={(e) => setCatSlug(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="مثال: laptop"
                                        dir="ltr"
                                    />
                                </div>

                                {/* آپلود تصویر */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <label className="text-sm font-semibold text-gray-700">تصویر دسته <span className="text-red-500">*</span></label>
                                    <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/50 rounded-2xl transition-all overflow-hidden group">
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
                                                <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500 group-hover:text-blue-500 transition-colors">
                                                    <UploadCloud className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">برای انتخاب عکس کلیک کنید</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-xl shadow-sm backdrop-blur-sm transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-600/20 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        {isPending ? "در حال ذخیره..." : "ذخیره دسته"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleCloseModal}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        انصراف
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
