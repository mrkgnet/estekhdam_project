"use client";
import React, { useActionState, useState, useTransition } from 'react';
import { User, Mail, Phone, Clock, AlertCircle, Save, MessageSquare, Send } from 'lucide-react';
// مسیر اکشن بالا را درست ایمپورت کنید
import { updateTicketStatusAction } from '@/actions/admin/support/updateStatus/Actions';
import toast from 'react-hot-toast';
import { replyTicketAdminAction } from '@/actions/admin/support/sendMessage/Actions';

export default function ShowDataUTA({ response }: { response: any }) {
  const ticket = response;

  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'OPEN');
  const [isPending, startTransition] = useTransition();

  const [state , formAction , isSendMessagePending] = useActionState(replyTicketAdminAction,null)

  if (!ticket) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        <AlertCircle className="w-16 h-16 text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">تیکت یافت نشد!</h2>
        <p className="text-slate-500 mt-2">ممکن است تیکت حذف شده باشد یا دسترسی لازم را نداشته باشید.</p>
      </div>
    );
  }

  const statusFa = {
    OPEN: 'باز',
    IN_PROGRESS: 'در حال بررسی',
    ANSWERED: 'پاسخ داده شده',
    CLOSED: 'بسته شده'
  };

  const priorityFa = {
    LOW: 'کم',
    MEDIUM: 'متوسط',
    HIGH: 'زیاد'
  };

  const handleUpdateStatus = () => {
    startTransition(async () => {
      const res = await updateTicketStatusAction(ticket.id, selectedStatus);
      if (res.success) {
       toast.success("وضعیت با موفقیت تغییر کرد")
      } else {
        alert("خطا در تغییر وضعیت");
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* ----------------- هدر اصلی تیکت ----------------- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            {ticket.subject}
          </h1>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
            ID: #{ticket.id.slice(-6).toUpperCase()}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <span className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 ${
            ticket.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
            ticket.status === 'CLOSED' ? 'bg-slate-100 text-red-600' : 
            'bg-blue-100 text-blue-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            وضعیت فعلی: {statusFa[ticket.status as keyof typeof statusFa]}
          </span>
          <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full font-medium">
            اولویت: {priorityFa[ticket.priority as keyof typeof priorityFa]}
          </span>
        </div>
      </div>

      {/* ----------------- اطلاعات کاربر و تنظیمات (گرید دو ستونه) ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* اطلاعات کاربر */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            اطلاعات ثبت‌کننده
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg">
              <Phone className="w-4 h-4 text-slate-400" />
              <span dir="ltr" className="font-medium">{ticket.user?.phoneNumber || 'ثبت نشده'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{ticket.user?.email || 'ثبت نشده'}</span>
            </div>
          </div>
        </div>

        {/* تنظیمات تیکت (تغییر وضعیت) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            عملیات تیکت
          </h3>
          <div className="space-y-3">
            <label className="text-sm text-slate-600 block">تغییر وضعیت تیکت:</label>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {Object.entries(statusFa).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={isPending || selectedStatus === ticket.status}
                className="flex items-center cursor-pointer justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {isPending ? 'در حال ثبت...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ----------------- بخش چت و پیام‌ها ----------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400" />
            تاریخچه گفتگو
          </h2>
        </div>

        {/* لیست پیام‌ها */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
          {ticket.messages.map((msg: any) => {
            const isAdmin = msg.user.role === 'admin';
            return (
              <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col gap-1.5 ${isAdmin ? 'items-start' : 'items-end'}`}>
                  
                  {/* فرستنده */}
                  <div className="flex items-center gap-2 text-xs font-semibold px-1">
                    {isAdmin ? (
                      <span className="text-blue-600">شما (پشتیبانی)</span>
                    ) : (
                      <span className="text-emerald-600">کاربر</span>
                    )}
                  </div>
                  
                  {/* حباب پیام */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isAdmin 
                      ? 'bg-blue-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* زمان */}
                  <div className="text-[11px] text-slate-400 px-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleString('fa-IR', { 
                      hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ----------------- فرم پاسخ‌گویی ----------------- */}
        <div className="p-4 bg-white border-t border-slate-200">
          {ticket.status === 'CLOSED' ? (
            <div className="text-center p-4 text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
              این تیکت بسته شده است. برای ارسال پیام جدید، ابتدا وضعیت آن را تغییر دهید.
            </div>
          ) : (
            <form action={formAction} className="flex flex-col gap-3">
                <input type="hidden"  name="ticketId" value={ticket.id} />
              <textarea 
                name="message" 
                rows={4}
                placeholder="متن پاسخ خود را اینجا بنویسید..."
                className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
                required
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200"
                >
                  <Send className="w-4 h-4" />
                  ارسال پاسخ
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
