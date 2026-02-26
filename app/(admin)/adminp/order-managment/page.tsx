// app/adminp/order-managment/page.tsx
import { getAllOrders } from "@/actions/getOrderAdminPanel";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function formatToman(n: number) {
  if (!n) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function OrderStatusBadge({ status }: { status: string }) {
  const base = "rounded-full px-2.5 py-0.5 text-xs font-semibold";
  switch (status) {
    case "PENDING":
      return <span className={`${base} bg-amber-100 text-amber-800`}>در انتظار پرداخت</span>;
    case "COMPLETED":
      return <span className={`${base} bg-green-100 text-green-800`}>تکمیل شده</span>;
    case "CANCELED":
      return <span className={`${base} bg-red-100 text-red-800`}>لغو شده</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
}

type SearchParams = { page?: string };
type Props = { searchParams: Promise<SearchParams> };

export default async function OrderManagementPage({ searchParams }: Props) {
  const sp = await searchParams;

  const pageNum = Number(sp?.page);
  const currentPage = Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1;

  const ITEMS_PER_PAGE = 5;

  const res = await getAllOrders({ page: currentPage, pageSize: ITEMS_PER_PAGE });

  if (!res.ok) {
    return (
      <div dir="rtl" className="p-6 text-center text-red-500">
        {res.error}
      </div>
    );
  }

  const { orders, totalPages } = res;

  // ✅ clamp برای ساخت لینک‌های درست
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <div dir="rtl" className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-800">مدیریت سفارشات</h1>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed p-8 text-center text-gray-500">
            <p>هیچ سفارشی برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-0">
                          شناسه سفارش
                        </th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">کاربر</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">تاریخ</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">مبلغ کل</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">مشاهده</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                            #{String(order.id).slice(-6)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                            {order.user.username || order.user.phoneNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                            {formatToman(order.totalPrice)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0">
                            <Link
                              href={`/adminp/order-managment/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              مشاهده
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div dir="rtl" className="mt-6 flex items-center justify-center gap-4">
                <Link
                  href={`/adminp/order-managment?page=${prevPage}`}
                  className={`rounded-md border bg-white px-3 py-1.5 text-sm font-medium transition ${
                    currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
                  }`}
                  aria-disabled={currentPage <= 1}
                >
                  قبلی
                </Link>

                <span className="text-sm font-semibold text-gray-600">
                  صفحه {currentPage} از {totalPages}
                </span>

                <Link
                  href={`/adminp/order-managment?page=${nextPage}`}
                  className={`rounded-md border bg-white px-3 py-1.5 text-sm font-medium transition ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
                  }`}
                  aria-disabled={currentPage >= totalPages}
                >
                  بعدی
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
