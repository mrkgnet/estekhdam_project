"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlarmClock,
  ArrowLeft,
  BookOpen,
  CalendarRange,
  ChevronLeft,
  Home,
  Info,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommentManagment from "@/components/comment/CommentManagmet";
import CountdownTimer from "@/components/CountdownTimer";
import RecomendedProduct from "@/components/user/RecomendedProduct";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

// ---------------- Types & Helpers ----------------

export type NewsStatus = 'OPEN' | 'CARD_RECEIVED' | 'RESULTS_ANNOUNCED' | 'NEWS';

type News = {
  id: string;
  title: string;
  status: NewsStatus;
  slugNews: string;
  organization?: string;
  description?: string;
  imageUrl?: string;
  registerUrl: String;
  price?: number;
  maxAge?: number;
  startAt: string;
  endAt: string;
  jobs: string[];
  cities: string[];
  products?: ProductType[];
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  oldPrice?: number;
  newPrice: number;
  imageUrl?: string | null;
};

type RegState = "NOT_STARTED" | "OPEN" | "CLOSING_SOON" | "CLOSED";

const StatusBadge = ({ status }: { status: NewsStatus }) => {
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
      animate: false
    },
    NEWS: {
      text: "فقط خبر",
      color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", dot: "bg-slate-400",
      animate: false
    },
  };

  const current = config[status] || config.NEWS;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${current.bg} ${current.border} shadow-sm`}>
      <span className="relative flex h-2.5 w-2.5">
        {current.animate && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${current.dot}`}></span>
      </span>
      <span className={`text-[11px] font-bold tracking-wide ${current.color}`}>
        {current.text}
      </span>
    </div>
  );
};

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function getRegState(startAt: string, endAt: string): RegState {
  const now = Date.now();
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  if (now < s) return "NOT_STARTED";
  if (now > e) return "CLOSED";
  const hoursLeft = (e - now) / 36e5;
  return hoursLeft <= 48 ? "CLOSING_SOON" : "OPEN";
}

function formatFaDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

function formatToman(amount?: number) {
  if (amount == null) return "نامشخص";
  if (amount === 0) return "رایگان";
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}

// ---------------- Main Component ----------------

export default function ShowData({ initialNews }: { initialNews: News }) {
  const item = initialNews;

  const mounted = useHasMounted();
  const [tab, setTab] = useState("desc");
  const router = useRouter();

  const regState = mounted ? getRegState(item.startAt, item.endAt) : "NOT_STARTED";
  const canRegister = regState === "OPEN" || regState === "CLOSING_SOON";

  const breadcrumbItems = [
    {
      label: 'اخبار استخدامی دولتی',
      href: '/jobnews/government',
    },
    {
      label: item.title,
      href: `/jobnews/government/${item.slugNews}`,
    },
  ];

  return (
    // 🟢 اصلاح ۱: اضافه شدن w-full
    <div className="w-full mx-auto max-w-6xl px-4 md:px-6 lg:px-8 overflow-x-hidden">
      <div>
        <div className="mt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between gap-6 flex-wrap">
            <div className="flex gap-5">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border shadow-sm shrink-0">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover p-1" />
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-extrabold text-slate-800">
                    {item.title}
                  </h1>
                  <StatusBadge status={item.status || 'NEWS'} />
                </div>

                <div className="flex flex-wrap gap-4 text-slate-600">
                  {item.organization && (
                    <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-600" />{item.organization}</span>
                  )}
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-600" />{item.cities?.join("، ") || "سراسری"}</span>
                </div>

                {item.jobs?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.jobs.map((job) => (
                      <span key={job} className="px-3 py-1 text-xs rounded-full bg-slate-100/80 border border-slate-200/50 text-slate-600">{job}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <CountdownTimer endAt={item.endAt} active={canRegister} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <InfoCard icon={<CalendarRange className="w-4 h-4" />} label="شروع ثبت نام" value={formatFaDate(item.startAt)} />
          <InfoCard icon={<CalendarRange className="w-4 h-4" />} label="پایان ثبت نام" value={formatFaDate(item.endAt)} />
          <InfoCard icon={<Wallet className="w-4 h-4" />} label="هزینه" value={formatToman(item.price)} />
          <InfoCard icon={<Info className="w-4 h-4" />} label="شناسه" value={item.id.slice(-6)} />
        </div>

        <div className="grid grid-cols-12 gap-5 mt-6">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* 🟢 اصلاح ۲: اضافه شدن flex-wrap و sm:flex-nowrap */}
            <div className="bg-white border border-slate-200 rounded-3xl p-3 flex flex-wrap sm:flex-nowrap gap-2">
              <button onClick={() => setTab("desc")} className={`w-full lg:w-auto px-4 py-2.5 rounded-xl font-medium transition-colors ${tab === "desc" ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-100"}`}>توضیحات</button>
              <button onClick={() => setTab("jobs")} className={`w-full lg:w-auto px-4 py-2.5 rounded-xl font-medium transition-colors ${tab === "jobs" ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-100"}`}>رشته‌های شغلی</button>
            </div>

            {tab === "desc" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 min-h-[200px]">
                <div className="flex gap-2.5 mb-4 items-center border-b pb-3"><Info className="w-5 h-5 text-slate-400" /><h2 className="font-bold text-slate-800">توضیحات آزمون</h2></div>
                {/* 🟢 اصلاح ۳: اضافه شدن overflow-x-auto و break-words */}
                <div className="leading-8 text-slate-700 prose prose-sm max-w-none overflow-x-auto break-words">



                  {item?.description ? (
                    <div
                      className="prose max-w-none prose-slate"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  ) : (
                    <span className="text-slate-400 italic">
                      توضیحاتی برای این آزمون ثبت نشده است.
                    </span>
                  )}


                </div>
              </div>
            )}

            {tab === "jobs" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 min-h-[200px]">
                <div className="flex gap-2.5 mb-4 items-center border-b pb-3"><BookOpen className="w-5 h-5 text-slate-400" /><h2 className="font-bold text-slate-800">مشاغل مورد نیاز</h2></div>
                <div className="flex flex-wrap gap-2">{item.jobs.map((job) => (<span key={job} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-700">{job}</span>))}</div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-4">
                {item.registerUrl ? (
                  <Link target="_blank" rel="noopener noreferrer" href={item.registerUrl.toString()} className="w-full block text-white bg-emerald-600 py-3 rounded-xl text-center font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 duration-300">
                    ثبت نام در آزمون
                  </Link>
                ) : (
                  <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl text-center">لینک ثبت‌نام موجود نیست</div>
                )}
              </div>
              {item.maxAge && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-2.5 text-amber-800 font-bold"><AlarmClock className="w-5 h-5" />محدودیت سنی</div>
                  <p className="mt-2 text-amber-900">حداکثر سن مجاز برای ثبت‌نام <span className="font-black">{item.maxAge}</span> سال می‌باشد.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          {item.products && item.products.length > 0 && (
            <section className="mt-8">
              <RecomendedProduct
                title="منابع مطالعاتی مرتبط"
                products={item.products}
                slug={item.slugNews}
              />
            </section>
          )}
        </div>

       
        <CommentManagment targetId={item.id} targetType="governmentNews" />

      </div>
    </div>
  );
}
