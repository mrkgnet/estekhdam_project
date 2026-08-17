"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Ticket,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Inbox,
  Loader2,
  Sparkles,
  XCircle,
  Hash,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { deleteTicketUserAction } from "@/actions/user/dashboard/support/fetch/Actions";

// ============================
// 🎨 رنگ‌بندی وضعیت‌ها
// ============================
const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-blue-400 bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-800 whitespace-nowrap">
          <Inbox className="h-3.5 w-3.5" />
          باز
        </span>
      );
    case "ANSWERED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-emerald-500 bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800 whitespace-nowrap">
          <CheckCircle2 className="h-3.5 w-3.5" />
          پاسخ داده شده
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-amber-500 bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800 whitespace-nowrap">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          در حال بررسی
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-slate-500 bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 whitespace-nowrap">
          <XCircle className="h-3.5 w-3.5" />
          بسته شده
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md border-2 border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 whitespace-nowrap">
          {status}
        </span>
      );
  }
};

// ============================
// 🎨 رنگ‌بندی اولویت‌ها
// ============================
const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border-2 border-rose-500 bg-rose-100 px-2.5 py-1 text-[11px] font-medium text-rose-800 whitespace-nowrap">
          <AlertCircle className="h-3.5 w-3.5" />
          اولویت بالا
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border-2 border-yellow-500 bg-yellow-100 px-2.5 py-1 text-[11px] font-medium text-yellow-800 whitespace-nowrap">
          اولویت متوسط
        </span>
      );
    case "LOW":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border-2 border-teal-500 bg-teal-100 px-2.5 py-1 text-[11px] font-medium text-teal-800 whitespace-nowrap">
          اولویت پایین
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{priority}</span>;
  }
};

export default function TicketsListPage({ response }: { response: any }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<{ id: string; subject: string } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tickets = response?.tickets || [];
  const isSuccess = Boolean(response?.success);
  const pagination = response?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  };

  const { currentPage, totalPages, totalCount } = pagination;

  // تغییر صفحه با useTransition
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages || isPending) return;

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // تایید و اجرای حذف تیکت
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    const targetId = ticketToDelete.id;
    setDeletingId(targetId);
    setActionError(null);

    try {
      const res = await deleteTicketUserAction(targetId);
      if (!res.success) {
        setActionError(res.message);
      } else {
        // بستن مودال
        setTicketToDelete(null);

        // اگر تنها آیتم این صفحه بود و صفحه بزرگتر از ۱ بود، به صفحه قبل برویم
        startTransition(() => {
          if (tickets.length === 1 && currentPage > 1) {
            const params = new URLSearchParams(searchParams?.toString() || "");
            params.set("page", (currentPage - 1).toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          } else {
            router.refresh();
          }
        });
      }
    } catch (err) {
      setActionError("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-7 md:px-6 md:py-4">
      {/* 🟢 دکمه بازگشت */}
      <div className="flex mb-3.5 justify-end">
        <BackButton className="w-full sm:w-auto" />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-lg border-2 border-slate-300 bg-gradient-to-br from-white via-white to-blue-50/60 p-4 md:p-5 shadow-sm">
        <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-blue-100/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-100/40 blur-2xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-300/40 shrink-0">
              <Ticket className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-medium text-slate-800">
                تیکت‌های پشتیبانی
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                لیست درخواست‌ها و گفتگوهای شما با تیم پشتیبانی
              </p>
            </div>
          </div>

          <Link
            href="/ddashboard/support/tickets/new"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 w-full sm:w-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>ثبت تیکت جدید</span>
          </Link>
        </div>
      </div>

      {/* Error های سرور یا عملیات */}
      {(!isSuccess || actionError) && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">
            {actionError || response?.message || "خطایی رخ داده است"}
          </span>
        </div>
      )}

      {/* Tickets Box */}
      <section className="relative mt-4 overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-sm">
        {/* Top strip */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-blue-600" />
            لیست تیکت‌ها
          </div>
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                در حال به‌روزرسانی...
              </span>
            )}
            <span className="rounded-md border-2 border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {totalCount} مورد
            </span>
          </div>
        </div>

        {tickets.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-4 py-12 md:px-6 md:py-16 text-center">
            <div className="mb-4 grid h-14 w-14 md:h-16 md:w-16 place-items-center rounded-lg border-4 border-white bg-slate-50 text-slate-400 shadow-sm">
              <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-base font-medium text-slate-800">
              هنوز تیکتی ثبت نکرده‌اید
            </h3>
            <p className="mt-2 max-w-md text-sm font-normal leading-7 text-slate-500 px-2">
              اگر سوال یا مشکلی دارید، یک تیکت جدید ثبت کنید تا تیم پشتیبانی
              سریع‌تر راهنمایی‌تان کند.
            </p>
            <Link
              href="/ddashboard/support/tickets/new"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              ثبت اولین تیکت
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* لایه بلور هنگام تغییر صفحه */}
            {isPending && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1.5px] transition-all duration-200">
                <div className="flex items-center gap-2.5 rounded-lg border-2 border-blue-200 bg-white px-4 py-2 shadow-md">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">
                    در حال دریافت تیکت‌ها...
                  </span>
                </div>
              </div>
            )}

            {/* لیست تیکت‌ها */}
            <div
              className={`transition-opacity duration-200 ${
                isPending ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* 🟢 ۱. نمای کارت‌ها برای موبایل و تبلت */}
              <div className="lg:hidden p-3 sm:p-4 space-y-3">
                {tickets.map((ticket: any) => {
                  const ticketUrl = `/ddashboard/support/tickets/${ticket.id}`;
                  const isItemDeleting = deletingId === ticket.id;

                  return (
                    <div
                      key={ticket.id}
                      className="block rounded-lg border-2 border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all p-3.5 group relative"
                    >
                      {/* شناسه + تاریخ */}
                      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-100">
                        <span className="inline-flex items-center gap-1 rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          <Hash className="w-3 h-3" />
                          {String(ticket.id).slice(-6).toUpperCase()}
                        </span>
                        <span className="inline-flex items-center text-[11px] font-medium text-slate-500 gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Intl.DateTimeFormat("fa-IR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(ticket.createdAt))}
                        </span>
                      </div>

                      {/* عنوان */}
                      <Link href={ticketUrl}>
                        <h2 className="text-sm font-medium text-slate-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-relaxed">
                          {ticket.subject}
                        </h2>
                      </Link>

                      {/* وضعیت و اولویت */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {getStatusBadge(ticket.status)}
                        {getPriorityDisplay(ticket.priority)}
                      </div>

                      {/* دکمه‌های عملیات (مشاهده + حذف) */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                        <Link
                          href={ticketUrl}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-md border-2 border-blue-300 bg-blue-50 py-2 text-xs font-medium text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                        >
                          مشاهده جزئیات
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setTicketToDelete({
                              id: ticket.id,
                              subject: ticket.subject,
                            })
                          }
                          disabled={isItemDeleting}
                          title="حذف تیکت"
                          className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors disabled:opacity-50"
                        >
                          {isItemDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 🟢 ۲. نمای جدول برای دسکتاپ */}
              <div className="hidden lg:block w-full overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-right">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200 text-sm font-medium text-slate-500">
                      <th className="px-6 py-3 w-28">شناسه</th>
                      <th className="px-6 py-3">عنوان تیکت</th>
                      <th className="px-6 py-3 w-36">وضعیت</th>
                      <th className="px-6 py-3 w-36">اولویت</th>
                      <th className="px-6 py-3 w-44">تاریخ ثبت</th>
                      <th className="px-6 py-3 w-36 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {tickets.map((ticket: any) => {
                      const ticketUrl = `/ddashboard/support/tickets/${ticket.id}`;
                      const isItemDeleting = deletingId === ticket.id;

                      return (
                        <tr
                          key={ticket.id}
                          className="group transition-colors hover:bg-slate-50/80"
                        >
                          <td className="p-0 align-middle">
                            <Link href={ticketUrl} className="block px-6 py-3">
                              <span className="rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                #{String(ticket.id).slice(-6).toUpperCase()}
                              </span>
                            </Link>
                          </td>

                          <td className="p-0 align-middle">
                            <Link href={ticketUrl} className="block px-6 py-3">
                              <h2 className="text-sm font-medium text-slate-800 line-clamp-1 transition-colors group-hover:text-blue-600">
                                {ticket.subject}
                              </h2>
                            </Link>
                          </td>

                          <td className="p-0 align-middle">
                            <Link href={ticketUrl} className="block px-6 py-3">
                              {getStatusBadge(ticket.status)}
                            </Link>
                          </td>

                          <td className="p-0 align-middle">
                            <Link href={ticketUrl} className="block px-6 py-3">
                              {getPriorityDisplay(ticket.priority)}
                            </Link>
                          </td>

                          <td className="p-0 align-middle">
                            <Link
                              href={ticketUrl}
                              className="flex items-center px-6 py-3"
                            >
                              <div className="inline-flex items-center text-xs font-medium text-slate-500 whitespace-nowrap">
                                <Clock className="ml-1.5 h-4 w-4 text-slate-400" />
                                {new Intl.DateTimeFormat("fa-IR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }).format(new Date(ticket.createdAt))}
                              </div>
                            </Link>
                          </td>

                          {/* ستون عملیات دسکتاپ: مشاهده + حذف */}
                          <td className="px-6 py-3 align-middle text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link
                                href={ticketUrl}
                                title="مشاهده تیکت"
                                className="inline-flex h-8 items-center justify-center gap-1 rounded-md border-2 border-blue-300 bg-blue-50 px-2.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600"
                              >
                                <span>مشاهده</span>
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setTicketToDelete({
                                    id: ticket.id,
                                    subject: ticket.subject,
                                  })
                                }
                                disabled={isItemDeleting}
                                title="حذف تیکت"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white hover:border-rose-600 disabled:opacity-50"
                              >
                                {isItemDeleting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 🟢 ۳. نوار صفحه‌بندی تعاملی */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-200 bg-slate-50/50 px-4 py-3 md:px-6">
                <div className="text-xs text-slate-500 font-medium">
                  صفحه {currentPage} از {totalPages}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* دکمه صفحه قبل */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isPending}
                    className={`inline-flex h-8 items-center gap-1 rounded-md border-2 px-2.5 text-xs font-medium transition-all cursor-pointer ${
                      currentPage <= 1 || isPending
                        ? "pointer-events-none opacity-50 border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    قبلی
                  </button>

                  {/* شماره صفحات */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isPending}
                            className={`flex h-8 w-8 items-center justify-center rounded-md border-2 text-xs font-medium transition-all cursor-pointer ${
                              isActive
                                ? "border-blue-600 bg-blue-600 text-white font-bold"
                                : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
                            } ${isPending ? "cursor-wait" : ""}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* دکمه صفحه بعد */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isPending}
                    className={`inline-flex h-8 items-center gap-1 rounded-md border-2 px-2.5 text-xs font-medium transition-all cursor-pointer ${
                      currentPage >= totalPages || isPending
                        ? "pointer-events-none opacity-50 border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    بعدی
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 🟢 ۴. مودال تایید حذف تیکت */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border-2 border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 border border-rose-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                حذف تیکت پشتیبانی
              </h3>
            </div>

            <p className="text-sm leading-6 text-slate-600 mb-2">
              آیا از حذف تیکت{" "}
              <strong className="text-slate-800">
                «{ticketToDelete.subject}»
              </strong>{" "}
              اطمینان دارید؟
            </p>
            <p className="text-xs text-rose-500 font-medium mb-5">
              ⚠️ توجه: تمام پیام‌ها و سوابق مربوط به این تیکت حذف شده و قابل بازیابی نخواهد بود.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTicketToDelete(null)}
                disabled={Boolean(deletingId)}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId)}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 rounded-lg border-2 border-rose-600 bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>در حال حذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>بله، حذف شود</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}