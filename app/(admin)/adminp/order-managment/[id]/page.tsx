// app/adminp/order-managment/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderByIdAdmin } from "@/actions/getOrderByIdAdmin";
import { updateOrderAdminNote } from "@/actions/updateOrderAdminNote";

function formatToman(n: number) {
  if (!n) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function OrderStatusBadge({ status }: { status: string }) {
  const base = "rounded-full border px-2.5 py-1 text-xs font-semibold";
  switch (status) {
    case "PENDING":
      return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>در انتظار پرداخت</span>;
    case "COMPLETED":
      return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>پرداخت موفق</span>;
    case "FAILED":
      return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>ناموفق</span>;
    case "CANCELED":
      return <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>لغو شده</span>;
    default:
      return <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>{status}</span>;
  }
}

export default async function AdminOrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const isSaved = sp?.saved === "1";
  const res = await getOrderByIdAdmin(id);

  if (!res.ok) {
    if (res.error === "ORDER_NOT_FOUND") return notFound();

    return (
      <div dir="rtl" className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-white p-6 text-center text-red-600">
          خطا در دریافت اطلاعات سفارش. لطفاً دوباره تلاش کنید.
        </div>
        <div className="mt-4 text-center">
          <Link href="/adminp/order-managment" className="text-blue-600 underline">
            بازگشت به لیست سفارش‌ها
          </Link>
        </div>
      </div>
    );
  }

  const order = res.order;

  // ✅ Server Action برای ذخیره توضیحات مدیر
  async function onSaveAdminNote(formData: FormData) {
    "use server";
    const adminNote = String(formData.get("adminNote") ?? "");
    await updateOrderAdminNote({ orderId: order.id, adminNote });
    redirect(`/adminp/order-managment/${order.id}?saved=1`);
  }

  return (
    <div dir="rtl" className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">جزئیات سفارش</h1>
          <p className="mt-1 text-sm text-gray-500">شناسه: {order.id}</p>
        </div>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Link
            href="/adminp/order-managment"
            className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            بازگشت
          </Link>
        </div>
      </div>

      {/* ✅ Admin Note (Editable) */}
      <div className="mt-6 rounded-2xl border bg-white p-5">
        {isSaved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            توضیحات مدیر با موفقیت ذخیره شد.
          </div>
        )}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-zinc-800">توضیحات مدیر</h2>
          <span className="text-xs text-gray-500">بعد از ذخیره، کاربر این متن را در داشبورد می‌بیند.</span>
        </div>

        <form action={onSaveAdminNote} className="mt-3 space-y-3">
          <textarea
            name="adminNote"
            defaultValue={order.adminNote ?? ""}
            placeholder="مثال: پرداخت بررسی شد، زمان تحویل ۲۴ ساعت آینده..."
            className="min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />

          <div className="flex justify-end">
            <button type="submit" className="rounded-lg cursor-pointer bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
              ذخیره توضیحات
            </button>
          </div>
        </form>
      </div>

      {/* Summary Card */}
      <div className="mt-6 rounded-2xl border bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">تاریخ ثبت</div>
            <div className="mt-1 text-sm font-semibold text-gray-800">
              {new Date(order.createdAt).toLocaleString("fa-IR")}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">مبلغ کل</div>
            <div className="mt-1 text-sm font-semibold text-gray-800">
              {formatToman(Number(order.totalPrice) || 0)} تومان
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">تعداد آیتم‌ها</div>
            <div className="mt-1 text-sm font-semibold text-gray-800">{order.items?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="mt-6 rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-bold text-zinc-800">اطلاعات کاربر</h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <span className="text-gray-500">موبایل:</span>{" "}
            <span className="font-semibold text-gray-800">{order.user.phoneNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">نام کاربری:</span>{" "}
            <span className="font-semibold text-gray-800">{order.user.username || "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">ایمیل:</span>{" "}
            <span className="font-semibold text-gray-800">{order.user.email || "-"}</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          وضعیت کاربر: {order.user.isActive ? "فعال" : "غیرفعال"} | نقش: {order.user.role}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-bold text-zinc-800">آیتم‌های سفارش</h2>

        {order.items.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed p-6 text-center text-gray-500">
            آیتمی برای این سفارش ثبت نشده است.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {order.items.map((it: any) => (
              <div key={it.id} className="rounded-2xl border bg-gray-50/50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-800">{it.product?.title}</div>
                    <div className="mt-1 text-xs text-gray-500">{it.product?.slug}</div>

                    <div className="mt-2 text-xs text-gray-600">
                      نوع مدت: {it.product?.durationType} | مدت: {it.product?.duration}
                      {it.product?.hours ? ` | ساعت: ${it.product.hours}` : ""}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <div>
                      تعداد: <span className="font-semibold">{it.quantity}</span>
                    </div>
                    <div className="mt-1">
                      قیمت زمان خرید:{" "}
                      <span className="font-semibold">{formatToman(Number(it.priceAtTimeOfPurchase) || 0)}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      (قیمت فعلی محصول: {formatToman(Number(it.product?.price) || 0)})
                    </div>
                  </div>
                </div>

                {/* Features */}
                {Array.isArray(it.product?.features) && it.product.features.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-gray-800">ویژگی‌ها</div>
                    <ul className="mt-2 list-disc space-y-1 pr-5 text-sm text-gray-700">
                      {it.product.features.map((f: string, idx: number) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specs */}
                {Array.isArray(it.product?.specs) && it.product.specs.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-gray-800">مشخصات</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {it.product.specs.map((s: any, idx: number) => (
                        <div key={idx} className="rounded-lg border bg-white p-3 text-sm">
                          <div className="text-xs text-gray-500">{s.label}</div>
                          <div className="mt-1 font-semibold text-gray-800">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
