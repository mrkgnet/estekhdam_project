import Link from "next/link";
import { ChevronLeft, PlayCircle } from "lucide-react";

// تعریف تایپ برای پراپ‌های ورودی
interface ShowDataMCDProps {
  response: {
    success: boolean;
    data: any[]; // می‌توانید تایپ دقیق‌تری برای Order همراه با Product بنویسید
  };
}

export default function ShowDataMCD({ response }: ShowDataMCDProps) {
  // استخراج دوره‌ها از ریسپانس
  const courses = response?.success && response?.data ? response.data : [];
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className=" text-slate-900">دوره‌ها و آزمون‌های من</div>
        </div>
      </div>

      {/* 
        تغییرات در این div اعمال شده است:
        اضافه شدن max-h-[420px] و overflow-y-auto 
      */}
      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar">
        {courses.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            شما هنوز در دوره‌ای ثبت‌نام نکرده‌اید.
          </div>
        ) : (
          courses.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {/* فرض شده که نام فیلد در مدل Product شما name است (اگر title است آن را تغییر دهید) */}
                  <div className=" truncate text-slate-800">
                    {order.product?.name || "بدون نام"}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1">
                    تاریخ ثبت‌نام: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </div>

                <Link
                  // هدایت به صفحه دوره بر اساس آیدی محصول
                  href={`/resources/course/${order.product?.slug}`}
                  className="shrink-0 h-10 px-3 rounded-2xl bg-blue-900 text-white  text-sm
                             hover:bg-blue-800 transition inline-flex items-center gap-2"
                >
                  <PlayCircle size={18} />
                  مشاهده دوره
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
