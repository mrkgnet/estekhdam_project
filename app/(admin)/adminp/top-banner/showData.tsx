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
  BellRing
} from "lucide-react";
import { createBannerAction, deleteBannerAction, updateBannerAction } from "@/actions/admin/topBanner/Actions";
import { TOP_BANNER_KEY } from "@/hooks/useTopBanner"; // 👈 استفاده از ثابت معتبر هوک

const NEWS_STATUS_MAP = {
  NONE: "بدون وضعیت (بنر معمولی)",
  REGISTRATION: "ثبت نام",
  REGISTRATION_RENEWAL: "تمدید ثبت نام",
  CARD_RECEIVED: "دریافت کارت",
  RESULTS_ANNOUNCED: "اعلام نتایج",
};

// تابع کمکی برای تولید اسلاگ استاندارد فارسی و انگلیسی
function generateSlugFromTitle(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  const [bannerToDelete, setBannerToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [addState, addAction] = useActionState(createBannerAction, null);
  const [editState, editAction] = useActionState(updateBannerAction, null);

  const isAnyModalOpen = isAddModalOpen || isEditModalOpen || !!bannerToDelete;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (!isEditModalOpen) {
      setSlug(generateSlugFromTitle(nextTitle));
    }
  };

  // 👈 ابطال کش پس از ثبت موفق بنر
  useEffect(() => {
    if (addState?.success) {
      toast.success(addState.success);
      queryClient.invalidateQueries({ 
        queryKey: TOP_BANNER_KEY,
        refetchType: "all"
      });
      if (addState.clearForm) closeAllModals();
    } else if (addState?.error) {
      toast.error(addState.error);
    }
  }, [addState, queryClient]);

  // 👈 ابطال کش پس از ویرایش موفق بنر
  useEffect(() => {
    if (editState?.success) {
      toast.success(editState.success);
      queryClient.invalidateQueries({ 
        queryKey: TOP_BANNER_KEY,
        refetchType: "all"
      });
      closeAllModals();
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

  // 👈 ابطال کش پس از حذف بنر
  const handleDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteBannerAction(bannerToDelete.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("بنر با موفقیت حذف شد");
        queryClient.invalidateQueries({ 
          queryKey: TOP_BANNER_KEY,
          refetchType: "all"
        });
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
      {/* Header */}
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
              ایجاد، ویرایش و حذف بنرهای نمایشی و خبرهای فوری
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 border-slate-300 dark:border-slate-700 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm border-b-2 border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-medium whitespace-nowrap">تصویر بنر</th>
                <th className="p-4 font-medium">عنوان</th>
                <th className="p-4 font-medium">وضعیت خبر فوری</th>
                <th className="p-4 font-medium">لینک مقصد</th>
                <th className="p-4 font-medium">وضعیت</th>
                <th className="p-4 font-medium text-center whitespace-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          هنوز بنری ایجاد نشده است
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                initialData.map((banner) => (
                  <tr key={banner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150 group">
                    <td className="p-4">
                      <div className="w-36 h-16 rounded-md overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                        {banner.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono" dir="ltr">
                        /{banner.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      {banner.newsStatus ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                          <BellRing className="w-3 h-3" />
                          {NEWS_STATUS_MAP[banner.newsStatus as keyof typeof NEWS_STATUS_MAP] || banner.newsStatus}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">ندارد</span>
                      )}
                    </td>
                    <td className="p-4">
                      {banner.targetUrl ? (
                        <Link href={banner.targetUrl} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium truncate max-w-[150px]" dir="ltr">
                          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{banner.targetUrl}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {banner.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-400">
                          <ToggleRight className="w-3.5 h-3.5" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-400">
                          <ToggleLeft className="w-3.5 h-3.5" />
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(banner)} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-blue-600 bg-blue-50 border-2 border-blue-300 hover:bg-blue-100 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setBannerToDelete(banner)} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-rose-600 bg-rose-50 border-2 border-rose-300 hover:bg-rose-100 transition-colors">
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
      </div>

      {/* Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-slate-300 dark:border-slate-700">
            <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">
                  {isEditModalOpen ? "ویرایش بنر" : "ایجاد بنر جدید"}
                </h2>
              </div>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-md transition-colors border-2 border-transparent">
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
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                  placeholder="مثلا: آغاز ثبت نام آزمون استخدامی"
                />
              </div>

              {/* وضعیت فوری */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  نوع خبر فوری
                </label>
                <select
                  name="newsStatus"
                  defaultValue={isEditModalOpen ? (currentBanner?.newsStatus || "NONE") : "NONE"}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="NONE">{NEWS_STATUS_MAP.NONE}</option>
                  <option value="REGISTRATION">{NEWS_STATUS_MAP.REGISTRATION}</option>
                  <option value="REGISTRATION_RENEWAL">{NEWS_STATUS_MAP.REGISTRATION_RENEWAL}</option>
                  <option value="CARD_RECEIVED">{NEWS_STATUS_MAP.CARD_RECEIVED}</option>
                  <option value="RESULTS_ANNOUNCED">{NEWS_STATUS_MAP.RESULTS_ANNOUNCED}</option>
                </select>
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
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50 outline-none font-mono text-left"
                  dir="ltr"
                />
              </div>

              {/* لینک مقصد */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  لینک مقصد (Target URL) <span className="text-xs text-slate-400 font-normal">(اختیاری)</span>
                </label>
                <input
                  type="url"
                  name="targetUrl"
                  defaultValue={isEditModalOpen ? currentBanner?.targetUrl || "" : ""}
                  placeholder="https://example.com/target"
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md outline-none font-mono text-left bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  dir="ltr"
                />
              </div>

              {/* لینک تصویر */}
              <div>
                <label className="block mb-1.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  لینک تصویر بنر <span className="text-xs text-slate-400 font-normal">(اختیاری)</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={isEditModalOpen ? currentBanner?.imageUrl || "" : ""}
                  onChange={(e) => setImgPreview(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md outline-none font-mono text-left bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  dir="ltr"
                />
                <ImagePreview url={imgPreview} alt="پیش‌نمایش بنر" />
              </div>

              {/* وضعیت فعال */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-md border-2 border-emerald-300">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={isEditModalOpen ? currentBanner?.isActive : true}
                  className="w-5 h-5 text-emerald-600 rounded-md border-2 border-slate-300 cursor-pointer"
                />
                <label htmlFor="isActive" className="cursor-pointer font-medium text-slate-700 text-sm flex items-center gap-2">
                  <ToggleRight className="w-5 h-5 text-emerald-600" />
                  این بنر در سایت نمایش داده شود
                </label>
              </div>

              {/* پیام خطا */}
              {(addState?.error || editState?.error) && (
                <div className="p-3 bg-rose-50 border-2 border-rose-300 text-rose-700 rounded-md text-center font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{addState?.error || editState?.error}</span>
                </div>
              )}

              {/* دکمه‌ها */}
              <div className="pt-4 mt-2 border-t-2 border-slate-200 space-y-2.5">
                <SubmitButton label={isEditModalOpen ? "ذخیره تغییرات" : "ثبت و ایجاد بنر"} />
                <button type="button" onClick={closeAllModals} className="w-full py-2.5 px-4 rounded-md font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال حذف */}
      <DeleteConfirmModal isOpen={!!bannerToDelete} onClose={() => setBannerToDelete(null)} onConfirm={handleDelete} title={bannerToDelete?.title || ""} isDeleting={isDeleting} />
    </div>
  );
}