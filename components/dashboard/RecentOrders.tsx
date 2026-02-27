// components/dashboard/RecentOrders.tsx
import Link from "next/link";
import { ChevronLeft, Receipt } from "lucide-react";

const orders = [
  { id: "TR-10241", title: "پکیج آزمون‌های جامع", date: "1404/11/12", price: "1,490,000", status: "موفق" },
  { id: "TR-10219", title: "دوره زبان پیشرفته", date: "1404/11/08", price: "780,000", status: "موفق" },
  { id: "TR-10188", title: "اشتراک ماهانه", date: "1404/10/29", price: "290,000", status: "در انتظار" },
];

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "موفق"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-amber-50 text-amber-700 border-amber-100";
  return <span className={`text-[12px] font-extrabold px-2 py-1 rounded-full border ${cls}`}>{status}</span>;
}

export default function RecentOrders() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="font-extrabold text-slate-900">سفارش‌های اخیر</div>
          <div className="text-sm text-slate-500 mt-1">ریز تراکنش‌ها و وضعیت پرداخت</div>
        </div>

        <Link
          href="/dashboard/orders"
          className="text-sm font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
        >
          مشاهده همه <ChevronLeft size={16} />
        </Link>
      </div>

      <div className="p-5 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-slate-500">
              <th className="text-right font-bold py-2">کد</th>
              <th className="text-right font-bold py-2">عنوان</th>
              <th className="text-right font-bold py-2">تاریخ</th>
              <th className="text-right font-bold py-2">مبلغ (تومان)</th>
              <th className="text-right font-bold py-2">وضعیت</th>
              <th className="text-right font-bold py-2">رسید</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 transition">
                <td className="py-3 font-extrabold text-slate-900">{o.id}</td>
                <td className="py-3 text-slate-700">{o.title}</td>
                <td className="py-3 text-slate-600">{o.date}</td>
                <td className="py-3 text-slate-700 font-bold">{o.price}</td>
                <td className="py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="py-3">
                  <Link
                    href={`/dashboard/orders/${o.id}`}
                    className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold"
                  >
                    <Receipt size={16} />
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}