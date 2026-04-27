import Link from "next/link";
import {
  Plus,
  Ticket,
  Clock,
  AlertCircle,
  ChevronLeft,
  MessageSquare,
  CheckCircle2,
  Inbox,
  Loader2,
  Sparkles,
} from "lucide-react";

// ============================
// UI Helpers
// ============================
const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-blue-700 whitespace-nowrap">
          <Inbox className="h-3.5 w-3.5" />
          باز
        </span>
      );
    case "ANSWERED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 whitespace-nowrap">
          <CheckCircle2 className="h-3.5 w-3.5" />
          پاسخ داده شده
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700 whitespace-nowrap">
          <Loader2 className="h-3.5 w-3.5" />
          در حال بررسی
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-600 whitespace-nowrap">
          بسته شده
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 whitespace-nowrap">
          {status}
        </span>
      );
  }
};

const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600 whitespace-nowrap">
          <AlertCircle className="h-3.5 w-3.5" />
          اولویت بالا
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 whitespace-nowrap">
          اولویت متوسط
        </span>
      );
    case "LOW":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 whitespace-nowrap">
          اولویت پایین
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{priority}</span>;
  }
};

export default function TicketsListPage({ response }: { response: any }) {
  const tickets = response?.tickets || [];
  const isSuccess = Boolean(response?.success);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 md:p-7 shadow-sm">
        <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-blue-100/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-100/40 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-lg sm:text-xl font-black text-slate-600">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-300/40">
                <Ticket className="h-5 w-5" />
              </span>
              تیکت‌های پشتیبانی
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              لیست درخواست‌ها و گفتگوهای شما با تیم پشتیبانی
            </p>
          </div>

          <Link
            href="/ddashboard/support/tickets/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-extrabold text-white shadow-sm shadow-blue-300/50 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            ثبت تیکت جدید
          </Link>
        </div>
      </div>

      {/* Error */}
      {!isSuccess && (
        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{response?.message || "خطایی رخ داده است"}</span>
        </div>
      )}

      {/* Tickets Box */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Top strip */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Sparkles className="h-4 w-4 text-blue-600" />
            لیست تیکت‌ها
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-600">
            {tickets.length} مورد
          </span>
        </div>

        {tickets.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center px-6 py-16 md:py-20 text-center">
            <div className="mb-5 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-slate-50 text-slate-400 shadow-sm">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">هنوز تیکتی ثبت نکرده‌اید</h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-7 text-slate-500">
              اگر سوال یا مشکلی دارید، یک تیکت جدید ثبت کنید تا تیم پشتیبانی سریع‌تر
              راهنمایی‌تان کند.
            </p>
            <Link
              href="/ddashboard/support/tickets/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              ثبت اولین تیکت
            </Link>
          </div>
        ) : (
          // Responsive Table
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-500">
                  <th className="px-6 py-4 w-28">شناسه</th>
                  <th className="px-6 py-4">عنوان تیکت</th>
                  <th className="px-6 py-4 w-40">وضعیت</th>
                  <th className="px-6 py-4 w-40">اولویت</th>
                  <th className="px-6 py-4 w-48">تاریخ ثبت</th>
                  <th className="px-6 py-4 w-28 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket: any) => {
                  const ticketUrl = `/ddashboard/support/tickets/${ticket.id}`;
                  
                  return (
                    <tr
                      key={ticket.id}
                      className="group transition-colors hover:bg-slate-50/80 cursor-pointer"
                    >
                      {/* شناسه */}
                      <td className="p-0 align-middle">
                        <Link href={ticketUrl} className="block px-6 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                            #{String(ticket.id).slice(-6).toUpperCase()}
                          </span>
                        </Link>
                      </td>

                      {/* عنوان */}
                      <td className="p-0 align-middle">
                        <Link href={ticketUrl} className="block px-6 py-4">
                          <h2 className="text-sm font-extrabold text-slate-800 line-clamp-1 transition-colors group-hover:text-blue-600">
                            {ticket.subject}
                          </h2>
                        </Link>
                      </td>

                      {/* وضعیت */}
                      <td className="p-0 align-middle">
                        <Link href={ticketUrl} className="block px-6 py-4">
                          {getStatusBadge(ticket.status)}
                        </Link>
                      </td>

                      {/* اولویت */}
                      <td className="p-0 align-middle">
                        <Link href={ticketUrl} className="block px-6 py-4">
                          {getPriorityDisplay(ticket.priority)}
                        </Link>
                      </td>

                      {/* تاریخ */}
                      <td className="p-0 align-middle">
                        <Link href={ticketUrl} className="flex items-center px-6 py-4">
                          <div className="inline-flex items-center text-xs font-semibold text-slate-500 whitespace-nowrap">
                            <Clock className="ml-1.5 h-4 w-4 text-slate-400" />
                            {new Intl.DateTimeFormat("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }).format(new Date(ticket.createdAt))}
                          </div>
                        </Link>
                      </td>

                      {/* عملیات */}
                      <td className="p-0 align-middle text-center">
                        <Link href={ticketUrl} className="flex justify-center px-6 py-4">
                          <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            مشاهده
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
