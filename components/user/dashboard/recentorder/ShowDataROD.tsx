"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface OrderItem {
  id: string;
  pricePaid: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | string;
  refId?: string | null;
  createdAt: Date | string;
  subscriptionPlanId?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    type?: string;
  } | null;
  subscriptionPlan?: {
    id: string;
    title: string;
    slug: string;
    durationDays: number;
  } | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

interface ShowDataRODProps {
  response: {
    success: boolean;
    data: OrderItem[];
    pagination?: PaginationInfo;
    message?: string;
  };
}

function StatusPill({ status }: { status: string }) {
  let text = "نامشخص";
  let cls = "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600";

  if (status === "SUCCESS") {
    text = "موفق";
    cls = "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800";
  } else if (status === "PENDING") {
    text = "در انتظار پرداخت";
    cls = "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800";
  } else if (status === "FAILED") {
    text = "ناموفق";
    cls = "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800";
  }

  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {text}
    </span>
  );
}

function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 1; 
  const range: (number | string)[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < totalPages - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

export default function ShowDataROD({ response }: ShowDataRODProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const orders = response?.success && Array.isArray(response?.data) ? response.data : [];
  const pagination = response?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: orders.length,
    pageSize: 5,
  };

  const { currentPage, totalPages, totalCount } = pagination;
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b-2 border-slate-300 dark:border-slate-700">
        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base">لیست سفارش‌ها</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مجموع کل سفارش‌ها: {totalCount.toLocaleString("fa-IR")} مورد
          </p>
        </div>
      </div>

      <div className="relative p-5 overflow-x-auto min-h-[200px]">
        {/* افکت لودینگ روی جدول هنگام تغییر صفحه */}
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className={`transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400 gap-2">
              <AlertCircle size={28} className="text-slate-400" />
              <p className="text-sm">هیچ سفارشی ثبت نشده است.</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <th className="text-right font-medium py-3 pr-2">کد سفارش</th>
                  <th className="text-right font-medium py-3">عنوان خرید</th>
                  <th className="text-right font-medium py-3">تاریخ ثبت</th>
                  <th className="text-right font-medium py-3">مبلغ پرداختی</th>
                  <th className="text-right font-medium py-3">کد رهگیری</th>
                  <th className="text-right font-medium py-3 pl-2">وضعیت</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {orders.map((o) => {
                  const title = o.subscriptionPlan?.title || o.product?.name || "سفارش نامشخص";
                  const subDetails = o.subscriptionPlan
                    ? `اشتراک ${o.subscriptionPlan.durationDays} روزه`
                    : o.product?.type === "FREE_RESOURCE"
                    ? "منبع رایگان"
                    : "محصول دانلودی";

                  return (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 pr-2 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                        {o.id.substring(0, 8).toUpperCase()}#
                      </td>

                      <td className="py-3.5">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                            {title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {subDetails}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                      </td>

                      <td className="py-3.5 text-slate-800 dark:text-slate-200 font-medium text-sm">
                        {o.pricePaid ? `${o.pricePaid.toLocaleString()} تومان` : "رایگان"}
                      </td>

                      <td className="py-3.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                        {o.refId ? o.refId : "—"}
                      </td>

                      <td className="py-3.5 pl-2">
                        <StatusPill status={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </span>

          <div className="flex items-center gap-1.5">
            {/* دکمه صفحه قبل */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className={`p-2 rounded-lg border border-slate-300 dark:border-slate-700 inline-flex items-center justify-center transition ${
                currentPage <= 1
                  ? "pointer-events-none opacity-30 text-slate-400 dark:text-slate-600"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              }`}
            >
              <ChevronRight size={16} />
            </button>

            {/* شماره صفحات هوشمند */}
            {paginationRange.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 font-medium"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(item);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isActive || isPending}
                  className={`w-8 h-8 rounded-lg font-medium flex items-center justify-center border transition ${
                    isActive
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm pointer-events-none"
                      : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  {pageNum.toLocaleString("fa-IR")}
                </button>
              );
            })}

            {/* دکمه صفحه بعد */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className={`p-2 rounded-lg border border-slate-300 dark:border-slate-700 inline-flex items-center justify-center transition ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-30 text-slate-400 dark:text-slate-600"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}