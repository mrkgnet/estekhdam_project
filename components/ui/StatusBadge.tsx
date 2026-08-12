import React from 'react';

export type NewsStatus = 'OPEN' | 'CARD_RECEIVED' | 'RESULTS_ANNOUNCED' | 'NEWS';

export default function StatusBadge({ status }: { status: NewsStatus }) {
  const config = {
    OPEN: {
      text: "در حال ثبت‌نام",
      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500",
      animate: true
    },
    CARD_RECEIVED: {
      text: "دریافت کارت",
      color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500",
      animate: true
    },
    RESULTS_ANNOUNCED: {
      text: "اعلام نتایج",
      color: "text-fuchsia-700", bg: "bg-fuchsia-50", border: "border-fuchsia-200", dot: "bg-fuchsia-500",
      animate: true
    },
    NEWS: {
      text: "در انتظار نتایج",
      color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", dot: "bg-slate-400",
      animate: true
    },
  };

  const current = config[status] || config.NEWS;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl border ${current.bg} ${current.border} w-fit`}>
      <span className="relative flex h-2 w-2">
        {current.animate && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span className={`text-[10px] tracking-wide ${current.color}`}>
        {current.text}
      </span>
    </div>
  );
}
