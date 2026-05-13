// file: ShowMainSlider.tsx

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Edit, Link, Trash2, UploadCloud, X } from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";
import Image from "next/image";
import { addMainSliderAction } from "@/actions/admin/mainslider/add/Actions";
import deleteSliderAction from "@/actions/admin/mainslider/delete/Actions";
import { editMainSliderAction } from "@/actions/admin/mainslider/edit/Actions";

type MainSlider = {
    id: string;
    imageUrl: string;
    title: string | null;
    description: string | null;
    targetLink: string | null;
    isActive: boolean;
    order?: number;
};

export default function ShowMainSlider({ getDataSlider }: { getDataSlider: any }) {
    const sliders: MainSlider[] = Array.isArray(getDataSlider) ? getDataSlider : (getDataSlider?.data || []);

    // --- State های مربوط به افزودن ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(addMainSliderAction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");


    // --- State های مربوط به ویرایش ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<MainSlider | null>(null);
    const [editState, editFormAction, isEditPending] = useActionState(editMainSliderAction, null);
    const editFormRef = useRef<HTMLFormElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);
    const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
    const [editExternalImageUrl, setEditExternalImageUrl] = useState("");


    useEffect(() => {
        if (state?.success) {
            handleCloseModal();
            toast.success(state?.message || "اسلایدر با موفقیت ثبت شد");
        } else if (state?.success === false) {
            toast.error(state.message || "خطایی رخ داد");
        }
    }, [state]);

    useEffect(() => {
        if (editState?.success) {
            handleCloseEditModal();
            toast.success(editState?.message || "اسلایder با موفقیت ویرایش شد");
        } else if (editState?.success === false) {
            toast.error(editState.message || "خطایی رخ داد");
        }
    }, [editState]);

    // --- توابع افزودن ---
    const handleCloseModal = () => {
        setIsModalOpen(false);
        formRef.current?.reset();
        clearImage();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setExternalImageUrl(""); // پاک کردن لینک خارجی در صورت انتخاب فایل
        }
    };

    const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setExternalImageUrl(url);
        if (url) {
            setPreviewImage(url); // نمایش پیش‌نمایش از لینک
            clearImageFile(); // پاک کردن فایل در صورت ورود لینک
        } else {
            setPreviewImage(null);
        }
    };

    const clearImage = () => {
        setPreviewImage(null);
        setExternalImageUrl("");
        clearImageFile();
    };

    const clearImageFile = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    }


    // --- توابع ویرایش ---
    const openEditModal = (slider: MainSlider) => {
        setEditingSlider(slider);
        setEditPreviewImage(slider.imageUrl);
        // اگر لینک یک URL کامل بود، آن را در فیلد لینک خارجی قرار بده
        if (slider.imageUrl && (slider.imageUrl.startsWith('http://') || slider.imageUrl.startsWith('https://'))) {
            setEditExternalImageUrl(slider.imageUrl);
        } else {
            setEditExternalImageUrl("");
        }
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingSlider(null);
        clearEditImage();
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditPreviewImage(URL.createObjectURL(file));
            setEditExternalImageUrl("");
        }
    };

    const handleEditExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setEditExternalImageUrl(url);
        if (url) {
            setEditPreviewImage(url);
            clearEditImageFile();
        } else {
            setEditPreviewImage(null);
        }
    };

    const clearEditImage = () => {
        setEditPreviewImage(null);
        setEditExternalImageUrl("");
        clearEditImageFile();
    };

    const clearEditImageFile = () => {
        if (editFileInputRef.current) editFileInputRef.current.value = "";
    }

    // --- مدیریت اسکرول ---
    useEffect(() => {
        const isOpen = isModalOpen || isEditModalOpen;
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isModalOpen, isEditModalOpen]);

    return (
        <div className="text-xs md:text-sm max-w-7xl mx-auto p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-base font-bold text-gray-800">مدیریت اسلایدر اصلی</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    + افزودن اسلایدر
                </button>
            </div>

            {/* ... بدنه جدول بدون تغییر باقی می‌ماند ... */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 border-b w-16 text-center">ردیف</th>
                            <th className="p-4 border-b w-32 text-center">تصویر</th>
                            <th className="p-4 border-b">عنوان (اختیاری)</th>
                            <th className="p-4 border-b">لینک (اختیاری)</th>
                            <th className="p-4 border-b text-center">وضعیت</th>
                            <th className="p-4 border-b text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.length > 0 ? (
                            sliders.map((slider, index) => (
                                <tr key={slider.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                                    <td className="p-4 text-gray-500 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="p-4 text-center">
                                        {slider.imageUrl ? (
                                            <div className="w-24 h-12 relative mx-auto bg-gray-100 rounded-lg overflow-hidden border">
                                                <Image src={slider.imageUrl} alt={slider.title || "اسلایدر"} fill className="object-cover" sizes="96px" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">بدون عکس</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-900 ">{slider.title || "---"}</td>
                                    <td className="p-4 text-blue-500" dir="ltr">{slider.targetLink || "---"}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${slider.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {slider.isActive ? "فعال" : "غیرفعال"}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-center items-center">
                                        <button
                                            onClick={() => openEditModal(slider)}
                                            className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> ویرایش
                                        </button>
                                        <DeleteButton
                                            id={slider.id}
                                            action={deleteSliderAction}
                                            itemName="این اسلایدر"
                                            className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            حذف
                                        </DeleteButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    هیچ اسلایدری یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- مدال افزودن --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/20" />
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative bg-white rounded shadow-2xl w-full max-w-lg">
                            <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-gray-800 font-bold">افزودن اسلایدر جدید</h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                            </div>
                            <form ref={formRef} action={formAction} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700">لینک خارجی تصویر (URL)</label>
                                    <input type="url" name="externalImageUrl" value={externalImageUrl} onChange={handleExternalUrlChange} disabled={!!previewImage && !externalImageUrl} placeholder="https://example.com/image.jpg" className="w-full border p-2.5 rounded-lg" dir="ltr" />
                                </div>

                                <div className="flex items-center text-gray-500 text-xs">
                                    <div className="flex-grow border-t"></div><span className="px-3">یا</span><div className="flex-grow border-t"></div>
                                </div>

                                <div className="space-y-3 pb-2">
                                    <label className="text-sm font-semibold text-gray-700">آپلود تصویر <span className="text-red-500">*</span></label>
                                    <div className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden group ${externalImageUrl ? 'bg-gray-200 border-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'}`}>
                                        <input ref={fileInputRef} type="file" name="imageFile" accept="image/*" onChange={handleImageChange} disabled={!!externalImageUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {!previewImage ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                                                <p className="text-sm">برای انتخاب عکس کلیک کنید</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={clearImage} className="absolute top-2 right-2 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-xl shadow-sm"><X className="w-5 h-5" /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div><label>عنوان (اختیاری)</label><input type="text" name="title" className="w-full border p-2.5 rounded-lg" /></div>
                                <div><label>لینک مقصد (اختیاری)</label><input type="text" name="targetLink" className="w-full border p-2.5 rounded-lg" dir="ltr" /></div>
                                <div><label>توضیحات (اختیاری)</label><textarea name="description" rows={2} className="w-full border p-2.5 rounded-lg resize-none" /></div>
                                <div className="flex gap-3 pt-4 border-t">
                                    <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">{isPending ? "در حال ذخیره..." : "ذخیره اسلایدر"}</button>
                                    <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg">انصراف</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- مدال ویرایش --- */}
            <AnimatePresence>
                {isEditModalOpen && editingSlider && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseEditModal} className="absolute inset-0 bg-black/20" />
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative bg-white rounded shadow-2xl w-full max-w-lg">
                            <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-gray-800 font-bold">ویرایش اسلایدر</h2>
                                <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                            </div>
                            <form ref={editFormRef} action={editFormAction} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                                <input type="hidden" name="id" value={editingSlider.id} />
                                <input type="hidden" name="existingImageUrl" value={editingSlider.imageUrl} />

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700">لینک خارجی تصویر (URL)</label>
                                    <input type="url" name="externalImageUrl" value={editExternalImageUrl} onChange={handleEditExternalUrlChange} disabled={!!editPreviewImage && !editExternalImageUrl} placeholder="https://example.com/image.jpg" className="w-full border p-2.5 rounded-lg" dir="ltr" />
                                </div>

                                <div className="flex items-center text-gray-500 text-xs">
                                    <div className="flex-grow border-t"></div><span className="px-3">یا</span><div className="flex-grow border-t"></div>
                                </div>

                                <div className="space-y-3 pb-2">
                                    <label className="text-sm font-semibold text-gray-700">آپلود تصویر جدید</label>
                                    <div className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden group ${editExternalImageUrl ? 'bg-gray-200 border-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'}`}>
                                        <input ref={editFileInputRef} type="file" name="imageFile" accept="image/*" onChange={handleEditImageChange} disabled={!!editExternalImageUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {!editPreviewImage ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                                                <p className="text-sm">برای انتخاب عکس کلیک کنید</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={editPreviewImage} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={clearEditImage} className="absolute top-2 right-2 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-xl shadow-sm"><X className="w-5 h-5" /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1"><label>ترتیب (Order)</label><input type="number" name="order" defaultValue={editingSlider.order || 0} className="w-full border p-2.5 rounded-lg" /></div>
                                    <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={editingSlider.isActive} className="w-5 h-5" /> فعال باشد</label></div>
                                </div>
                                <div><label>عنوان (اختیاری)</label><input type="text" name="title" defaultValue={editingSlider.title || ""} className="w-full border p-2.5 rounded-lg" /></div>
                                <div><label>لینک مقصد (اختیاری)</label><input type="text" name="targetLink" defaultValue={editingSlider.targetLink || ""} className="w-full border p-2.5 rounded-lg" dir="ltr" /></div>
                                <div><label>توضیحات (اختیاری)</label><textarea name="description" rows={2} defaultValue={editingSlider.description || ""} className="w-full border p-2.5 rounded-lg resize-none" /></div>
                                <div className="flex gap-3 pt-4 border-t">
                                    <button type="submit" disabled={isEditPending} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">{isEditPending ? "در حال به‌روزرسانی..." : "به‌روزرسانی"}</button>
                                    <button type="button" onClick={handleCloseEditModal} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg">انصراف</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
