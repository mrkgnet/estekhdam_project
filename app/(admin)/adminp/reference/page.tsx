import React, { Suspense } from "react";
import ReferencePage from "./ShowData";
import { getQuestionReferences } from "@/actions/admin/reference_question/Actions";

export const dynamic = "force-dynamic";

// کامپوننت سروری واکشی دیتا جهت استریم با ساسپنس
async function ReferenceDataLoader() {
  const { references } = await getQuestionReferences(1, 100);

  // تبدیل تاریخ به رشته جهت جلوگیری از ارور Serialization
  const formattedReferences = references.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    isActive: item.isActive,
    questionCount: item._count?.questions ?? 0,
    createdAt: new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(new Date(item.createdAt)),
  }));

  return <ReferencePage initialData={formattedReferences} />;
}

// اسکلتون استریمینگ اولیه صفحه
function ReferenceTableSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen text-slate-800 animate-pulse" dir="rtl">
      {/* هدر اسکلتون */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-md" />
          <div className="h-4 w-72 bg-slate-200 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-lg" />
      </div>

      {/* جدول اسکلتون */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="h-12 bg-slate-100 border-b border-slate-200" />
        <div className="divide-y divide-slate-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-white flex items-center px-4 gap-4">
              <div className="h-4 w-8 bg-slate-200 rounded" />
              <div className="h-4 w-44 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-6 w-14 bg-slate-200 rounded-full mx-auto" />
              <div className="h-6 w-16 bg-slate-200 rounded-full mx-auto" />
              <div className="h-4 w-20 bg-slate-200 rounded mx-auto" />
              <div className="h-8 w-24 bg-slate-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<ReferenceTableSkeleton />}>
        <ReferenceDataLoader />
      </Suspense>
    </main>
  );
}