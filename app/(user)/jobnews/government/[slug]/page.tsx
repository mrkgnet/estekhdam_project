import React, { Suspense } from 'react'
import FetchData from './FetchData'
import LinearLoader from '@/components/LinearLoader'





function SkeletonShowData() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="mx-auto max-w-6xl px-4 py-6">

        {/* Breadcrumb Skeleton */}
        <div className="h-14 rounded-3xl bg-white border mb-1.5 w-full"></div>

        {/* Hero Section Skeleton */}
        <div className="rounded-3xl bg-white border p-6 my-1.5">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-4 w-full lg:w-1/2">
              {/* Image box */}
              <div className="h-16 w-16 rounded-2xl bg-slate-200 shrink-0"></div>

              <div className="space-y-3 w-full">
                {/* Title */}
                <div className="h-6 bg-slate-200 rounded-md w-3/4 md:w-1/2"></div>

                {/* Organization & Location */}
                <div className="flex gap-3">
                  <div className="h-4 bg-slate-200 rounded-md w-24"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-20"></div>
                </div>

                {/* Job Pills */}
                <div className="flex gap-2 mt-3">
                  <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Timer Skeleton */}
            <div className="h-12 w-full lg:w-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>

        {/* 4 Info Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4">
              <div className="h-4 w-1/2 bg-slate-200 rounded-md mb-3"></div>
              <div className="h-5 w-3/4 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Main Grid: Content & Sidebar */}
        <div className="grid grid-cols-12 gap-4 mt-6">

          {/* Main Area (8 cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Tabs */}
            <div className="bg-white border rounded-3xl p-3 flex gap-2">
              <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
              <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
            </div>

            {/* Description Box */}
            <div className="bg-white border rounded-3xl p-6 space-y-4">
              <div className="h-6 w-1/3 bg-slate-200 rounded-md mb-6"></div>
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-4/6 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            </div>
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-3">
            {/* Register Button Box */}
            <div className="bg-white border rounded-3xl p-4">
              <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
            </div>

            {/* Max Age Warning Box */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 space-y-3">
              <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
            </div>
          </div>

        </div>

        {/* Comment Section Skeleton Placeholder */}
        <div className="mt-8 bg-white border rounded-3xl p-6 h-40 flex flex-col gap-4">
          <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
          <div className="h-20 w-full bg-slate-200 rounded-xl"></div>
        </div>

      </div>

      {/* Mobile Bottom CTA Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:hidden">
        <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}




export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

 const decodedSlug = decodeURIComponent(slug);
 console.log(decodedSlug)
  return (


    <Suspense fallback={<SkeletonShowData />}>
      <FetchData slug={decodedSlug} />
    </Suspense>
  )
}
