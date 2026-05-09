import React, { ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Layers } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbItems: { label: string; href: string }[];
  icon?: ReactNode;
  children?: ReactNode; // برای قرار دادن سرچ‌باکس یا دکمه‌های فیلتر
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbItems,
  icon,
  children,
}: PageHeaderProps) {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        {/* Accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-red-400 via-red-200 to-transparent" />

        <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title + Icon */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-50 to-white shadow-sm ring-1 ring-red-200/60">
              {icon || (
                <Layers
                  className="h-6 w-6 sm:h-7 sm:w-7 text-red-600"
                  strokeWidth={1.8}
                />
              )}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-red-500/10 pointer-events-none" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="flex items-baseline gap-x-2  text-15 md:text-17 font-bold  tracking-tight text-slate-600">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {children && (
            <div className="w-full md:w-[360px] lg:w-[440px] shrink-0">
              <div className="rounded bg-white  p-2">
                {children}
              </div>
            </div>
          )}
        </div>

        {/* subtle background highlight */}
        <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
      </div>
    </header>
  );
}
