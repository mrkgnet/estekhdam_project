import Link from "next/link";
import { BookCopyIcon, PlayCircle } from "lucide-react"; // آیکون‌های استفاده نشده حذف شدند

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
        <div className="flex gap-2 justify-center items-center">
          <BookCopyIcon size={18}/>
          <div className=" text-slate-600 font-bold text-15 sm:text-16">دوره‌های من</div>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar">
        {courses.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            شما هنوز در دوره‌ای ثبت‌نام نکرده‌اید.
          </div>
        ) : (
          courses.map((order) => (
            // تگ div اصلی به Link تبدیل شد تا کل بخش قابل کلیک باشد
            <Link 
              key={order.id} 
              href={`/resources/course/${order.product?.slug}`}
              className="block rounded-2xl border border-slate-300 p-4 hover:bg-slate-50 transition border-r-4 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className=" truncate text-slate-800">
                    {order.product?.name || "بدون نام"}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1">
                    تاریخ ثبت‌نام: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </div>

                {/* دکمه Link قبلی به div تبدیل شد چون خود کارت حالا لینک است */}
                <div
                  className="shrink-0 h-10 px-3 rounded-2xl bg-blue-900 text-white text-sm
                             hover:bg-blue-800 transition inline-flex items-center gap-2"
                >
                  <PlayCircle size={18} />
                  مشاهده 
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
