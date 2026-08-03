import React, { Suspense } from 'react'
import DataFetcher from './TabHomeFetchData'

type Props = {
  searchParams?: Promise<{ category?: string }>
}

function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm bg-white/10">
      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
        .dot-blink {
          width: 10px;
          height: 10px;
          margin: 0 4px;
          background-color: #2563eb;
          border-radius: 50%;
          display: inline-block;
          animation: blink 1.2s ease-in-out infinite;
        }
        .dot-blink:nth-child(1) {
          animation-delay: 0s;
        }
        .dot-blink:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot-blink:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="flex items-center">
        <span className="dot-blink" />
        <span className="dot-blink" />
        <span className="dot-blink" />
      </div>

      <span className="text-sm sm:text-base font-semibold text-bule-900 mt-6">
        در حال دریافت اطلاعات...
      </span>
    </div>
  )
}

export default async function TabHomeComponent({ searchParams }: Props) {

  const resolvedParams = searchParams ? await searchParams : {}
  const category = resolvedParams.category || 'بانک-سوالات'

  return (
    <Suspense key={category} fallback={<FullPageLoader />}>
      <DataFetcher category={category} />
    </Suspense>
  )
}
