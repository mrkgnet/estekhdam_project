import Link from "next/link";
import { ChevronLeft, Receipt } from "lucide-react";

// تعریف تایپ پراپ ورودی
interface ShowDataRODProps {
  response: {
    success: boolean;
    data: any[];
  };
}

// کامپوننت نمایش وضعیت
function StatusPill({ status }: { status: string }) {
  // تبدیل وضعیت دیتابیس به متن و استایل مناسب
  let text = "نامشخص";
  let cls = "bg-slate-50 text-slate-700 border-slate-100";

  if (status === "SUCCESS") {
    text = "موفق";
    cls = "bg-emerald-50 text-emerald-700 border-emerald-100";
  } else if (status === "PENDING") {
    text = "در انتظار";
    cls = "bg-amber-50 text-amber-700 border-amber-100";
  } else if (status === "FAILED") {
    text = "ناموفق";
    cls = "bg-rose-50 text-rose-700 border-rose-100";
  }

  return <span className={`text-[12px] font-extrabold px-2 py-1 rounded-full border ${cls}`}>{text}</span>;
}

export default function ShowDataROD({ response }: ShowDataRODProps) {
  // استخراج سفارش‌ها
  const orders = response?.success && response?.data ? response.data : [];

  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="font-extrabold text-slate-900">سفارش‌های اخیر</div>
          <div className="text-sm text-slate-500 mt-1">ریز تراکنش‌ها و وضعیت پرداخت</div>
        </div>

        <Link
          href="/ddashboard"
          className="text-sm font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
        >
          مشاهده همه <ChevronLeft size={16} />
        </Link>
      </div>

      <div className="p-5 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            شما هنوز سفارشی ثبت نکرده‌اید.
          </div>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-slate-500">
                <th className="text-right font-bold py-2">کد سفارش</th>
                <th className="text-right font-bold py-2">عنوان</th>
                <th className="text-right font-bold py-2">تاریخ</th>
                <th className="text-right font-bold py-2">مبلغ (تومان)</th>
                <th className="text-right font-bold py-2">وضعیت</th>
             
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  {/* اگر در دیتابیس فیلد کد پیگیری جداگانه دارید آن را جایگزین o.id کنید */}
                  <td className="py-3 font-extrabold text-slate-900">
                    {o.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 text-slate-700">
                    {o.product?.name || "بدون نام"}
                  </td>
                  <td className="py-3 text-slate-600">
                    {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="py-3 text-slate-700 font-bold">
                    {o.price?.toLocaleString() || "0"}
                  </td>
                  <td className="py-3">
                    <StatusPill status={o.status} />
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
