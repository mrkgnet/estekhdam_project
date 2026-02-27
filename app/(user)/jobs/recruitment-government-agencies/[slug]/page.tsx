"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  AlarmClock,
  BookOpen,
  CalendarRange,
  Download,
  ExternalLink,
  Info,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
  Wallet,
  CheckCircle2,
  Circle,
} from "lucide-react";

/**
 * ✅ صفحه جزئیات آزمون (Modern / Responsive / Client)
 * - گرفتن slug با useParams (سازگار با Next جدید)
 * - عدم استفاده از params در آرگومان Page
 */

// ---------------- Types ----------------
type StatusKey = "REGISTERING" | "WAITING_RESULTS" | "NEWS" | "CLOSED";

type Item = {
  id: number;
  title: string;
  slug: string;
  organization?: string;
  region: string;
  status: StatusKey;
  startAt: string;
  endAt: string;
  fee?: number;
  registerUrl?: string;
  resourcesUrl?: string;
  brandLogo?: string;
  tags?: string[];

  description?: string;
  generalRequirements?: string[];
  specialRequirements?: string[];
  requiredDocs?: string[];
  resources?: { title: string; url: string }[];
  downloads?: { title: string; url: string; meta?: string }[];
  timeline?: { title: string; date?: string; done?: boolean }[];
  faq?: { q: string; a: string }[];
};

// ---------------- Mock Data ----------------
const DATA: Item[] = [
  {
    id: 1,
    title: "آزمون آموزش و پرورش ۱۴۰۳",
    slug: "azmoon-amoozesh-parvaresh-1403",
    organization: "وزارت آموزش و پرورش",
    region: "تهران",
    status: "REGISTERING",
    startAt: "2026-02-10T00:00:00+03:30",
    endAt: "2026-02-25T23:59:00+03:30",
    fee: 280000,
    registerUrl: "#",
    resourcesUrl: "#",
    brandLogo: "/images/image.png",
    tags: ["دبیری", "آموزگار"],
    description:
      "این آزمون با هدف جذب نیرو در رسته‌های دبیری و آموزگاری برگزار می‌شود. لطفاً پیش از اقدام به ثبت‌نام دفترچه راهنما و شرایط عمومی/اختصاصی را با دقت مطالعه کنید.",
    generalRequirements: ["تابعیت جمهوری اسلامی ایران", "عدم سوء پیشینه مؤثر", "پایان خدمت یا معافیت (برای آقایان)"],
    specialRequirements: ["دارا بودن مدرک مرتبط با رشته شغلی", "حداقل معدل مطابق دفترچه", "شرایط سنی مطابق دفترچه"],
    requiredDocs: ["عکس پرسنلی ۳×۴", "تصویر کارت ملی", "تصویر شناسنامه", "مدرک تحصیلی"],
    resources: [
      { title: "منابع عمومی", url: "#" },
      { title: "نمونه سوالات سال‌های قبل", url: "#" },
    ],
    downloads: [
      { title: "دفترچه راهنمای آزمون", url: "#", meta: "PDF • 3.2MB" },
      { title: "اصلاحیه شماره ۱", url: "#", meta: "PDF • 0.9MB" },
    ],
    timeline: [
      { title: "شروع ثبت‌نام", date: "۱۴۰۴/۱۱/۲۱", done: true },
      { title: "پایان ثبت‌نام", date: "۱۴۰۴/۱۲/۰۶", done: false },
      { title: "دریافت کارت ورود به جلسه", date: "۱۴۰۴/۱۲/۱۵", done: false },
      { title: "آزمون کتبی", date: "۱۴۰۴/۱۲/۲۰", done: false },
      { title: "اعلام نتایج", date: "۱۴۰۵/۰۱/۱۰", done: false },
    ],
    faq: [
      {
        q: "اگر پرداخت ناموفق باشد چه کار کنم؟",
        a: "مجدداً از بخش سوابق پرداخت اقدام کنید یا پس از ۲۴ ساعت بررسی نمایید.",
      },
      {
        q: "امکان ویرایش اطلاعات بعد از ثبت‌نام هست؟",
        a: "بسته به سامانه ثبت‌نام، معمولاً تا پایان مهلت ثبت‌نام امکان ویرایش وجود دارد.",
      },
    ],
  },
  {
    id: 2,
    title: "بانک‌ها - مرحله دوم",
    slug: "bankin-dovom",
    organization: "بانک ملی",
    region: "اصفهان",
    status: "WAITING_RESULTS",
    startAt: "2026-01-05T00:00:00+03:30",
    endAt: "2026-01-15T23:59:00+03:30",
    fee: 350000,
    registerUrl: "#",
    resourcesUrl: "#",
    brandLogo: "/images/brands/bank.png",
    tags: ["اداری", "مالی"],
    description:
      "مرحله دوم فرآیند جذب بانک‌ها شامل بررسی مدارک، آزمون/مصاحبه و اعلام نتایج است. اطلاعیه‌ها را به‌صورت مرتب دنبال کنید.",
    downloads: [{ title: "اطلاعیه مرحله دوم", url: "#", meta: "PDF • 1.1MB" }],
    timeline: [
      { title: "ثبت‌نام", date: "۱۴۰۴/۱۰/۱۵", done: true },
      { title: "پایان ثبت‌نام", date: "۱۴۰۴/۱۰/۲۵", done: true },
      { title: "اعلام نتایج مرحله دوم", date: "۱۴۰۴/۱۱/۰۵", done: false },
    ],
    faq: [{ q: "نتایج از کجا اعلام می‌شود؟", a: "از طریق سایت رسمی بانک و سامانه استخدامی مربوطه." }],
  },
  {
    id: 3,
    title: "دستگاه اجرایی - اطلاعیه",
    slug: "ejraee-info",
    organization: "سازمان اداری استخدامی",
    region: "خراسان رضوی",
    status: "NEWS",
    startAt: "2026-03-01T00:00:00+03:30",
    endAt: "2026-03-10T23:59:00+03:30",
    fee: 0,
    registerUrl: "#",
    resourcesUrl: "#",
    brandLogo: "/images/brands/gov.png",
    tags: ["کارشناس", "عمومی"],
    description: "این صفحه شامل آخرین اطلاعیه‌ها و آپدیت‌های مربوط به آزمون دستگاه‌های اجرایی است.",
    downloads: [{ title: "اطلاعیه جدید", url: "#", meta: "PDF • 0.6MB" }],
  },
];

// ---------------- Helpers ----------------
function useHasMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

type RegState = "NOT_STARTED" | "OPEN" | "CLOSING_SOON" | "CLOSED";

function getRegState(startAt: string, endAt: string): RegState {
  const now = Date.now();
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();

  if (now < s) return "NOT_STARTED";
  if (now > e) return "CLOSED";

  const hoursLeft = (e - now) / 36e5;
  if (hoursLeft <= 48) return "CLOSING_SOON";
  return "OPEN";
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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function getCountdown(endAt: string) {
  const now = Date.now();
  const end = new Date(endAt).getTime();
  const diff = end - now;

  if (diff <= 0) return { done: true, days: 0, h: 0, m: 0, s: 0 };

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const rest = totalSeconds - days * 24 * 3600;
  const h = Math.floor(rest / 3600);
  const m = Math.floor((rest % 3600) / 60);
  const s = rest % 60;

  return { done: false, days, h, m, s };
}

function statusBadge(regState: RegState) {
  switch (regState) {
    case "OPEN":
      return {
        label: "ثبت‌نام باز",
        cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dot: "bg-emerald-500",
      };
    case "CLOSING_SOON":
      return {
        label: "نزدیک پایان",
        cls: "bg-amber-50 text-amber-800 ring-amber-200",
        dot: "bg-amber-500",
      };
    case "NOT_STARTED":
      return {
        label: "هنوز شروع نشده",
        cls: "bg-slate-50 text-slate-700 ring-slate-200",
        dot: "bg-slate-400",
      };
    case "CLOSED":
    default:
      return {
        label: "پایان یافته",
        cls: "bg-rose-50 text-rose-700 ring-rose-200",
        dot: "bg-rose-500",
      };
  }
}

// ---------------- UI Bits ----------------
function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[56px] rounded-xl bg-white/10 px-2 py-1.5 text-center">
      <div className="text-sm font-extrabold tabular-nums">{value}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  );
}

function CountdownTimer({ endAt, active }: { endAt: string; active: boolean }) {
  const mounted = useHasMounted();
  const [t, setT] = useState(() => getCountdown(endAt));

  useEffect(() => {
    if (!active || !mounted) return;
    const id = setInterval(() => setT(getCountdown(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt, active, mounted]);

  if (!mounted || !active) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/85 px-3 py-2 text-white">
      <AlarmClock className="h-4 w-4 opacity-90" />
      {t.done ? (
        <span className="text-xs">پایان یافت</span>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-80">تا پایان:</span>
          <div className="flex items-center gap-1.5">
            <TimeBox label="روز" value={t.days.toLocaleString("fa-IR")} />
            <TimeBox label="ساعت" value={pad2(t.h)} />
            <TimeBox label="دقیقه" value={pad2(t.m)} />
            <TimeBox label="ثانیه" value={pad2(t.s)} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function SectionTitle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={it.q} className="rounded-3xl border border-slate-100 bg-white">
            <button
              type="button"
              className="w-full px-4 py-4 text-right flex items-center justify-between gap-3"
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              <span className="text-sm font-extrabold text-slate-900">{it.q}</span>
              <span className="text-slate-400">{isOpen ? "—" : "+"}</span>
            </button>
            {isOpen ? <div className="px-4 pb-4 text-sm text-slate-600 leading-7">{it.a}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={[
              "rounded-2xl px-4 py-2 text-sm font-extrabold border transition",
              active
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Page ----------------
export default function Page() {
  // ✅ Next جدید: در Client صفحه، params رو از useParams بگیر
  const params = useParams<{ slug: string }>();

  const slug = useMemo(() => {
    const raw = params?.slug ?? "";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params?.slug]);

  const item = useMemo(() => DATA.find((x) => x.slug === slug), [slug]);

  if (!item) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-rose-800">
          آزمون موردنظر پیدا نشد. <span className="text-xs">(slug: {slug || "—"})</span>
          <div className="mt-2">
            <Link className="underline font-extrabold" href="/jobs/recruitment-government-agencies">
              بازگشت
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mounted = useHasMounted();
  const regState = mounted ? getRegState(item.startAt, item.endAt) : "NOT_STARTED";
  const badge = statusBadge(regState);

  const canRegister = regState === "OPEN" || regState === "CLOSING_SOON";
  const [tab, setTab] = useState("desc");

  const tabs = [
    { key: "desc", label: "توضیحات" },
    { key: "req", label: "شرایط" },
    { key: "docs", label: "مدارک لازم" },
    { key: "resources", label: "منابع" },
    { key: "downloads", label: "دانلودها" },
    { key: "faq", label: "سوالات متداول" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-xs text-slate-500">
          <Link href="/jobs/recruitment-government-agencies" className="hover:underline">
            آزمون‌ها
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-slate-700">{item.title}</span>
        </div>

        {/* Hero */}
        <div className="rounded-[28px] border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/6 via-transparent to-emerald-500/8" />
            <div className="relative p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-white">
                    {item.brandLogo ? (
                      <Image src={item.brandLogo} alt={item.title} fill className="object-contain p-2" />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">{item.title}</h1>

                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1",
                          badge.cls,
                        ].join(" ")}
                      >
                        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                          <span
                            className={`absolute inline-flex h-full w-full rounded-full ${badge.dot} opacity-25 animate-ping`}
                          />
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${badge.dot} animate-pulse`} />
                        </span>
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      {item.organization ? (
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4" />
                          {item.organization}
                        </span>
                      ) : null}

                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.region}
                      </span>

                      {item.tags?.length ? (
                        <span className="inline-flex items-center gap-2">
                          {item.tags.slice(0, 3).map((t) => (
                            <span key={t} className="rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-700">
                              {t}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-start lg:items-end gap-3">
                  <CountdownTimer endAt={item.endAt} active={canRegister} />
                </div>
              </div>

              {/* quick info */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <InfoCard
                  icon={<CalendarRange className="h-4 w-4" />}
                  label="شروع ثبت‌نام"
                  value={formatFaDate(item.startAt)}
                />
                <InfoCard
                  icon={<CalendarRange className="h-4 w-4" />}
                  label="پایان ثبت‌نام"
                  value={formatFaDate(item.endAt)}
                />
                <InfoCard icon={<Wallet className="h-4 w-4" />} label="هزینه" value={formatToman(item.fee)} />
                <InfoCard
                  icon={<Info className="h-4 w-4" />}
                  label="شناسه"
                  value={`#${item.id.toString().padStart(3, "0")}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Content */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-4">
              <Tabs tabs={tabs} value={tab} onChange={setTab} />
            </div>

            {tab === "desc" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<Info className="h-5 w-5" />}
                  title="توضیحات آزمون"
                  desc="نمای کلی و نکات مهم قبل از ثبت‌نام"
                />
                <p className="mt-4 text-sm leading-8 text-slate-700">{item.description ?? "توضیحی ثبت نشده است."}</p>
              </div>
            ) : null}

            {tab === "req" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5 space-y-5">
                <SectionTitle icon={<ShieldCheck className="h-5 w-5" />} title="شرایط عمومی و اختصاصی" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-extrabold text-slate-900">شرایط عمومی</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {(item.generalRequirements ?? ["—"]).map((x, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5" />
                          <span className="leading-7">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-extrabold text-slate-900">شرایط اختصاصی</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {(item.specialRequirements ?? ["—"]).map((x, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5" />
                          <span className="leading-7">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "docs" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<BookOpen className="h-5 w-5" />}
                  title="مدارک لازم"
                  desc="قبل از ثبت‌نام آماده کنید"
                />
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {(item.requiredDocs ?? ["—"]).map((x, i) => (
                    <li
                      key={i}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5" />
                      <span className="leading-7">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === "resources" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<BookOpen className="h-5 w-5" />}
                  title="منابع پیشنهادی"
                  desc="برای مطالعه و آمادگی بهتر"
                />
                <div className="mt-4 space-y-2">
                  {(item.resources ?? []).length ? (
                    item.resources!.map((r) => (
                      <a
                        key={r.title}
                        href={r.url}
                        className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white px-4 py-4 hover:bg-slate-50"
                      >
                        <span className="text-sm font-extrabold text-slate-900">{r.title}</span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">منبعی ثبت نشده است.</div>
                  )}
                </div>
              </div>
            ) : null}

            {tab === "downloads" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<Download className="h-5 w-5" />}
                  title="دانلودها"
                  desc="دفترچه‌ها و فایل‌های مرتبط"
                />
                <div className="mt-4 space-y-2">
                  {(item.downloads ?? []).length ? (
                    item.downloads!.map((d) => (
                      <a
                        key={d.title}
                        href={d.url}
                        className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white px-4 py-4 hover:bg-slate-50"
                      >
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">{d.title}</p>
                          {d.meta ? <p className="text-xs text-slate-500 mt-1">{d.meta}</p> : null}
                        </div>
                        <Download className="h-4 w-4 text-slate-400" />
                      </a>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">فایلی برای دانلود ثبت نشده است.</div>
                  )}
                </div>
              </div>
            ) : null}

            {tab === "faq" ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<Info className="h-5 w-5" />}
                  title="سوالات متداول"
                  desc="پاسخ سریع به سوالات پرتکرار"
                />
                <div className="mt-4">
                  {item.faq?.length ? (
                    <Accordion items={item.faq} />
                  ) : (
                    <div className="text-sm text-slate-500">سوالی ثبت نشده است.</div>
                  )}
                </div>
              </div>
            ) : null}

            {item.timeline?.length ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <SectionTitle
                  icon={<AlarmClock className="h-5 w-5" />}
                  title="مسیر و مراحل آزمون"
                  desc="یک نگاه سریع به گام‌های پیش‌رو"
                />
                <div className="mt-4 space-y-3">
                  {item.timeline.map((t, idx) => {
                    const done = !!t.done;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-extrabold text-slate-900">{t.title}</p>
                            {t.date ? <p className="text-xs text-slate-500">{t.date}</p> : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-4 space-y-3">
              <div className="rounded-3xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-extrabold text-slate-900">اقدامات سریع</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href={item.registerUrl ?? "#"}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                      canRegister && item.registerUrl
                        ? "bg-red-600 text-white hover:bg-emerald-700"
                        : "bg-slate-100 text-slate-400 pointer-events-none",
                    ].join(" ")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    ثبت‌نام در آزمون
                  </Link>

                  <Link
                    href={item.resourcesUrl ?? "#"}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold",
                      item.resourcesUrl
                        ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "border-slate-100 text-slate-300 pointer-events-none",
                    ].join(" ")}
                  >
                    {/* 🔥 چراغ چشمک‌زن */}
                    {item.resourcesUrl ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                      </span>
                    ) : null}
                    <BookOpen className="h-4 w-4" />
                    مشاهده منابع
                  </Link>
                </div>
              </div>

              {canRegister ? (
                <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlarmClock className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm font-extrabold">یادآوری</p>
                      <p className="mt-1 text-sm leading-7 opacity-90">
                        اگر قصد ثبت‌نام دارید، بهتر است امروز اقدام کنید تا نزدیک پایان به مشکل پرداخت/ترافیک سایت
                        نخورید.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur p-3 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">آزمون انتخاب‌شده</p>
                <p className="truncate text-sm font-extrabold text-slate-900">{item.title}</p>
              </div>

              <Link
                href={item.registerUrl ?? "#"}
                className={[
                  "inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold",
                  canRegister && item.registerUrl
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-400 pointer-events-none",
                ].join(" ")}
              >
                <ExternalLink className="h-4 w-4" />
                ثبت‌نام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
