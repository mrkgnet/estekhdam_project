"use client";

import {
  createQuestionReferenceAction,
  deleteQuestionReferenceAction,
  toggleQuestionReferenceStatusAction,
  updateQuestionReferenceAction,
} from "@/actions/admin/reference_question/Actions";
import React, { useState, useTransition, useOptimistic } from "react";

export interface FormattedReferenceItem {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  questionCount?: number;
  createdAt: string;
}

interface ShowDataProps {
  initialData: FormattedReferenceItem[];
}

type OptimisticAction =
  | { type: "ADD"; payload: FormattedReferenceItem }
  | { type: "UPDATE"; payload: { id: string; title: string; slug: string } }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE"; payload: { id: string; nextStatus: boolean } };

export default function ReferencePage({ initialData }: ShowDataProps) {
  const [isPending, startTransition] = useTransition();

  // استیت آپتیمیستیک جهت اعمال بلادرنگ تغییرات روی استریم کلاینت
  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (state: FormattedReferenceItem[], action: OptimisticAction) => {
      switch (action.type) {
        case "ADD":
          return [action.payload, ...state];
        case "UPDATE":
          return state.map((item) =>
            item.id === action.payload.id
              ? { ...item, title: action.payload.title, slug: action.payload.slug }
              : item
          );
        case "DELETE":
          return state.filter((item) => item.id !== action.payload);
        case "TOGGLE":
          return state.map((item) =>
            item.id === action.payload.id
              ? { ...item, isActive: action.payload.nextStatus }
              : item
          );
        default:
          return state;
      }
    }
  );

  // استیت‌های مودال و فرم
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormattedReferenceItem | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ایجاد اسلاگ خودکار با تایپ عنوان
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF\-]/g, "");
    setSlug(generatedSlug);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: FormattedReferenceItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setErrorMessage("");
  };

  // ارسال فرم (افزودن و ویرایش) به شکل Optimistic
  const handleFormAction = async (formData: FormData) => {
    setErrorMessage("");
    setIsSubmitting(true);

    const formTitle = (formData.get("title") as string || "").trim();
    const formSlug = (formData.get("slug") as string || "").trim();

    startTransition(async () => {
      try {
        if (editingItem) {
          // ۱. آپدیت آنی و بدون وقفه در UI
          setOptimisticData({
            type: "UPDATE",
            payload: { id: editingItem.id, title: formTitle, slug: formSlug },
          });

          formData.append("id", editingItem.id);
          const result = await updateQuestionReferenceAction(formData);
          if (result.success) {
            handleCloseModal();
          } else {
            setErrorMessage(result.message || "خطا در ویرایش اطلاعات.");
          }
        } else {
          // ۱. درج آنی در صدر جدول در UI
          const tempItem: FormattedReferenceItem = {
            id: `temp-${Date.now()}`,
            title: formTitle,
            slug: formSlug,
            isActive: true,
            questionCount: 0,
            createdAt: new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date()),
          };

          setOptimisticData({ type: "ADD", payload: tempItem });

          const result = await createQuestionReferenceAction(formData);
          if (result.success) {
            handleCloseModal();
          } else {
            setErrorMessage(result.message || "خطا در ایجاد رفرنس.");
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // تغییر وضعیت (فعال/غیرفعال) خوش‌بینانه
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    startTransition(async () => {
      setOptimisticData({ type: "TOGGLE", payload: { id, nextStatus } });
      await toggleQuestionReferenceStatusAction(id, nextStatus);
    });
  };

  // حذف رکورد به صورت خوش‌بینانه
  const handleDelete = (id: string, itemTitle: string) => {
    if (confirm(`آیا از حذف رفرنس "${itemTitle}" اطمینان دارید؟`)) {
      startTransition(async () => {
        setOptimisticData({ type: "DELETE", payload: id });
        const res = await deleteQuestionReferenceAction(id);
        if (!res.success) {
          alert(res.message);
        }
      });
    }
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 min-h-screen text-slate-800" dir="rtl">
      {/* نوار استریمینگ باریک بالای صفحه در زمان تبادل اطلاعات سرور */}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-100 overflow-hidden z-50">
          <div className="h-full bg-blue-600 animate-[pulse_1s_infinite] w-full" />
        </div>
      )}

      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              مدیریت رفرنس‌های سوالات
            </h1>
            {isPending && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <svg className="animate-spin h-3 w-3 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                در حال استریم تغییرات
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تنظیم منابع و آزمون‌ها برای انتساب سریع به سوالات
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          افزودن رفرنس جدید
        </button>
      </div>

      {/* جدول نمایش لیست رفرنس‌ها */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 text-xs sm:text-sm font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4">ردیف</th>
                <th className="py-3.5 px-4">عنوان رفرنس</th>
                <th className="py-3.5 px-4">اسلاگ (Slug)</th>
                <th className="py-3.5 px-4 text-center">تعداد سوالات</th>
                <th className="py-3.5 px-4 text-center">وضعیت</th>
                <th className="py-3.5 px-4 text-center">تاریخ ایجاد</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {optimisticData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    هیچ رفرنسی یافت نشد. برای شروع رفرنس جدیدی ثبت نمایید.
                  </td>
                </tr>
              ) : (
                optimisticData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.title}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs" dir="ltr">
                      {item.slug}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-xs border border-slate-200 font-medium">
                        {item.questionCount ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.isActive)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          item.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                      >
                        {item.isActive ? "فعال" : "غیرفعال"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs">
                      {item.createdAt}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md font-medium cursor-pointer"
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-md font-medium cursor-pointer"
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

      {/* مدال سریع بدون ترنزیشن */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            {/* هدر مدال */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-slate-800">
                {editingItem ? "ویرایش رفرنس" : "افزودن رفرنس جدید"}
              </h2>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* فرم با ارسال خوش‌بینانه */}
            <form action={handleFormAction} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                  عنوان رفرنس سوالات
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="مثال: بانک مهر 1403"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                  اسلاگ (شناسه یکتا)
                </label>
                <input
                  name="slug"
                  type="text"
                  required
                  dir="ltr"
                  disabled={isSubmitting}
                  placeholder="bank-mehr-1403"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-left disabled:bg-slate-100"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  با تایپ عنوان به صورت خودکار با خط تیره (-) تکمیل شده و دستی قابل ویرایش است.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>در حال ذخیره...</span>
                    </>
                  ) : editingItem ? (
                    "ثبت تغییرات"
                  ) : (
                    "افزودن رفرنس"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}