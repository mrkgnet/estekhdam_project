import { CopyClipBoard } from "@/components/copy-clipboard/CopyClipBoard";

import React from "react";
import { AlertCircle, ClipboardList } from "lucide-react";
import MarkAllReadButton from "@/components/MarkAllReadButton/MarkAllReadButton.";

type FetchResponse = Awaited<
  ReturnType<typeof import("@/actions/admin/issu-question/fetch/Actions").default>
>;

interface ShowQuestionIssuProps {
  response: FetchResponse;
}

const formatJalali = (date: Date) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function ShowQuestionIssu({ response }: ShowQuestionIssuProps) {
  if (!response.success) {
    return (
      <div className="mx-auto w-full max-w-6xl mt-9 rounded-md border border-red-200 bg-red-50/80 p-5 text-red-700 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <span className="text-sm">{response.message ?? "خطایی در دریافت اطلاعات رخ داده است."}</span>
        </div>
      </div>
    );
  }

  const issues = response.data ?? [];
  const unreadCount = issues.filter(i => !i.isRead).length;

  return (
    <section className="mx-auto w-full max-w-6xl min-h-screen mt-10 space-y-8 px-4 md:px-0">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl text-slate-800 tracking-tight">گزارش مشکلات سوالات</h2>
          <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
            مدیریت و بررسی مشکلاتی که کاربران گزارش داده‌اند.
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-0.5 text-xs text-amber-800">
                {unreadCount} مورد جدید
              </span>
            )}
          </p>
        </div>
        {issues.length > 0 && <MarkAllReadButton />}
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center shadow-sm">
          <div className="rounded-md bg-slate-200/50 p-4 mb-4">
            <ClipboardList className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg text-slate-700">هیچ گزارشی یافت نشد</h3>
          <p className="text-sm text-slate-500 mt-2">تا این لحظه کاربران هیچ مشکلی را گزارش نکرده‌اند.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm md:block">
            <div className="max-h-[65vh] overflow-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-5 text-right text-slate-600">کد سؤال</th>
                    <th className="px-6 py-5 text-right text-slate-600">مشکل گزارش‌شده</th>
                    <th className="px-6 py-5 text-right text-slate-600">متن سؤال</th>
                    <th className="px-6 py-5 text-right text-slate-600">تاریخ ثبت</th>
                    <th className="px-6 py-5 text-right text-slate-600">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-6 py-5 align-top">
                        <CopyClipBoard text={issue.question.questionCode ?? "بدون کد"} />
                      </td>
                      <td className="px-6 py-5 align-top text-slate-800 whitespace-pre-line leading-relaxed max-w-xs">
                        {issue.description}
                      </td>
                      <td className="px-6 py-5 align-top text-slate-500 line-clamp-2 max-w-xs text-sm">
                        {issue.question.questionText}
                      </td>
                      <td className="px-6 py-5 align-top text-slate-500 text-xs dir-ltr text-right">
                        {formatJalali(issue.createdAt)}
                      </td>
                      <td className="px-6 py-5 align-top">
                        {issue.isRead ? (
                          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 border border-emerald-200/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            بررسی‌شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700 border border-amber-200/60 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            جدید
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-5 md:hidden">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <CopyClipBoard text={issue.question.questionCode ?? "بدون کد"} label="کد:" />
                  <span className="text-xs text-slate-400 dir-ltr">
                    {formatJalali(issue.createdAt)}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">مشکل گزارش‌شده</h4>
                  <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="mt-4 rounded-md bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">متن سؤال</h4>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {issue.question.questionText}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-end">
                  {issue.isRead ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-4 py-1.5 text-xs text-emerald-700 border border-emerald-200/60">
                      بررسی‌شده
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-4 py-1.5 text-xs text-amber-700 border border-amber-200/60 shadow-sm">
                      مورد جدید
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
