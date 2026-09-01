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
      <div className="mb-3">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-600 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
        {/* Accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-red-300 to-transparent" />

        <div className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title + Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-red-50 to-white dark:from-red-950/60 dark:to-slate-800 shadow-sm ring-1 ring-red-300 dark:ring-red-700/60">
              {icon || (
                <Layers
                  className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400"
                  strokeWidth={1.8}
                />
              )}
              <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-1 ring-red-500/10 pointer-events-none" />
            </div>

            <div className="flex flex-col gap-0.5">
              <h1 className="flex items-baseline gap-x-2 text-sm md:text-base font-bold tracking-tight text-slate-700 dark:text-slate-200">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {children && (
            <div className="w-full md:w-[320px] lg:w-[400px] shrink-0">
              <div className="rounded-md bg-transparent p-1">
                {children}
              </div>
            </div>
          )}
        </div>

        {/* subtle background highlight */}
        <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-red-200/30 dark:bg-red-500/10 blur-3xl pointer-events-none" />
      </div>
    </header>
  );
}