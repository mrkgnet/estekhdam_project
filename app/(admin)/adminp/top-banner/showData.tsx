"use client";

import { createBannerAction } from "@/actions/admin/topBanner/add/Actions";
import { deleteBannerAction } from "@/actions/admin/topBanner/delete/Actions";
import { updateBannerAction } from "@/actions/admin/topBanner/update/Actions";
import React, { useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

// کامپوننت دکمه با ظاهر مدرن‌تر و افکت کلیک
function SubmitButton({ label = "ذخیره بنر" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 active:scale-[0.98] ${
        pending 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
      }`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          در حال پردازش...
        </span>
      ) : label}
    </button>
  );
}

export default function ShowDataTopBannerPage({ initialData = [] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  
  // فیلدهای فرم
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  const [addState, addAction] = useFormState(createBannerAction, null);
  const [editState, editAction] = useFormState(updateBannerAction, null);

  // تولید اسلاگ خودکار
  useEffect(() => {
    const generatedSlug = title.trim().replace(/\s+/g, "-").toLowerCase();
    setSlug(generatedSlug);
  }, [title]);

  // هندل کردن موفقیت در فرم‌ها
  useEffect(() => {
    if (addState?.success) setIsAddModalOpen(false);
    if (editState?.success) setIsEditModalOpen(false);
  }, [addState, editState]);

  const openEditModal = (banner) => {
    setCurrentBanner(banner);
    setTitle(banner.title);
    setSlug(banner.slug);
    setImgPreview(banner.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("آیا از حذف این بنر مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      await deleteBannerAction(id);
    }
  };

  return (
    <div className="p-6  max-w-7xl mx-auto" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">مدیریت بنرهای بالای سایت</h1>
        <button
          onClick={() => { setTitle(""); setImgPreview(""); setIsAddModalOpen(true); }}
          className="bg-emerald-600 text-white py-2.5 px-6 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2 active:scale-95"
        >
          <span className="text-xl leading-none">+</span>
          افزودن بنر جدید
        </button>
      </div>

      {/* جدول نمایش دیتا */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50/80 text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-semibold whitespace-nowrap">تصویر بنر</th>
                <th className="p-4 font-semibold">عنوان</th>
                <th className="p-4 font-semibold">وضعیت</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    هیچ بنری یافت نشد. اولین بنر خود را ایجاد کنید!
                  </td>
                </tr>
              ) : (
                initialData.map((banner) => (
                  <tr key={banner.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                    <td className="p-4">
                      <div className="w-32 h-14 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{banner.title}</td>
                    <td className="p-4">
                      {banner.isActive ? 
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          فعال
                        </span> : 
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          غیرفعال
                        </span>
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => openEditModal(banner)} 
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleDelete(banner.id)} 
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال افزودن / ویرایش */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800">
                {isEditModalOpen ? "ویرایش اطلاعات بنر" : "ایجاد بنر جدید"}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form action={isEditModalOpen ? editAction : addAction} className="space-y-5 text-sm">
              {isEditModalOpen && <input type="hidden" name="id" value={currentBanner?.id} />}
              
              <div>
                <label className="block mb-1.5 font-semibold text-gray-700">متن بنر</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white outline-none" 
                  placeholder="مثلا: جشنواره فروش پاییزه"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-gray-700">اسلاگ (شناسه URL)</label>
                <input 
                  type="text" 
                  name="slug" 
                  required 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-100 text-left text-gray-600 outline-none" 
                  dir="ltr" 
                />
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-gray-700">لینک تصویر بنر</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  required 
                  defaultValue={isEditModalOpen ? currentBanner?.imageUrl : ""} 
                  onChange={(e) => setImgPreview(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white text-left outline-none" 
                  dir="ltr" 
                  placeholder="https://..."
                />
                
                {/* پیش‌نمایش تصویر نرم‌تر */}
                {imgPreview && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">پیش‌نمایش تصویر:</p>
                    <div className="w-full h-36 rounded-xl border border-gray-200 overflow-hidden shadow-inner bg-gray-50 flex items-center justify-center">
                      <img 
                        src={imgPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }} 
                      />
                      <span className="text-gray-400 text-xs hidden">تصویر قابل بارگذاری نیست</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-gray-700">لینک مقصد (Target URL)</label>
                <input 
                  type="url" 
                  name="targetUrl" 
                  required 
                  defaultValue={isEditModalOpen ? currentBanner?.targetUrl : ""} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white text-left outline-none" 
                  dir="ltr" 
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  id="isActive" 
                  defaultChecked={isEditModalOpen ? currentBanner?.isActive : true} 
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="cursor-pointer font-medium text-gray-700 select-none">
                  این بنر در سایت نمایش داده شود (فعال)
                </label>
              </div>

              <div className="pt-6 mt-2 border-t border-gray-100">
                <SubmitButton label={isEditModalOpen ? "ذخیره تغییرات" : "ثبت و ایجاد بنر"} />
                {(addState?.error || editState?.error) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center font-medium animate-in fade-in">
                    {addState?.error || editState?.error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}