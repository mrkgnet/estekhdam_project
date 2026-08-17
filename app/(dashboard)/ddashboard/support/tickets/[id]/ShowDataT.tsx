import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Ticket as TicketIcon, 
  Clock, 
  User, 
  Headphones, 
  AlertCircle,
  Inbox,
  CheckCircle2,
  CalendarDays,
  Hash,
  ShieldAlert,
  Loader2,
  XCircle
} from 'lucide-react'
import ReplyTicketForm from '@/components/user/dashboard/support/ReplyTicketForm';

// ============================
// 🎨 رنگ‌بندی معنادار برای وضعیت‌ها
// ============================
const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN": 
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-blue-400 whitespace-nowrap">
          <Inbox className="w-3.5 h-3.5" /> باز
        </span>
      );
    case "ANSWERED": 
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-emerald-500 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5" /> پاسخ داده شده
        </span>
      );
    case "IN_PROGRESS": 
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-amber-500 whitespace-nowrap">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> در حال بررسی
        </span>
      );
    case "CLOSED": 
      return (
        <span className="inline-flex items-center gap-1.5 bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-slate-500 whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5" /> بسته شده
        </span>
      );
    default: 
      return (
        <span className="inline-flex items-center bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-slate-300 whitespace-nowrap">
          {status}
        </span>
      );
  }
};

// ============================
// 🎨 رنگ‌بندی معنادار برای اولویت‌ها
// ============================
const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case "HIGH": 
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-rose-500 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5" /> اولویت بالا
        </span>
      );
    case "MEDIUM": 
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-yellow-500 whitespace-nowrap">
          اولویت متوسط
        </span>
      );
    case "LOW": 
      return (
        <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md text-[11px] font-medium border-2 border-teal-500 whitespace-nowrap">
          اولویت پایین
        </span>
      );
    default: 
      return <span className="text-xs text-slate-500">{priority}</span>;
  }
};

// ============================
// 🎨 رنگ نوار دکوراتیو بالای کارت بر اساس وضعیت
// ============================
const getTopStripeColor = (status: string) => {
  switch (status) {
    case "OPEN": return "from-blue-500 to-blue-400";
    case "ANSWERED": return "from-emerald-500 to-emerald-400";
    case "IN_PROGRESS": return "from-amber-500 to-amber-400";
    case "CLOSED": return "from-slate-500 to-slate-400";
    default: return "from-slate-400 to-slate-300";
  }
};

export default function ShowDataT({ response }: { response: any }) {
  // مدیریت خطا
  if (!response.success || !response.ticket) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white p-6 rounded-lg border-2 border-slate-300 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-4 border-2 border-red-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-base font-medium text-slate-800 mb-2">تیکت یافت نشد!</h2>
          <p className="text-slate-500 text-sm mb-5">{response.message || "متأسفانه تیکت مورد نظر پیدا نشد یا شما دسترسی به آن ندارید."}</p>
          <Link 
            href="/ddashboard/support/tickets" 
            className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors border-2 border-slate-900"
          >
            بازگشت به لیست تیکت‌ها
          </Link>
        </div>
      </div>
    );
  }

  const ticket = response.ticket;
  const stripeColor = getTopStripeColor(ticket.status);

  return (
    // 🟢 overflow-x-hidden در ریشه برای جلوگیری کامل از اسکرول افقی
    <div className="max-w-6xl mx-auto p-3 sm:p-4 mb-6 md:p-6 space-y-4 sm:space-y-5 overflow-x-hidden">
      
      {/* دکمه بازگشت */}
      <Link 
        href="/ddashboard/support/tickets" 
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-3 py-2 rounded-md border-2 border-slate-300 shadow-sm transition-all hover:shadow-md w-full sm:w-fit justify-center sm:justify-start"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست تیکت‌ها
      </Link>

      {/* باکس اطلاعات اصلی تیکت */}
      <div className="bg-white rounded-lg border-2 border-slate-300 p-4 sm:p-5 shadow-sm relative overflow-hidden w-full">
        {/* 🎨 نوار رنگی دکوراتیو بر اساس وضعیت تیکت */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stripeColor}`}></div>
        
        <div className="flex flex-col gap-4 mt-1">
          <div className="space-y-3 min-w-0">
            <h1 className="text-base md:text-lg font-medium text-slate-800 flex items-start gap-2.5 leading-tight break-words [overflow-wrap:anywhere]">
              <TicketIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{ticket.subject}</span>
            </h1>
            
            {/* 🟢 در موبایل به صورت شکسته، در دسکتاپ در یک خط */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-x-5 text-xs text-slate-600 font-medium bg-slate-50 p-2.5 sm:p-3 rounded-md border-2 border-slate-200 min-w-0">
              <span className="flex items-center gap-1.5 min-w-0">
                <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">شناسه: <span className="text-slate-800 font-medium">{ticket.id.slice(-8).toUpperCase()}</span></span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block flex-shrink-0"></span>
              <span className="flex items-center gap-1.5 min-w-0">
                <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">
                  {new Intl.DateTimeFormat("fa-IR", { 
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" 
                  }).format(new Date(ticket.createdAt))}
                </span>
              </span>
            </div>
          </div>
          
          {/* 🟢 Badgeها در موبایل زیر عنوان، در دسکتاپ کنار */}
          <div className="flex items-center flex-wrap gap-2 bg-slate-50 p-2 rounded-md border-2 border-slate-200 w-fit">
            {getStatusBadge(ticket.status)}
            {getPriorityDisplay(ticket.priority)}
          </div>
        </div>
      </div>

      {/* باکس چت / تاریخچه پیام‌ها */}
      <div className="bg-slate-50/50 rounded-lg border-2 border-slate-300 shadow-sm overflow-hidden flex flex-col w-full">
        {/* هدر بخش چت */}
        <div className="bg-white p-3 border-b-2 border-slate-200 flex items-center justify-between gap-2">
          <h3 className="font-medium text-slate-700 text-sm flex items-center gap-2 min-w-0">
            <Headphones className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">گفتگو با پشتیبانی</span>
          </h3>
          <span className="text-xs text-slate-600 font-medium rounded-md border-2 border-slate-300 bg-white px-2 py-0.5 whitespace-nowrap flex-shrink-0">
            {ticket.messages.length} پیام
          </span>
        </div>
        
        {/* 🟢 محیط چت - overflow-x: hidden برای جلوگیری از اسکرول افقی */}
        <div className="p-3 sm:p-4 md:p-5 space-y-4 sm:space-y-5 overflow-y-auto overflow-x-hidden max-h-[60vh] custom-scrollbar w-full">
          {ticket.messages.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              هنوز پیامی در این گفتگو ارسال نشده است.
            </div>
          ) : (
            ticket.messages.map((message: any) => {
              const isUserMessage = message.userId === ticket.userId;

              return (
                <div 
                  key={message.id} 
                  className={`flex w-full ${isUserMessage ? "justify-start" : "justify-end"}`}
                >
                  {/* 🟢 container پیام با max-w مناسب برای موبایل و دسکتاپ */}
                  <div className={`flex min-w-0 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] gap-2 sm:gap-3 ${isUserMessage ? "flex-row" : "flex-row-reverse"}`}>
                    
                    {/* آواتار - کوچکتر در موبایل */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center shadow-sm border-2 ${
                        isUserMessage 
                          ? "bg-blue-100 text-blue-700 border-blue-400" 
                          : "bg-emerald-100 text-emerald-700 border-emerald-400"
                      }`}>
                        {isUserMessage 
                          ? <User size={14} strokeWidth={2} className="sm:w-4 sm:h-4" /> 
                          : <Headphones size={14} strokeWidth={2} className="sm:w-4 sm:h-4" />
                        }
                      </div>
                    </div>

                    {/* 🟢 حباب پیام - overflow کامل کنترل شده */}
                    <div 
                      className={`
                        p-2.5 sm:p-3.5 shadow-sm min-w-0 border-2 w-full
                        ${isUserMessage 
                          ? "bg-blue-600 text-white rounded-lg rounded-tr-sm border-blue-600" 
                          : "bg-white text-slate-800 border-slate-300 rounded-lg rounded-tl-sm"
                        }
                      `}
                      style={{ 
                        // جلوگیری از overflow کلمات طولانی
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        // جلوگیری از گسترش عرض container
                        maxWidth: '100%'
                      }}
                    >
                      {/* هدر پیام - با wrap در موبایل */}
                      <div className={`flex flex-wrap items-center gap-2 mb-2 pb-2 border-b ${isUserMessage ? 'border-blue-500/50' : 'border-slate-200'}`}>
                        <span className={`font-medium text-xs px-2 py-0.5 rounded-md whitespace-nowrap ${
                          isUserMessage 
                            ? "bg-blue-500/30 text-white" 
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}>
                          {isUserMessage ? "شما" : "تیم پشتیبانی"}
                        </span>
                        <span className={`text-[10px] flex items-center gap-1 whitespace-nowrap ${isUserMessage ? "text-blue-200" : "text-slate-400"}`}>
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {new Intl.DateTimeFormat("fa-IR", { 
                            hour: "2-digit", minute: "2-digit" 
                          }).format(new Date(message.createdAt))}
                        </span>
                      </div>
                      
                      {/* 🟢 متن پیام - کنترل کامل overflow */}
                      <div 
                        className="text-sm leading-7 whitespace-pre-wrap break-words"
                        style={{
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                          WebkitBoxDecorationBreak: 'clone',
                          boxDecorationBreak: 'clone',
                        }}
                      >
                        {message.text}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* بخش فرم یا پیام بسته بودن */}
        <div className="bg-white border-t-2 border-slate-200 p-2 w-full">
          {ticket.status !== "CLOSED" ? (
            <ReplyTicketForm ticketId={ticket.id} />
          ) : (
            <div className="m-2 sm:m-3 py-3 bg-slate-100 border-2 border-slate-400 rounded-lg text-center flex flex-col items-center justify-center gap-2">
              <div className="w-9 h-9 bg-slate-300 rounded-md flex items-center justify-center text-slate-700 border-2 border-slate-400">
                <XCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-800 px-2">این تیکت بسته شده است</p>
              <p className="text-xs text-slate-600 font-medium px-2">امکان ارسال پیام جدید در این گفتگو وجود ندارد.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}