"use client";




import React, { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Image as ImageIcon,
  Pencil,
  Trash2,
  X,
  Loader2,
  Link as LinkIcon,
  Eye,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle2,
  ImageOff,
  LayoutGrid,
} from "lucide-react";
import { createBannerAction, deleteBannerAction, updateBannerAction } from "@/actions/admin/topBanner/Actions";

// کامپوننت دکمه Submit با ظاهر هماهنگ با داشبورد
function SubmitButton({ label = "ذخیره بنر" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-2.5 px-4 rounded-md font-medium text-white transition-all duration-200 border-2 active:scale-[0.98] ${
        pending
          ? "bg-slate-400 border-slate-400 cursor-not-allowed"
          : "bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 shadow-sm hover:shadow-md"
      }`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال پردازش...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {label}
        </span>
      )}
    </button>
  );
}

// کامپوننت نمایش پیش‌نمایش تصویر با کنترل خطا
function ImagePreview({ url, alt }: { url: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [url]);

  if (!url) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium flex items-center gap-1">
        <Eye className="w-3.5 h-3.5" />
        پیش‌نمایش تصویر:
      </p>
      <div className="w-full h-40 rounded-md border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs font-medium">تصویر قابل بارگذاری نیست</span>
          </div>
        ) : (
          <img
            src={url}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// کامپوننت مودال تایید حذف
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-slate-700">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-lg bg-rose-100 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base">
              حذف بنر
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-6">
              آیا از حذف بنر <span className="font-bold text-slate-800 dark:text-slate-200">«{title}»</span> مطمئن هستید؟ این عمل غیرقابل بازگشت است.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-md font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-md font-medium text-white bg-rose-600 hover:bg-rose-700 border-2 border-rose-600 hover:border-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال حذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                تایید حذف
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShowDataTopBannerPage({ initialData = [] }: { initialData: any[] }) {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<any>(null);

  // فیلدهای فرم
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  // مودال حذف
  const [bannerToDelete, setBannerToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // استفاده از useActionState
  const [addState, addAction] = useActionState(createBannerAction, null);
  const [editState, editAction] = useActionState(updateBannerAction, null);

  // آیا هر مودالی باز است؟
  const isAnyModalOpen = isAddModalOpen || isEditModalOpen || !!bannerToDelete;

  // قفل اسکرول پس‌زمینه وقتی مودال باز است
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  // تولید اسلاگ خودکار با پشتیبانی از حروف فارسی و انگلیسی
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .trim()
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // حذف نیم‌فاصله مخفی
        .replace(/[\s_]+/g, "-") // تبدیل فاصله و آندرلاین به خط تیره
        .replace(/[^\p{L}\p{N}\-]+/gu, "") // حفظ حروف، اعداد و خط تیره
        .replace(/\-+/g, "-") // تبدیل خط تیره‌های تکراری
        .replace(/^-+|-+$/g, ""); // حذف خط تیره اول و آخر

      setSlug(generatedSlug);
    } else {
      setSlug("");
    }
  }, [title]);

  // هندل کردن توست و باطل‌سازی کش برای ایجاد بنر
  useEffect(() => {
    if (addState?.success) {
      toast.success(addState.message || "بنر جدید با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["latestActiveBanner"] });
      setIsAddModalOpen(false);
      resetForm();
    } else if (addState?.error) {
      toast.error(addState.error);
    }
  }, [addState, queryClient]);

  // هندل کردن توست و باطل‌سازی کش برای ویرایش بنر
  useEffect(() => {
    if (editState?.success) {
      toast.success(editState.message || "تغییرات بنر با موفقیت ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["latestActiveBanner"] });
      setIsEditModalOpen(false);
      resetForm();
    } else if (editState?.error) {
      toast.error(editState.error);
    }
  }, [editState, queryClient]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setImgPreview("");
    setCurrentBanner(null);
  };

  const openEditModal = (banner: any) => {
    setCurrentBanner(banner);
    setTitle(banner.title || "");
    setSlug(banner.slug || "");
    setImgPreview(banner.imageUrl || "");
    setIsEditModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteBannerAction(bannerToDelete.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("بنر با موفقیت حذف شد");
        queryClient.invalidateQueries({ queryKey: ["latestActiveBanner"] });
        setBannerToDelete(null);
      }
    } catch (err) {
      toast.error("خطایی در حذف بنر رخ داد");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 w-full md:px-8 max-w-7xl mx-auto mb-10" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white dark:bg-slate-900 p-4 md:p-5 rounded-lg shadow-sm border-2 border-slate-300 dark:border-slate-700 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100">
              مدیریت بنرهای بالای سایت
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ایجاد، ویرایش و حذف بنرهای نمایشی
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-emerald-600 text-white py-2.5 px-5 rounded-md hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center gap-2 border-2 border-emerald-600 hover:border-emerald-700 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          افزودن بنر جدید
        </button>
      </div>

      {/* جدول نمایش دیتا */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 border-slate-300 dark:border-slate-700 overflow-hidden">
        {/* هدر جدول */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm border-b-2 border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-medium whitespace-nowrap">تصویر بنر</th>
                <th className="p-4 font-medium">عنوان</th>
                <th className="p-4 font-medium">لینک مقصد</th>
                <th className="p-4 font-medium">وضعیت</th>
                <th className="p-4 font-medium text-center whitespace-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          هنوز بنری ایجاد نشده است
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          اولین بنر خود را با کلیک روی دکمه بالا ایجاد کنید
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                initialData.map((banner) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {/* تصویر */}
                    <td className="p-4">
                      <div className="w-36 h-16 rounded-md overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* عنوان و اسلاگ */}
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                        {banner.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono" dir="ltr">
                        /{banner.slug}
                      </div>
                    </td>

                    {/* لینک مقصد */}
                    <td className="p-4">
                      {banner.targetUrl ? (
                        <Link
                          href={banner.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium truncate max-w-[180px]"
                          dir="ltr"
                        >
                          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{banner.targetUrl}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* وضعیت */}
                    <td className="p-4">
                      {banner.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-700">
                          <ToggleRight className="w-3.5 h-3.5" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-400 dark:border-slate-600">
                          <ToggleLeft className="w-3.5 h-3.5" />
                          غیرفعال
                        </span>
                      )}
                    </td>

                    {/* عملیات */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          title="ویرایش بنر"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBannerToDelete(banner)}
                          title="حذف بنر"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-2 border-rose-300 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* نمایش کارت‌وار در موبایل */}
        <div className="md:hidden p-3 space-y-3">
          {initialData.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                    هنوز بنری ایجاد نشده است
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    اولین بنر خود را ایجاد کنید
                  </p>
                </div>
              </div>
            </div>
          ) : (
            initialData.map((banner) => (
              <div
                key={banner.id}
                className="bg-slate-50 dark:bg-slate-800/40 rounded-md border-2 border-slate-300 dark:border-slate-700 p-3 space-y-3"
              >
                {/* تصویر + عنوان */}
                <div className="flex items-start gap-3">
                  <div className="w-24 h-14 rounded-md overflow-hidden border-2 border-slate-300 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900">
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2">
                      {banner.title}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {banner.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-700">
                          <ToggleRight className="w-3 h-3" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-400 dark:border-slate-600">
                          <ToggleLeft className="w-3 h-3" />
                          غیرفعال
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* لینک مقصد */}
                {banner.targetUrl && (
                  <Link
                    href={banner.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 truncate py-1.5 px-2 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
                    dir="ltr"
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{banner.targetUrl}</span>
                  </Link>
                )}

                {/* دکمه‌های عملیات */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-800 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => setBannerToDelete(banner)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-2 border-rose-300 dark:border-rose-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* مودال افزودن / ویرایش */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-slate-300 dark:border-slate-700">
            {/* هدر مودال */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">
                  {isEditModalOpen ? "ویرایش بنر" : "ایجاد بنر جدید"}
                </h2>
              </div>
              <button
                onClick={closeAllModals}
                className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-2 rounded-md transition-colors border-2 border-transparent hover:border-rose-300 dark:hover:border-rose-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={isEditModalOpen ? editAction : addAction} className="space-y-4 text-sm">
              {isEditModalOpen && <input type="hidden" name="id" value={currentBanner?.id} />}

              {/* عنوان */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  متن بنر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
                  placeholder="مثلا: جشنواره فروش پاییزه"
                />
              </div>

              {/* اسلاگ */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  اسلاگ (شناسه URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 outline-none font-mono text-left text-sm"
                  dir="ltr"
                  placeholder="banner-slug"
                />
              </div>

              {/* لینک تصویر */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  لینک تصویر بنر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  defaultValue={isEditModalOpen ? currentBanner?.imageUrl : ""}
                  onChange={(e) => setImgPreview(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none font-mono text-left text-sm placeholder:text-slate-400"
                  dir="ltr"
                  placeholder="https://example.com/image.jpg"
                />
                <ImagePreview url={imgPreview} alt="پیش‌نمایش بنر" />
              </div>

              {/* لینک مقصد */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  لینک مقصد (Target URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  name="targetUrl"
                  required
                  defaultValue={isEditModalOpen ? currentBanner?.targetUrl : ""}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none font-mono text-left text-sm placeholder:text-slate-400"
                  dir="ltr"
                  placeholder="https://example.com/page"
                />
              </div>

              {/* وضعیت فعال */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-md border-2 border-emerald-300 dark:border-emerald-800">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={isEditModalOpen ? currentBanner?.isActive : true}
                  className="w-5 h-5 text-emerald-600 rounded-md border-2 border-slate-300 dark:border-slate-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                />
                <label
                  htmlFor="isActive"
                  className="cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none text-sm flex items-center gap-2"
                >
                  <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  این بنر در سایت نمایش داده شود
                </label>
              </div>

              {/* پیام خطا */}
              {(addState?.error || editState?.error) && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-md text-center font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{addState?.error || editState?.error}</span>
                </div>
              )}

              {/* دکمه‌های اکشن */}
              <div className="pt-4 mt-2 border-t-2 border-slate-200 dark:border-slate-800 space-y-2.5">
                <SubmitButton label={isEditModalOpen ? "ذخیره تغییرات" : "ثبت و ایجاد بنر"} />
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="w-full py-2.5 px-4 rounded-md font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تایید حذف */}
      <DeleteConfirmModal
        isOpen={!!bannerToDelete}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleDelete}
        title={bannerToDelete?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}