// مسیر فرضی: (admin-dashboard)/support/ShowDataTA.tsx
"use client";
import React from 'react'
import Link from 'next/link'

// تایپ فرضی برای راحتی کار (می‌توانید دقیق‌تر بنویسید)
type TicketProps = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
  _count: {
    messages: number;
  };
};

export default function ShowDataTA({ response }: { response: any }) {
  const tickets: TicketProps[] = response;

  if (!tickets || tickets.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center text-slate-500">
        هیچ تیکتی برای نمایش وجود ندارد.
      </div>
    );
  }

  // تابعی برای ترجمه وضعیت تیکت
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">باز (جدید)</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">در حال بررسی</span>;
      case 'ANSWERED': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs">پاسخ داده شده</span>;
      case 'CLOSED': return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">بسته شده</span>;
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">لیست تیکت‌های پشتیبانی</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">موضوع</th>
              <th className="p-4 font-medium">کاربر</th>
              <th className="p-4 font-medium">وضعیت</th>
              <th className="p-4 font-medium">اولویت</th>
              <th className="p-4 font-medium">تاریخ ثبت</th>
              <th className="p-4 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">
                  {ticket.subject}
                  <span className="text-xs text-slate-400 mr-2">
                    ({ticket._count.messages} پیام)
                  </span>
                </td>
                <td className="p-4 text-slate-600">
                  {ticket.user?.name || 'بدون نام'} <br/>
                  <span className="text-xs text-slate-400">{ticket.user?.email}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(ticket.status)}
                </td>
                <td className="p-4 text-slate-600">
                  {ticket.priority}
                </td>
                <td className="p-4 text-slate-500 text-xs">
                  {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="p-4">
                  <Link 
                    href={`/adminp/support/tickets/${ticket.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    مشاهده / پاسخ
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
