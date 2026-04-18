// components/dashboard/ProfileCompletion.tsx
import Link from "next/link";
import { CheckCircle2, UserCircle } from "lucide-react";

export default function ProfileCompletion() {
  const percent = 70;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-extrabold text-slate-900">تکمیل پروفایل</div>
          <div className="text-sm text-slate-500 mt-1">
            برای تجربه بهتر، اطلاعاتت رو کامل کن.
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <UserCircle size={18} />
        </div>
      </div>

  

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle2 size={16} className="text-emerald-600" />
          تایید شماره موبایل
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle2 size={16} className="text-emerald-600" />
          افزودن ایمیل
        </div>
        
      </div>

      <Link
        href="/ddashboard/profile"
        className="mt-5 h-11 rounded-2xl border border-slate-200 hover:bg-slate-50 transition
                   flex items-center justify-center font-extrabold text-slate-800"
      >
        تکمیل پروفایل
      </Link>
    </section>
  );
}