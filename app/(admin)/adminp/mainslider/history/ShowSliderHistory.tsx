"use client";

import React, { useActionState, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle, Link as LinkIcon, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { editMainSliderAction } from '@/actions/admin/mainslider/edit/Actions';
import toast from 'react-hot-toast';
import DeleteButton from '@/components/ui/DeleteButton';
import deleteSliderAction from '@/actions/admin/mainslider/delete/Actions';
import BackButton from '@/components/ui/BackButton';

type SliderType = {
    id: string;
    imageUrl: string;
    title: string | null;
    description: string | null;
    targetLink: string | null;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

interface ShowSliderHistoryProps {
    historySlider: SliderType[];
}

export default function ShowSliderHistory({ historySlider }: ShowSliderHistoryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<SliderType | null>(null);
    const [state, formEditAction, isPending] = useActionState(editMainSliderAction, null);
    
    // رفرنس و استیت عکس
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleEditClick = (slider: SliderType) => {
        setEditingSlider(slider);
        setPreviewImage(slider.imageUrl); // نمایش عکس قبلی به عنوان پیش‌فرض
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingSlider(null);
            setPreviewImage(null); // پاک کردن پیش‌نمایش
        }, 300);
    };

    useEffect(() => {
        if (state?.success) {
            toast.success("اطلاعات با موفقیت ویرایش شد.");
            closeModal();
        } else if (state?.success === false) {
            toast.error(state.message);
        }
    }, [state]);

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
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-10">
                <div className="mb-0 flex justify-end ml-2 my-2">
                    <BackButton />
                </div>

                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className=" font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                        مدیریت و تاریخچه اسلایدرها
                    </h2>
                    <div className=" text-gray-500 flex items-center justify-center gap-2 ">
                        مجموع: {historySlider.length} اسلایدر
                    </div>
                </div>

                {historySlider.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-gray-500 ">هیچ اسلایدری یافت نشد.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-[13px]">
                        {/* جدول به همان شکلی که بود */}
                        <table className="w-full text-right">
                            {/* ... (کدهای thead و tbody که خودتان نوشته بودید اینجا قرار میگیرد - تغییری نیاز ندارد) ... */}
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 rounded-tr-lg">تصویر</th>
                                    <th className="px-6 py-4">عنوان و توضیحات</th>
                                    <th className="px-6 py-4">لینک مقصد</th>
                                    <th className="px-6 py-4 text-center">ترتیب</th>
                                    <th className="px-6 py-4">وضعیت</th>
                                    <th className="px-6 py-4">تاریخ ثبت</th>
                                    <th className="px-6 py-4 rounded-tl-lg text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {historySlider.map((slider, index) => (
                                        <motion.tr
                                            key={slider.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-32 h-16 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                    <Image src={slider.imageUrl} alt={slider.title || 'Slider image'} fill className="object-cover" sizes="(max-width: 128px) 100vw" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-800 line-clamp-1 max-w-xs">{slider.title || <span className="text-gray-400 font-normal">بدون عنوان</span>}</div>
                                                <div className="text-gray-500 mt-1 line-clamp-1 max-w-xs">{slider.description || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {slider.targetLink ? (
                                                    <a href={slider.targetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg w-fit transition-colors">
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                        <span className="line-clamp-1 max-w-[150px] dir-ltr">{slider.targetLink}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">{slider.order}</td>
                                            <td className="px-6 py-4">
                                                {slider.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> فعال
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                                                        <XCircle className="w-3.5 h-3.5" /> غیرفعال
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(slider.createdAt).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleEditClick(slider)} className="text-blue-600 cursor-pointer hover:text-blue-800 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">ویرایش</button>
                                                    <DeleteButton id={slider.id} action={deleteSliderAction} itemName="این اسلایدر" className="p-1.5 text-red-600 cursor-pointer flex bg-red-50 gap-1 hover:bg-red-50 rounded-lg transition-colors">حذف</DeleteButton>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- مدال ویرایش با انیمیشن --- */}
            <AnimatePresence>
                {isModalOpen && editingSlider && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative custom-scrollbar"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-20">
                                <h3 className=" font-bold text-gray-800">ویرایش اسلایدر</h3>
                                <button type="button" onClick={closeModal} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form action={formEditAction} className="p-6 space-y-5">
                                <input type="hidden" name="id" value={editingSlider.id} />
                                {/* فیلد مخفی برای ارسال عکس قبلی به سرور */}
                                <input type="hidden" name="existingImageUrl" value={editingSlider.imageUrl} />

                                {/* بخش آپلود عکس در بالای فرم (بهتر است عکس را اول ببینند) */}
                                <div className="space-y-3 pb-4 border-b border-gray-100">
                                    <label className="text-sm font-semibold text-gray-700">تصویر اسلایدر <span className="text-red-500">*</span></label>

                                    <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/50 rounded-2xl transition-all overflow-hidden group">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
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
                                                <p className="text-sm font-medium text-gray-700">برای تغییر عکس کلیک کنید یا عکس جدید را اینجا رها کنید</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-xl shadow-sm backdrop-blur-sm transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
                                                    برای تغییر عکس کلیک کنید
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px]">
                                    <div className="space-y-2">
                                        <label className="text-gray-700">عنوان</label>
                                        <input type="text" name="title" defaultValue={editingSlider.title || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-700">ترتیب نمایش</label>
                                        <input type="number" name="order" defaultValue={editingSlider.order} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center" />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-gray-700">لینک مقصد</label>
                                        <input type="text" name="targetLink" defaultValue={editingSlider.targetLink || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all dir-ltr text-left" />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-gray-700">توضیحات</label>
                                        <textarea name="description" rows={3} defaultValue={editingSlider.description || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"></textarea>
                                    </div>

                                    <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingSlider.isActive} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                        <label htmlFor="isActive" className="text-gray-700 cursor-pointer">
                                            اسلایدر فعال باشد و در سایت نمایش داده شود
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                                    <button type="button" onClick={closeModal} disabled={isPending} className="px-5 py-2.5 cursor-pointer text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                                        انصراف
                                    </button>
                                    <button type="submit" disabled={isPending} className="px-6 py-2.5 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                        {isPending ? (
                                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> در حال ذخیره...</>
                                        ) : "ذخیره تغییرات"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
