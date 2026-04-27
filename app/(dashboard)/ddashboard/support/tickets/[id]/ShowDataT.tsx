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
  ShieldAlert
} from 'lucide-react'
import ReplyTicketForm from '@/components/user/dashboard/support/ReplyTicketForm';

// هماهنگ‌سازی ظاهر وضعیت‌ها با صفحه لیست
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

// هماهنگ‌سازی اولویت‌ها با صفحه لیست
const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case "HIGH": 
      return <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs font-bold border border-rose-100"><AlertCircle className="w-3.5 h-3.5" /> اولویت بالا</span>;
    case "MEDIUM": 
      return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">اولویت متوسط</span>;
    case "LOW": 
      return <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">اولویت پایین</span>;
    default: 
      return <span className="text-slate-500 text-xs">{priority}</span>;
  }
};

export default function ShowDataT({ response }: { response: any }) {
  // مدیریت خطا به شکل مدرن
  if (!response.success || !response.ticket) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">تیکت یافت نشد!</h2>
          <p className="text-slate-500 text-sm mb-6">{response.message || "متأسفانه تیکت مورد نظر پیدا نشد یا شما دسترسی به آن ندارید."}</p>
          <Link href="/ddashboard/support/tickets" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            بازگشت به لیست تیکت‌ها
          </Link>
        </div>
      </div>
    );
  }

  const ticket = response.ticket;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* دکمه بازگشت */}
      <Link 
        href="/ddashboard/support/tickets" 
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 w-fit"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست تیکت‌ها
      </Link>

      {/* باکس اطلاعات اصلی تیکت */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm relative overflow-hidden">
        {/* نوار رنگی دکوراتیو بالای کارت */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mt-2">
          <div className="space-y-4 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2.5 leading-tight">
              <TicketIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              {ticket.subject}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 font-medium bg-slate-50 inline-flex p-3 rounded-2xl border border-slate-100">
              <span className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-slate-400" />
                <span>شناسه: <span className="text-slate-700 font-bold">{ticket.id.slice(-8).toUpperCase()}</span></span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                {new Intl.DateTimeFormat("fa-IR", { 
                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" 
                }).format(new Date(ticket.createdAt))}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-fit">
            {getStatusBadge(ticket.status)}
            {getPriorityDisplay(ticket.priority)}
          </div>
        </div>
      </div>

      {/* باکس چت / تاریخچه پیام‌ها */}
      <div className="bg-slate-50/50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* هدر بخش چت */}
        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <Headphones className="w-4 h-4 text-blue-500" />
            گفتگو با پشتیبانی
          </h3>
          <span className="text-xs text-slate-400 font-medium">{ticket.messages.length} پیام</span>
        </div>
        
        {/* محیط چت */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[55vh] custom-scrollbar">
          {ticket.messages.map((message: any) => {
            const isUserMessage = message.userId === ticket.userId;

            return (
              <div 
                key={message.id} 
                // اگر کاربر است سمت راست (start در RTL)، اگر پشتیبان است سمت چپ (end در RTL)
                className={`flex w-full ${isUserMessage ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex max-w-[90%] sm:max-w-[75%] gap-3 ${isUserMessage ? "flex-row" : "flex-row-reverse"}`}>
                  
                  {/* آواتار */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      isUserMessage 
                        ? "bg-blue-100 text-blue-600 border border-blue-200" 
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}>
                      {isUserMessage ? <User size={18} strokeWidth={2.5} /> : <Headphones size={18} strokeWidth={2.5} />}
                    </div>
                  </div>

                  {/* حباب پیام */}
                  <div className={`p-4 shadow-sm break-words ${
                    isUserMessage 
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" // استایل پیام کاربر
                      : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm" // استایل پیام ادمین
                  }`}>
                    <div className={`flex items-center gap-3 mb-2 border-b pb-2 ${isUserMessage ? 'border-blue-500/50' : 'border-slate-100'}`}>
                      <span className="font-extrabold text-xs">
                        {isUserMessage ? "شما" : "تیم پشتیبانی"}
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 ${isUserMessage ? "text-blue-200" : "text-slate-400"}`}>
                        <Clock className="w-3 h-3" />
                        {new Intl.DateTimeFormat("fa-IR", { 
                          hour: "2-digit", minute: "2-digit" 
                        }).format(new Date(message.createdAt))}
                      </span>
                    </div>
                    <div className="text-sm leading-7 whitespace-pre-wrap">
                      {message.text}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        
        {/* بخش فرم یا پیام بسته بودن */}
        <div className="bg-white border-t border-slate-200 p-2">
          {ticket.status !== "CLOSED" ? (
            <ReplyTicketForm ticketId={ticket.id} />
          ) : (
            <div className="m-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-slate-600">این تیکت بسته شده است</p>
              <p className="text-xs text-slate-500 font-medium">امکان ارسال پیام جدید در این گفتگو وجود ندارد.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
