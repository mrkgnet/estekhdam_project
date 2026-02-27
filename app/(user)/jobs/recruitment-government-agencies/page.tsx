"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import FiltersSidebar, { FiltersValue, StatusKey } from "@/components/FiltersSidebar";
import { AlarmClock, CalendarRange, MapPin, Wallet, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";

// --- Types ---
type Item = {
  id: number;
  title: string;
  slug:string
  organization?: string;
  region: string;
  status: StatusKey;
  startAt: string; // ISO
  endAt: string; // ISO
  fee?: number; // تومان
  registerUrl?: string;
  resourcesUrl?: string;
  brandLogo?: string; // /images/.. یا URL
  tags?: string[];
};

type RegState = "NOT_STARTED" | "OPEN" | "CLOSING_SOON" | "CLOSED";

// --- Data ---
const DATA: Item[] = [
  {
    id: 1,
    title: "آزمون آموزش و پرورش ۱۴۰۳",
    slug:"azmoon-amoozesh-parvaresh-1403",
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
  },
  {
    id: 2,
    title: "بانک‌ها - مرحله دوم",
    slug:"bankin-dovom",
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
  },
  {
    id: 3,
    title: "دستگاه اجرایی - اطلاعیه",
    slug:"ejraee-info",
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
  },
];

// --- Helpers ---

// هوک برای حل مشکل Hydration
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

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

// --- Components ---

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
    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-500 px-3 py-2 text-white">
      <AlarmClock className="h-4 w-4 opacity-90" />

      {t.done ? (
        <span className="text-xs ">پایان یافت</span>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs  opacity-80">تا پایان:</span>
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

function StatusAlarm({ startAt, endAt }: { startAt: string; endAt: string }) {
  const mounted = useHasMounted();
  const [state, setState] = useState<RegState>("NOT_STARTED");

  useEffect(() => {
    if (!mounted) return;

    // یکبار بلافاصله ست کن
    setState(getRegState(startAt, endAt));

    // اگر بازه نزدیک پایان شد، با هر دقیقه رفرش کنیم (کافیه)
    const id = setInterval(() => {
      setState(getRegState(startAt, endAt));
    }, 60_000);

    return () => clearInterval(id);
  }, [mounted, startAt, endAt]);

  if (!mounted) return null;

  const map: Record<RegState, { label: string; dot: string; pill: string }> = {
    OPEN: {
      label: "ثبت‌نام باز",
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    CLOSING_SOON: {
      label: "نزدیک پایان",
      dot: "bg-amber-500",
      pill: "bg-amber-50 text-amber-800 ring-amber-200",
    },
    NOT_STARTED: {
      label: "هنوز شروع نشده",
      dot: "bg-slate-400",
      pill: "bg-slate-50 text-slate-700 ring-slate-200",
    },
    CLOSED: {
      label: "پایان یافته",
      dot: "bg-rose-500",
      pill: "bg-rose-50 text-rose-700 ring-rose-200",
    },
  };

  const b = map[state];
  const shouldBlink = state === "OPEN" || state === "CLOSING_SOON";

  return (
    <span className={["inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs  ring-1", b.pill].join(" ")}>
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {shouldBlink ? (
          <span className={`absolute inline-flex h-full w-full rounded-full ${b.dot} opacity-30 animate-ping`} />
        ) : null}
        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${b.dot} ${shouldBlink ? "animate-pulse" : ""}`} />
      </span>
      {b.label}
    </span>
  );
}

function BrandLogo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {src ? (
        <Image src={src} alt={alt} fill className="object-contain p-2" />
      ) : (
        <div className="h-full w-full bg-slate-50" />
      )}
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-700">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm  text-slate-900">{value}</p>
    </div>
  );
}

export default function Page() {
  const [filters, setFilters] = useState<FiltersValue>({
    regions: [],
    statuses: [],
  });


  // بستن خودکار فیلترها در حالت موبایل
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileFiltersOpen(false); // lg
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mounted = useHasMounted();

  const filtered = useMemo(() => {
    return DATA.filter((x) => {
      const okRegion = filters.regions.length === 0 ? true : filters.regions.includes(x.region);
      const okStatus = filters.statuses.length === 0 ? true : filters.statuses.includes(x.status);
      return okRegion && okStatus;
    });
  }, [filters]);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Sidebar filters */}
      <div className="col-span-12 lg:col-span-3">
        {/* Mobile: toggle button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold"
          >
            {mobileFiltersOpen ? "بستن فیلترها" : "نمایش فیلترها"}
          </button>

          <div className={mobileFiltersOpen ? "mt-3" : "hidden"}>
            <FiltersSidebar value={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Desktop: always open */}
        <div className="hidden lg:block">
          <FiltersSidebar value={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Results */}
      <div className="col-span-12 lg:col-span-9">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 mb-4">
          <p className="text-sm text-slate-600">
            تعداد نتایج: <span className=" text-slate-900">{filtered.length.toLocaleString("fa-IR")}</span>
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((x) => {
            const regState = mounted ? getRegState(x.startAt, x.endAt) : "NOT_STARTED";
            const canRegister = regState === "OPEN" || regState === "CLOSING_SOON";

            return (
              <div
                key={x.id}
                className="rounded-3xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {/* Top bar */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <BrandLogo src={x.brandLogo} alt={x.organization ?? x.title} />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-extrabold text-slate-900">{x.title}</p>
                        <StatusAlarm startAt={x.startAt} endAt={x.endAt} />
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {x.organization ? `${x.organization} • ` : ""}
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {x.region}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="mt-1">
                    <CountdownTimer endAt={x.endAt} active={canRegister} />
                  </div>
                </div>

                {/* Info grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <InfoChip
                    icon={<CalendarRange className="h-4 w-4" />}
                    label="شروع ثبت‌نام"
                    value={formatFaDate(x.startAt)}
                  />
                  <InfoChip
                    icon={<CalendarRange className="h-4 w-4" />}
                    label="پایان ثبت‌نام"
                    value={formatFaDate(x.endAt)}
                  />
                  <InfoChip icon={<Wallet className="h-4 w-4" />} label="هزینه ثبت‌نام" value={formatToman(x.fee)} />
                  <InfoChip icon={<AlarmClock className="h-4 w-4" />} label="وضعیت (کُد)" value={x.status} />
                </div>

                {/* Tags */}
                {x.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {x.tags.map((t) => (
                      <span key={t} className="rounded-full bg-slate-900/5 px-3 py-1 text-xs  text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Actions */}
                <div className="mt-4 hidden sm:flex items-center gap-2 justify-end">
                  <Link
                    href={x.resourcesUrl ?? "#"}
                    className={[
                      "inline-flex bg-lime-300 items-center gap-2 rounded-2xl border px-3 py-2 text-sm ",
                      x.resourcesUrl
                        ? "border-slate-200 hover:bg-slate-50"
                        : "border-slate-100 text-slate-300 pointer-events-none",
                    ].join(" ")}
                  >
                    <BookOpen className="h-4 w-4" />
                    منابع
                  </Link>

                  <Link
                    href={`/jobs/recruitment-government-agencies/${x.slug}`}
                    className={[
                      "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ",
                       x.registerUrl
                        ? "bg-green-600 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 pointer-events-none",
                    ].join(" ")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    ثبت نام | مشاهده جزئیات
                  </Link>
                </div>

                {/* Bottom actions (mobile) */}
                <div className="mt-4 flex sm:hidden flex-col gap-2">
                  <Link
                    href={x.resourcesUrl ?? "#"}
                    className={[
                      "inline-flex bg-red-400 items-center  justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold",
                      x.resourcesUrl
                        ? "border-slate-200 hover:bg-slate-50"
                        : "border-slate-100 text-slate-300 pointer-events-none",
                    ].join(" ")}
                  >
                    <BookOpen className="h-4 w-4" />
                    مشاهده منابع
                  </Link>

                  <Link
                    href={x.registerUrl ?? "#"}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold",
                      canRegister && x.registerUrl
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 pointer-events-none",
                    ].join(" ")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    ثبت‌نام
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
