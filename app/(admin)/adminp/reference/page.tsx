
import React, { Suspense } from "react";

import ReferencePage from "./ShowData";
import type { FormattedReferenceItem } from "./ShowData";

import { getQuestionReferences } from "@/actions/admin/reference_question/Actions";

export const dynamic = "force-dynamic";

// ============================================
// Server Data Loader
// ============================================

async function ReferenceDataLoader() {
  const result = await getQuestionReferences(1, 100);

  const formattedReferences: FormattedReferenceItem[] = (
    result.references || []
  ).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    isActive: item.isActive,
    questionCount: item._count?.questions ?? 0,
    createdAt: new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(new Date(item.createdAt)),
  }));

  return (
    <ReferencePage
      initialData={formattedReferences}
      initialError={
        result.error
          ? "دریافت اطلاعات با مشکل مواجه شد. صفحه را مجدداً بارگذاری کنید."
          : null
      }
    />
  );
}

// ============================================
// Initial Loading Skeleton
// ============================================

function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
    />
  );
}

function ReferenceTableSkeleton() {
  return (
    <div
      dir="rtl"
      role="status"
      aria-label="در حال بارگذاری رفرنس‌ها"
      className="mx-auto min-h-screen max-w-[1600px] p-4 text-slate-800 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-7 w-52" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>

        <SkeletonBlock className="h-11 w-40" />
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <SkeletonBlock className="mb-4 h-4 w-24" />
            <SkeletonBlock className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-3 border-b border-slate-200 p-4">
          <SkeletonBlock className="h-10 w-full max-w-sm" />
          <SkeletonBlock className="h-10 w-36" />
        </div>

        <div className="overflow-hidden">
          <div className="h-12 bg-slate-50" />

          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex h-[68px] items-center gap-6 px-5"
              >
                <SkeletonBlock className="h-4 w-8 shrink-0" />
                <SkeletonBlock className="h-4 w-44 shrink-0" />
                <SkeletonBlock className="h-4 w-28 shrink-0" />
                <SkeletonBlock className="h-6 w-16 shrink-0" />
                <SkeletonBlock className="h-6 w-16 shrink-0" />
                <SkeletonBlock className="h-4 w-24 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">
        لطفاً تا بارگذاری اطلاعات صبر کنید.
      </span>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50/70">
      <Suspense fallback={<ReferenceTableSkeleton />}>
        <ReferenceDataLoader />
      </Suspense>
    </main>
  );
}
