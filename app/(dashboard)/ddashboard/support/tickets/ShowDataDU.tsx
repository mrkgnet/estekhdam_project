import Link from "next/link";
import { 
  Plus, 
  Ticket, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  MessageSquare,
  CheckCircle2,
  Inbox
} from "lucide-react";

// توابع کمکی برای ظاهر وضعیت‌ها
const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN": 
      return <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100"><Inbox className="w-3.5 h-3.5" /> باز</span>;
    case "ANSWERED": 
      return <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /> پاسخ داده شده</span>;
    case "IN_PROGRESS": 
      return <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100"><Clock className="w-3.5 h-3.5" /> در حال بررسی</span>;
    case "CLOSED": 
      return <span className="flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200">بسته شده</span>;
    default: 
      return <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold">{status}</span>;
  }
};

// توابع کمکی برای اولویت‌ها با رنگ‌بندی اختصاصی
const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case "HIGH": 
      return <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-md"><AlertCircle className="w-3.5 h-3.5" /> اولویت بالا</span>;
    case "MEDIUM": 
      return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">اولویت متوسط</span>;
    case "LOW": 
      return <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-md">اولویت پایین</span>;
    default: 
      return <span className="text-slate-500">{priority}</span>;
  }
};

export default function TicketsListPage({ response }: { response: any }) {
  const tickets = response?.tickets || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            تیکت‌های پشتیبانی
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">لیست درخواست‌ها و سوالات شما از تیم پشتیبانی</p>
        </div>
        <Link
          href="/ddashboard/support/tickets/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          ثبت تیکت جدید
        </Link>
      </div>

      {/* نمایش خطا */}
      {!response.success && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {response.message}
        </div>
      )}

      {/* لیست تیکت‌ها */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          // حالت خالی (Empty State)
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">هیچ تیکتی ندارید!</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed font-medium">
              تا به حال درخواستی ثبت نکرده‌اید. اگر سوال یا مشکلی دارید، می‌توانید یک تیکت جدید ایجاد کنید.
            </p>
          </div>
        ) : (
          // نمایش لیست تیکت‌ها
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket: any) => (
              <Link
                key={ticket.id}
                href={`/ddashboard/support/tickets/${ticket.id}`}
                className="block p-5 sm:p-6 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  
                  {/* اطلاعات تیکت */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(ticket.status)}
                      <h2 className="text-[15px] sm:text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {ticket.subject}
                      </h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span>شناسه:</span> 
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          #{ticket.id.slice(-6).toUpperCase()}
                        </span>
                      </span>
                      {getPriorityDisplay(ticket.priority)}
                    </div>
                  </div>

                  {/* زمان و آیکون ورود */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 mt-2 sm:mt-0">
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-4 h-4 ml-1.5 text-slate-400" />
                      {new Intl.DateTimeFormat("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(ticket.createdAt))}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
