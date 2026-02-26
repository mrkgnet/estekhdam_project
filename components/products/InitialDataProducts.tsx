"use client";

import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { FetchedProducts } from "@/actions/get_products";
import { Search, Check, ArrowUpLeft } from "lucide-react";

// Utils
function formatToman(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function normalizeImageUrl(url: string) {
  return url
    .replace(/[?&]versionId=(?=&|$)/, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function InitialDataProducts({ products }: { products: FetchedProducts }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // debounce برای پرفورمنس بهتر
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const title = (p.title ?? "").toLowerCase();
      const features = (p.features ?? []).join(" ").toLowerCase();
      return title.includes(q) || features.includes(q);
    });
  }, [products, debouncedQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8" dir="rtl">

      {/* Search Bar */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو بین محصولات..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          {filtered.length} محصول یافت شد
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => (
          <AccountCard key={p.id} p={p} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">موردی پیدا نشد</h3>
          <p className="mt-1 text-sm text-zinc-600">
            عبارت جستجو را تغییر دهید.
          </p>
        </div>
      )}
    </div>
  );
}

// Card
function AccountCard({ p }: { p: FetchedProducts[0] }) {
  const raw = p.images?.[0];
  const imageUrl = raw ? normalizeImageUrl(raw) : "/images/placeholder.png";

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${p.slug}`} className="relative block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
          <Image
            src={imageUrl}
            alt={p.title}
            unoptimized
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${p.slug}`} className="block">
          <h3 className="text-sm font-semibold leading-7 text-zinc-900 line-clamp-2">
            {p.title}
          </h3>
        </Link>

        <ul className="mt-3 space-y-2 text-xs text-zinc-700">
          {(p.features ?? []).slice(0, 3).map((x) => (
            <li key={x} className="flex items-start gap-2">
              <Check className="h-3 w-3 text-emerald-600 mt-0.5" />
              <span className="line-clamp-1">{x}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-zinc-500">قیمت</div>
            <div className="text-sm font-bold text-zinc-900">
              {formatToman(p.price)}{" "}
              <span className="text-xs text-zinc-500">تومان</span>
            </div>
          </div>

          <Link
            href={`/products/${p.slug}`}
            className="inline-flex h-9 items-center gap-2 rounded-2xl bg-zinc-900 px-4 text-sm text-white transition hover:bg-zinc-950"
          >
            مشاهده
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
