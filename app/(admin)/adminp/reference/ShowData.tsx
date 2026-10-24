"use client";

import React, {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

  useTransition,

} from "react";

import { flushSync } from "react-dom";

import { useRouter } from "next/navigation";

import {

  createQuestionReferenceAction,

  deleteQuestionReferenceAction,

  toggleQuestionReferenceStatusAction,

  updateQuestionReferenceAction,

} from "@/actions/admin/reference_question/Actions";

// ============================================

// Types

// ============================================

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

  initialError?: string | null;

}

type ToastType = "success" | "error";

type StatusFilter = "all" | "active" | "inactive";

interface ToastData {

  id: number;

  message: string;

  type: ToastType;

}

// ============================================

// Utilities

// ============================================

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {

  dateStyle: "medium",

});

const numberFormatter = new Intl.NumberFormat("fa-IR");

function normalizeSlug(value: string): string {

  return value

    .normalize("NFC")

    .toLowerCase()

    .trim()

    .replace(/\s+/g, "-")

    .replace(/[^\w\u0600-\u06FF-]/g, "")

    .replace(/-+/g, "-")

    .replace(/^-+|-+$/g, "");

}

function formatNumber(value: number): string {

  return numberFormatter.format(value);

}

// ============================================

// Icons

// ============================================

type IconName =

  | "plus"

  | "search"

  | "close"

  | "edit"

  | "trash"

  | "check"

  | "warning"

  | "refresh"

  | "folder"

  | "filter";

function Icon({

  name,

  className = "h-4 w-4",

}: {

  name: IconName;

  className?: string;

}) {

  const paths: Record<IconName, React.ReactNode> = {

    plus: <path d="M12 5v14M5 12h14" />,

    search: (

      <>

        <circle cx="11" cy="11" r="7" />

        <path d="m20 20-4-4" />

      </>

    ),

    close: <path d="M18 6 6 18M6 6l12 12" />,

    edit: (

      <path d="m16 5 3 3M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z" />

    ),

    trash: (

      <>

        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />

      </>

    ),

    check: <path d="m5 12 4 4L19 6" />,

    warning: (

      <>

        <path d="m12 3 10 18H2L12 3Z" />

        <path d="M12 9v4M12 17h.01" />

      </>

    ),

    refresh: (

      <>

        <path d="M20 7v5h-5M4 17v-5h5" />

        <path d="M5.5 9A7 7 0 0 1 18 7l2 5M4 12l2 5a7 7 0 0 0 12.5-2" />

      </>

    ),

    folder: (

      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3V7Z" />

    ),

    filter: <path d="M4 7h16M7 12h10M10 17h4" />,

  };

  return (

    <svg

      aria-hidden="true"

      className={className}

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="1.8"

      strokeLinecap="round"

      strokeLinejoin="round"

    >

      {paths[name]}

    </svg>

  );

}

function Spinner({

  className = "h-4 w-4",

}: {

  className?: string;

}) {

  return (

    <svg

      aria-hidden="true"

      className={`${className} animate-spin`}

      viewBox="0 0 24 24"

      fill="none"

    >

      <circle

        className="opacity-25"

        cx="12"

        cy="12"

        r="10"

        stroke="currentColor"

        strokeWidth="4"

      />

      <path

        className="opacity-80"

        fill="currentColor"

        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"

      />

    </svg>

  );

}

// ============================================

// Main Component

// ============================================

export default function ReferencePage({

  initialData,

  initialError = null,

}: ShowDataProps) {

  const router = useRouter();

  // ==========================================

  // States

  // ==========================================

  const [isRefreshing, startRefresh] = useTransition();

  const [references, setReferences] =

    useState<FormattedReferenceItem[]>(initialData);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =

    useState<StatusFilter>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingItem, setEditingItem] =

    useState<FormattedReferenceItem | null>(null);

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  const [slugEdited, setSlugEdited] = useState(false);

  const [formError, setFormError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [busyIds, setBusyIds] = useState<string[]>([]);

  const [deletingItem, setDeletingItem] =

    useState<FormattedReferenceItem | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);

  // ==========================================

  // Refs

  // ==========================================

  const toastTimerRef = useRef<

    ReturnType<typeof setTimeout> | null

  >(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const addButtonRef = useRef<HTMLButtonElement>(null);

  const editTriggerRef = useRef<

    HTMLButtonElement | null

  >(null);

  const deleteCancelRef = useRef<HTMLButtonElement>(null);

  const activeRequestsRef = useRef<Set<string>>(new Set());

  // ==========================================

  // Sync Server Data

  // ==========================================

  useEffect(() => {

    setReferences(initialData);

  }, [initialData]);

  // ==========================================

  // Toast

  // ==========================================

  const showToast = useCallback(

    (

      message: string,

      type: ToastType = "success"

    ) => {

      if (toastTimerRef.current) {

        clearTimeout(toastTimerRef.current);

      }

      setToast({

        id: Date.now(),

        message,

        type,

      });

      toastTimerRef.current = setTimeout(() => {

        setToast(null);

        toastTimerRef.current = null;

      }, 4000);

    },

    []

  );

  useEffect(() => {

    return () => {

      if (toastTimerRef.current) {

        clearTimeout(toastTimerRef.current);

      }

    };

  }, []);

  // ==========================================

  // Statistics

  // ==========================================

  const stats = useMemo(() => {

    const active = references.filter(

      (item) => item.isActive

    ).length;

    return {

      total: references.length,

      active,

      inactive: references.length - active,

    };

  }, [references]);

  // ==========================================

  // Filters

  // ==========================================

  const filteredReferences = useMemo(() => {

    const query = search.trim().toLocaleLowerCase();

    return references.filter((item) => {

      const matchesSearch =

        !query ||

        item.title.toLocaleLowerCase().includes(query) ||

        item.slug.toLocaleLowerCase().includes(query);

      const matchesStatus =

        statusFilter === "all" ||

        (statusFilter === "active" && item.isActive) ||

        (statusFilter === "inactive" && !item.isActive);

      return matchesSearch && matchesStatus;

    });

  }, [references, search, statusFilter]);

  // ==========================================

  // Form State

  // ==========================================

  const resetForm = () => {

    setEditingItem(null);

    setTitle("");

    setSlug("");

    setSlugEdited(false);

    setFormError("");

  };

  const openAddModal = () => {

    if (isSaving) return;

    editTriggerRef.current = null;

    resetForm();

    setIsModalOpen(true);

  };

  const openEditModal = (

    item: FormattedReferenceItem,

    trigger: HTMLButtonElement

  ) => {

    if (isSaving) return;

    editTriggerRef.current = trigger;

    setEditingItem(item);

    setTitle(item.title);

    setSlug(item.slug);

    setSlugEdited(false);

    setFormError("");

    setIsModalOpen(true);

  };

  const closeModal = () => {

    if (isSaving) return;

    setIsModalOpen(false);

    resetForm();

  };

  // ==========================================

  // Modal Accessibility

  // ==========================================

  useEffect(() => {

    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape" && !isSaving) {

        setIsModalOpen(false);

      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener(

        "keydown",

        handleKeyDown

      );

      requestAnimationFrame(() => {

        if (editTriggerRef.current?.isConnected) {

          editTriggerRef.current.focus();

        } else {

          addButtonRef.current?.focus();

        }

      });

    };

  }, [isModalOpen, isSaving]);

  // ==========================================

  // Delete Dialog Accessibility

  // ==========================================

  useEffect(() => {

    if (!deletingItem) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    deleteCancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape") {

        setDeletingItem(null);

      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener(

        "keydown",

        handleKeyDown

      );

    };

  }, [deletingItem]);

  // ==========================================

  // Form Fields

  // ==========================================

  const handleTitleChange = (

    event: React.ChangeEvent<HTMLInputElement>

  ) => {

    const value = event.target.value;

    setTitle(value);

    setFormError("");

    if (!slugEdited) {

      setSlug(normalizeSlug(value));

    }

  };

  const handleSlugChange = (

    event: React.ChangeEvent<HTMLInputElement>

  ) => {

    setSlug(event.target.value);

    setSlugEdited(true);

    setFormError("");

  };

  // ==========================================

  // Refresh

  // ==========================================

  const refreshData = () => {

    startRefresh(() => {

      router.refresh();

    });

  };

  // ==========================================

  // Create / Update

  // ==========================================

  const handleSubmit = async (

    event: React.FormEvent<HTMLFormElement>

  ) => {

    event.preventDefault();

    if (isSaving) return;

    const normalizedTitle = title.trim();

    const normalizedSlug = normalizeSlug(slug);

    if (!normalizedTitle || !normalizedSlug) {

      setFormError(

        "لطفاً عنوان و اسلاگ را به‌درستی وارد کنید."

      );

      return;

    }

    if (

      normalizedTitle.length > 200 ||

      normalizedSlug.length > 200

    ) {

      setFormError(

        "عنوان و اسلاگ نباید بیش از ۲۰۰ کاراکتر باشند."

      );

      return;

    }

    if (

      editingItem &&

      normalizedTitle === editingItem.title &&

      normalizedSlug === editingItem.slug

    ) {

      closeModal();

      return;

    }

    const currentEditing = editingItem;

    const formData = new FormData();

    formData.set("title", normalizedTitle);

    formData.set("slug", normalizedSlug);

    if (currentEditing) {

      formData.set("id", currentEditing.id);

    }

    setIsSaving(true);

    setFormError("");

    try {

      const result = currentEditing

        ? await updateQuestionReferenceAction(formData)

        : await createQuestionReferenceAction(formData);

      if (!result.success || !result.reference) {

        setFormError(

          result.message || "ذخیره اطلاعات انجام نشد."

        );

        return;

      }

      const saved = result.reference;

      const savedItem: FormattedReferenceItem = {

        id: saved.id,

        title: saved.title,

        slug: saved.slug,

        isActive: saved.isActive,

        questionCount: currentEditing?.questionCount ?? 0,

        createdAt: dateFormatter.format(

          new Date(saved.createdAt)

        ),

      };

      // ابتدا بستن قطعی مدال

      flushSync(() => {

        setIsModalOpen(false);

        setEditingItem(null);

        setIsSaving(false);

        setFormError("");

      });

      // سپس آپدیت جدول

      setReferences((previous) => {

        if (currentEditing) {

          return previous.map((item) =>

            item.id === savedItem.id

              ? savedItem

              : item

          );

        }

        if (

          previous.some(

            (item) => item.id === savedItem.id

          )

        ) {

          return previous;

        }

        return [savedItem, ...previous];

      });

      showToast(result.message, "success");

      refreshData();

    } catch (error) {

      console.error("Reference save error:", error);

      setFormError(

        "ارتباط با سرور برقرار نشد. مجدداً تلاش کنید."

      );

    } finally {

      setIsSaving(false);

    }

  };

  // ==========================================

  // Row Busy Helpers

  // ==========================================

  const setRowBusy = (id: string, busy: boolean) => {

    if (busy) {

      activeRequestsRef.current.add(id);

    } else {

      activeRequestsRef.current.delete(id);

    }

    setBusyIds(

      Array.from(activeRequestsRef.current)

    );

  };

  // ==========================================

  // Toggle Status

  // ==========================================

  const handleToggleStatus = async (

    item: FormattedReferenceItem

  ) => {

    if (activeRequestsRef.current.has(item.id)) {

      return;

    }

    const nextStatus = !item.isActive;

    setRowBusy(item.id, true);

    try {

      const result =

        await toggleQuestionReferenceStatusAction(

          item.id,

          nextStatus

        );

      if (!result.success) {

        showToast(

          result.message || "تغییر وضعیت انجام نشد.",

          "error"

        );

        return;

      }

      setReferences((previous) =>

        previous.map((reference) =>

          reference.id === item.id

            ? {

                ...reference,

                isActive: nextStatus,

              }

            : reference

        )

      );

      showToast(result.message);

      refreshData();

    } catch (error) {

      console.error("Status change error:", error);

      showToast("خطا در ارتباط با سرور.", "error");

    } finally {

      setRowBusy(item.id, false);

    }

  };

  // ==========================================

  // Delete

  // ==========================================

  const handleDelete = async () => {

    const item = deletingItem;

    if (!item) return;

    if (activeRequestsRef.current.has(item.id)) {

      return;

    }

    setRowBusy(item.id, true);

    try {

      const result =

        await deleteQuestionReferenceAction(item.id);

      if (!result.success) {

        showToast(

          result.message || "حذف رفرنس انجام نشد.",

          "error"

        );

        setDeletingItem(null);

        return;

      }

      setDeletingItem(null);

      setReferences((previous) =>

        previous.filter(

          (reference) => reference.id !== item.id

        )

      );

      showToast(result.message);

      refreshData();

    } catch (error) {

      console.error("Reference deletion error:", error);

      showToast(

        "خطا در حذف رفرنس. مجدداً تلاش کنید.",

        "error"

      );

      setDeletingItem(null);

    } finally {

      setRowBusy(item.id, false);

    }

  };

  // ==========================================

  // Render

  // ==========================================

  return (

    <div

      dir="rtl"

      className="relative mx-auto min-h-screen max-w-[1600px] p-3 text-slate-800 sm:p-4 lg:p-6"

    >

      {/* Loading Indicator */}

      {isRefreshing && (

        <div

          role="status"

          aria-label="در حال به‌روزرسانی اطلاعات"

          className="fixed inset-x-0 top-0 z-[80] h-1 overflow-hidden bg-blue-100"

        >

          <div className="h-full w-full animate-pulse bg-blue-600" />

        </div>

      )}

      {/* Toast */}

      {toast && (

        <div

          key={toast.id}

          role={toast.type === "error" ? "alert" : "status"}

          aria-live={

            toast.type === "error"

              ? "assertive"

              : "polite"

          }

          className={`fixed bottom-4 left-4 right-4 z-[100] flex items-start gap-2.5 rounded-xl border px-3 py-2.5 shadow-xl sm:right-auto sm:max-w-md ${

            toast.type === "success"

              ? "border-emerald-200 bg-white text-emerald-800"

              : "border-rose-200 bg-white text-rose-800"

          }`}

        >

          <div

            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${

              toast.type === "success"

                ? "bg-emerald-100"

                : "bg-rose-100"

            }`}

          >

            <Icon

              name={

                toast.type === "success"

                  ? "check"

                  : "warning"

              }

              className="h-3.5 w-3.5"

            />

          </div>

          <p className="flex-1 pt-0.5 text-xs font-medium leading-5">

            {toast.message}

          </p>

          <button

            type="button"

            onClick={() => setToast(null)}

            aria-label="بستن اعلان"

            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-500"

          >

            <Icon name="close" />

          </button>

        </div>

      )}

      {/* ====================================== */}

      {/* Header */}

      {/* ====================================== */}

      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">

            <Icon

              name="folder"

              className="h-5 w-5"

            />

          </div>

          <div>

            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">

              مدیریت رفرنس‌های سوالات

            </h1>

            <p className="mt-0.5 text-[11px] leading-5 text-slate-500">

              افزودن، ویرایش و مدیریت منابع سوالات آزمون‌ها

            </p>

          </div>

        </div>

        <button

          ref={addButtonRef}

          type="button"

          onClick={openAddModal}

          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"

        >

          <Icon

            name="plus"

            className="h-4 w-4"

          />

          افزودن رفرنس جدید

        </button>

      </header>

      {/* ====================================== */}

      {/* Server Error */}

      {/* ====================================== */}

      {initialError && (

        <div

          role="alert"

          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3"

        >

          <div className="flex items-center gap-2 text-xs text-rose-700">

            <Icon name="warning" />

            {initialError}

          </div>

          <button

            type="button"

            onClick={refreshData}

            disabled={isRefreshing}

            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60"

          >

            <Icon name="refresh" />

            تلاش مجدد

          </button>

        </div>

      )}

      {/* ====================================== */}

      {/* Statistics */}

      {/* ====================================== */}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

        {/* Total */}

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">

          <p className="text-xs font-medium text-slate-500">

            مجموع رفرنس‌های بارگذاری‌شده

          </p>

          <div className="mt-2 flex items-end justify-between">

            <span className="text-2xl font-bold text-slate-900">

              {formatNumber(stats.total)}

            </span>

            <span className="rounded-lg bg-slate-100 p-1.5 text-slate-500">

              <Icon

                name="folder"

                className="h-4 w-4"

              />

            </span>

          </div>

        </div>

        {/* Active */}

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">

          <p className="text-xs font-medium text-slate-500">

            رفرنس‌های فعال

          </p>

          <div className="mt-2 flex items-end justify-between">

            <span className="text-2xl font-bold text-emerald-700">

              {formatNumber(stats.active)}

            </span>

            <span className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">

              <Icon

                name="check"

                className="h-4 w-4"

              />

            </span>

          </div>

        </div>

        {/* Inactive */}

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">

          <p className="text-xs font-medium text-slate-500">

            رفرنس‌های غیرفعال

          </p>

          <div className="mt-2 flex items-end justify-between">

            <span className="text-2xl font-bold text-rose-700">

              {formatNumber(stats.inactive)}

            </span>

            <span className="rounded-lg bg-rose-50 p-1.5 text-rose-600">

              <Icon

                name="warning"

                className="h-4 w-4"

              />

            </span>

          </div>

        </div>

      </div>

      {/* ====================================== */}

      {/* Table Section */}

      {/* ====================================== */}

      <section

        aria-label="فهرست رفرنس‌های سوالات"

        className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"

      >

        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">

          <div className="relative w-full sm:max-w-sm">

            <Icon

              name="search"

              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"

            />

            <input

              type="search"

              value={search}

              onChange={(event) =>

                setSearch(event.target.value)

              }

              placeholder="جست‌وجوی عنوان یا اسلاگ..."

              aria-label="جست‌وجوی رفرنس‌ها"

              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-9 pl-3 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"

            />

          </div>

          <div className="flex flex-wrap items-center gap-2.5">

            <div className="relative">

              <Icon

                name="filter"

                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"

              />

              <select

                aria-label="فیلتر وضعیت"

                value={statusFilter}

                onChange={(event) =>

                  setStatusFilter(

                    event.target.value as StatusFilter

                  )

                }

                className="h-9 min-w-32 appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-4 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

              >

                <option value="all">همه وضعیت‌ها</option>

                <option value="active">فقط فعال</option>

                <option value="inactive">فقط غیرفعال</option>

              </select>

            </div>

            <span className="text-[11px] text-slate-500">

              {formatNumber(filteredReferences.length)} مورد

            </span>

          </div>

        </div>

        {/* ==================================== */}

        {/* Table */}

        {/* ==================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] border-collapse text-right">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">

                <th scope="col" className="px-3.5 py-3">

                  ردیف

                </th>

                <th scope="col" className="px-3.5 py-3">

                  عنوان رفرنس

                </th>

                <th scope="col" className="px-3.5 py-3">

                  اسلاگ

                </th>

                <th

                  scope="col"

                  className="px-3.5 py-3 text-center"

                >

                  تعداد سوالات

                </th>

                <th

                  scope="col"

                  className="px-3.5 py-3 text-center"

                >

                  وضعیت

                </th>

                <th

                  scope="col"

                  className="px-3.5 py-3 text-center"

                >

                  تاریخ ایجاد

                </th>

                <th

                  scope="col"

                  className="px-3.5 py-3 text-center"

                >

                  عملیات

                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredReferences.length === 0 ? (

                <tr>

                  <td colSpan={7}>

                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">

                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                        <Icon

                          name="search"

                          className="h-5 w-5"

                        />

                      </div>

                      <h3 className="text-xs font-semibold text-slate-800">

                        {search || statusFilter !== "all"

                          ? "نتیجه‌ای پیدا نشد"

                          : "هنوز رفرنسی ثبت نشده است"}

                      </h3>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">

                        {search || statusFilter !== "all"

                          ? "عبارت جست‌وجو یا فیلتر انتخاب‌شده را تغییر دهید."

                          : "برای شروع، اولین رفرنس سوالات خود را ایجاد کنید."}

                      </p>

                      {(search || statusFilter !== "all") && (

                        <button

                          type="button"

                          onClick={() => {

                            setSearch("");

                            setStatusFilter("all");

                          }}

                          className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"

                        >

                          پاک‌کردن فیلترها

                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ) : (

                filteredReferences.map((item, index) => {

                  const rowBusy = busyIds.includes(item.id);

                  return (

                    <tr

                      key={item.id}

                      className="group transition-colors hover:bg-slate-50/80"

                    >

                      {/* Row Number */}

                      <td className="px-3.5 py-2.5 text-xs text-slate-400">

                        {formatNumber(index + 1)}

                      </td>

                      {/* Title */}

                      <td className="px-3.5 py-2.5">

                        <span className="block max-w-xs break-words text-xs font-semibold text-slate-800">

                          {item.title}

                        </span>

                      </td>

                      {/* Slug */}

                      <td className="px-3.5 py-2.5">

                        <code

                          dir="ltr"

                          className="inline-block max-w-xs break-all rounded-md bg-slate-100 px-2 py-1 text-left text-[11px] text-slate-600"

                        >

                          {item.slug}

                        </code>

                      </td>

                      {/* Question Count */}

                      <td className="px-3.5 py-2.5 text-center">

                        <span className="inline-flex min-w-8 justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">

                          {formatNumber(item.questionCount ?? 0)}

                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-3.5 py-2.5 text-center">

                        <button

                          type="button"

                          disabled={rowBusy}

                          onClick={() =>

                            handleToggleStatus(item)

                          }

                          aria-label={`تغییر وضعیت رفرنس ${item.title}`}

                          aria-pressed={item.isActive}

                          title="برای تغییر وضعیت کلیک کنید"

                          className={`inline-flex min-w-20 items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-60 ${

                            item.isActive

                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"

                              : "bg-rose-50 text-rose-700 hover:bg-rose-100"

                          }`}

                        >

                          {rowBusy ? (

                            <Spinner className="h-3 w-3" />

                          ) : (

                            <span

                              className={`h-1.5 w-1.5 rounded-full ${

                                item.isActive

                                  ? "bg-emerald-500"

                                  : "bg-rose-500"

                              }`}

                            />

                          )}

                          {item.isActive ? "فعال" : "غیرفعال"}

                        </button>

                      </td>

                      {/* Created Date */}

                      <td className="whitespace-nowrap px-3.5 py-2.5 text-center text-[11px] text-slate-500">

                        {item.createdAt}

                      </td>

                      {/* Actions */}

                      <td className="px-3.5 py-2.5">

                        <div className="flex items-center justify-center gap-1.5">

                          <button

                            type="button"

                            disabled={rowBusy}

                            onClick={(event) =>

                              openEditModal(

                                item,

                                event.currentTarget

                              )

                            }

                            className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-50"

                          >

                            <Icon

                              name="edit"

                              className="h-3.5 w-3.5"

                            />

                            ویرایش

                          </button>

                          <button

                            type="button"

                            disabled={rowBusy}

                            onClick={() =>

                              setDeletingItem(item)

                            }

                            className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 transition-colors hover:border-rose-200 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-500 disabled:opacity-50"

                          >

                            <Icon

                              name="trash"

                              className="h-3.5 w-3.5"

                            />

                            حذف

                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================== */}

        {/* Table Footer */}

        {/* ==================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3">

          <p className="text-[11px] text-slate-500">

            نمایش {formatNumber(filteredReferences.length)} رفرنس

          </p>

          <button

            type="button"

            disabled={isRefreshing}

            onClick={refreshData}

            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 disabled:opacity-50"

          >

            {isRefreshing ? (

              <Spinner className="h-3.5 w-3.5" />

            ) : (

              <Icon

                name="refresh"

                className="h-3.5 w-3.5"

              />

            )}

            به‌روزرسانی اطلاعات

          </button>

        </div>

      </section>

      {/* ====================================== */}

      {/* Create / Edit Modal */}

      {/* ====================================== */}

      {isModalOpen && (

        <div

          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-[2px]"

          onMouseDown={(event) => {

            if (

              event.target === event.currentTarget &&

              !isSaving

            ) {

              closeModal();

            }

          }}

        >

          <div

            role="dialog"

            aria-modal="true"

            aria-labelledby="reference-modal-title"

            aria-describedby="reference-modal-description"

            className="my-auto w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"

          >

            {/* Modal Header */}

            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">

              <div>

                <h2

                  id="reference-modal-title"

                  className="text-base font-bold text-slate-900"

                >

                  {editingItem

                    ? "ویرایش رفرنس"

                    : "افزودن رفرنس جدید"}

                </h2>

                <p

                  id="reference-modal-description"

                  className="mt-1 text-xs leading-5 text-slate-500"

                >

                  {editingItem

                    ? "اطلاعات رفرنس انتخاب‌شده را ویرایش کنید."

                    : "اطلاعات رفرنس جدید را وارد کنید."}

                </p>

              </div>

              <button

                type="button"

                onClick={closeModal}

                disabled={isSaving}

                aria-label="بستن پنجره"

                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-40"

              >

                <Icon

                  name="close"

                  className="h-4 w-4"

                />

              </button>

            </div>

            {/* Form */}

            <form

              onSubmit={handleSubmit}

              className="space-y-4 px-4 py-4 sm:px-5"

            >

              {/* Form Error */}

              {formError && (

                <div

                  role="alert"

                  className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700"

                >

                  <Icon

                    name="warning"

                    className="mt-0.5 h-4 w-4 shrink-0"

                  />

                  <span>{formError}</span>

                </div>

              )}

              {/* Title */}

              <div>

                <label

                  htmlFor="reference-title"

                  className="mb-1.5 block text-xs font-semibold text-slate-700"

                >

                  عنوان رفرنس

                  <span className="mr-1 text-rose-500">*</span>

                </label>

                <input

                  ref={titleInputRef}

                  id="reference-title"

                  name="title"

                  type="text"

                  required

                  maxLength={200}

                  autoComplete="off"

                  disabled={isSaving}

                  placeholder="مثال: بانک سوالات استخدامی ۱۴۰۵"

                  value={title}

                  onChange={handleTitleChange}

                  aria-invalid={!!formError}

                  className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"

                />

                <p className="mt-1.5 text-[11px] leading-5 text-slate-400">

                  عنوانی واضح و قابل‌شناسایی انتخاب کنید.

                </p>

              </div>

              {/* Slug */}

              <div>

                <div className="mb-1.5 flex items-center justify-between gap-2">

                  <label

                    htmlFor="reference-slug"

                    className="block text-xs font-semibold text-slate-700"

                  >

                    اسلاگ (شناسه یکتا)

                    <span className="mr-1 text-rose-500">*</span>

                  </label>

                  <span className="text-[10px] text-slate-400">

                    قابل ویرایش

                  </span>

                </div>

                <input

                  id="reference-slug"

                  name="slug"

                  type="text"

                  required

                  maxLength={200}

                  autoComplete="off"

                  spellCheck={false}

                  dir="ltr"

                  disabled={isSaving}

                  placeholder="employment-questions-1405"

                  value={slug}

                  onChange={handleSlugChange}

                  className="h-9 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-left font-mono text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60"

                />

                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">

                  <p className="text-[11px] leading-5 text-slate-400">

                    اسلاگ از عنوان ساخته می‌شود و می‌توانید آن را تغییر دهید.

                  </p>

                  {!editingItem && slugEdited && (

                    <button

                      type="button"

                      disabled={isSaving}

                      onClick={() => {

                        setSlug(normalizeSlug(title));

                        setSlugEdited(false);

                      }}

                      className="text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"

                    >

                      ساخت مجدد

                    </button>

                  )}

                </div>

              </div>

              {/* Form Footer */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">

                <button

                  type="button"

                  onClick={closeModal}

                  disabled={isSaving}

                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"

                >

                  انصراف

                </button>

                <button

                  type="submit"

                  disabled={

                    isSaving ||

                    !title.trim() ||

                    !normalizeSlug(slug)

                  }

                  className="inline-flex h-9 min-w-32 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"

                >

                  {isSaving ? (

                    <>

                      <Spinner className="h-3.5 w-3.5" />

                      در حال ذخیره...

                    </>

                  ) : (

                    <>

                      <Icon

                        name="check"

                        className="h-3.5 w-3.5"

                      />

                      {editingItem

                        ? "ذخیره تغییرات"

                        : "ثبت رفرنس"}

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ====================================== */}

      {/* Delete Confirmation Modal */}

      {/* ====================================== */}

      {deletingItem && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[2px]">

          <div

            role="alertdialog"

            aria-modal="true"

            aria-labelledby="delete-modal-title"

            aria-describedby="delete-modal-description"

            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"

          >

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">

              <Icon

                name="trash"

                className="h-5 w-5"

              />

            </div>

            <h2

              id="delete-modal-title"

              className="text-base font-bold text-slate-900"

            >

              حذف رفرنس

            </h2>

            <p

              id="delete-modal-description"

              className="mt-2 text-xs leading-6 text-slate-600"

            >

              آیا از حذف رفرنس{" "}

              <span className="font-bold text-slate-900">

                «{deletingItem.title}»

              </span>{" "}

              اطمینان دارید؟

              <span className="mt-1.5 block text-[11px] text-rose-600">

                این عملیات قابل بازگشت نیست.

              </span>

            </p>

            {(deletingItem.questionCount ?? 0) > 0 && (

              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">

                این رفرنس دارای سؤال است و تا زمانی که ارتباط سوالات بررسی نشود، قابل حذف نیست.

              </div>

            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button

                ref={deleteCancelRef}

                type="button"

                onClick={() => setDeletingItem(null)}

                className="h-9 rounded-lg border border-slate-300 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-500"

              >

                انصراف

              </button>

              <button

                type="button"

                onClick={handleDelete}

                disabled={

                  (deletingItem.questionCount ?? 0) > 0 ||

                  busyIds.includes(deletingItem.id)

                }

                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-50"

              >

                {busyIds.includes(deletingItem.id) && (

                  <Spinner className="h-3.5 w-3.5" />

                )}

                حذف رفرنس

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
