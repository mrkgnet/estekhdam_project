"use client";

import { useState, useEffect } from "react";
import { AlarmClock } from "lucide-react";

// ---------------- Helpers ----------------

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

function getCountdown(endAt?: string | null) {
  if (!endAt) return { done: true, days: 0, h: 0, m: 0, s: 0 };
  
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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[45px] rounded-xl px-2 py-1.5 text-center">
      <div className="text-sm font-extrabold tabular-nums">{value}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  );
}

// ---------------- Main Component ----------------

interface CountdownTimerProps {
  endAt?: string | null;
  active?: boolean;
}

export default function CountdownTimer({ endAt, active = true }: CountdownTimerProps) {
  const mounted = useHasMounted();
  const [t, setT] = useState(() => getCountdown(endAt));

  useEffect(() => {
    if (!active || !mounted || !endAt) return;

    const id = setInterval(() => setT(getCountdown(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt, active, mounted]);

  if (!mounted || !active || !endAt) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-black   ">
      <AlarmClock className="h-4 w-4 opacity-90" />
      {t.done ? (
        <span className="text-xs font-bold text-rose-500 border p-2 rounded-full border-red-400">زمان ثبت پایان یافت </span>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs opacity-80">تا پایان:</span>
          <div className="flex items-center gap-1.5">
            <span className="border rounded-2xl border-gray-200 bg-gray-50">
              <TimeBox label="روز" value={t.days.toLocaleString("fa-IR")} />
            </span>
            <span className="border rounded-2xl border-gray-200 bg-gray-50">
              <TimeBox label="ساعت" value={pad2(t.h)} />
            </span>
            <span className="border rounded-2xl border-gray-200 bg-gray-50">
              <TimeBox label="دقیقه" value={pad2(t.m)} />
            </span>
            <span className="border rounded-2xl border-gray-200 bg-gray-50 text-emerald-600">
              <TimeBox label="ثانیه" value={pad2(t.s)} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
