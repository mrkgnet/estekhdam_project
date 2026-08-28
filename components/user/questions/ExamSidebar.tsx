"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  GraduationCap,
  List,
  PlayCircle,
  Filter,
  Edit,
  MessageCircle,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import SendPQComponent from "@/components/user/questions/SendPQComponent";
import { CopyClipBoard } from "@/components/copy-clipboard/CopyClipBoard";
import FontSizeHandler from "@/components/user/questions/FontSizeHandler";

type Chapter = {
  id: string;
  title: string;
  order?: number;
};

interface ExamSidebarProps {
  fontSize: number;
  setFontSize: (val: number) => void;
  mounted: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  commentsRef: React.RefObject<HTMLDivElement | null>;
  questionCode?: string;
  chapters: Chapter[];
  currentChapterId: string | null;
  currentQuestionType: string | null;
  isAnyLoading: boolean;
  getClearFiltersUrl: () => string;
  handleChapterClick: (id: string | null) => void;
  handleTypeClick: (type: string | null) => void;
}

export default function ExamSidebar({
  fontSize,
  setFontSize,
  mounted,
  isDarkMode,
  toggleTheme,
  commentsRef,
  questionCode,
  chapters,
  currentChapterId,
  currentQuestionType,
  isAnyLoading,
  getClearFiltersUrl,
  handleChapterClick,
  handleTypeClick,
}: ExamSidebarProps) {
  const [isChaptersOpen, setIsChaptersOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsChaptersOpen(false);
      setIsTypeOpen(false);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  const onChapterClick = (id: string | null) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
    handleChapterClick(id);
  };

  const onTypeClick = (type: string | null) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
    handleTypeClick(type);
  };

  const baseBtn =
    "inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:focus-visible:ring-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed";
  const ghostBtn =
    "bg-white hover:bg-slate-50 border-slate-300 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200";
  const sectionTitle = "text-sm font-semibold text-slate-800 dark:text-slate-100";

  return (
    <>
      <aside
        className={`relative z-20 w-full shrink-0 transition-all duration-200 ease-out ${
          isDesktopCollapsed ? "lg:w-[84px]" : "lg:w-[308px] xl:w-[328px]"
        }`}
      >
        <div className="relative overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {/* collapse toggle */}
          <div className="absolute -left-4 top-6 z-[70] hidden lg:block">
            <button
              type="button"
              onClick={() => setIsDesktopCollapsed((prev) => !prev)}
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900/40"
              title={isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
              aria-label={isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
            >
              {isDesktopCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* expanded */}
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isDesktopCollapsed ? "h-0 opacity-0 lg:h-0" : "h-auto opacity-100"
            }`}
          >
            <div className="flex flex-col gap-4 p-4">
              {/* controls */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-3">
                  <h5 className={sectionTitle}>اندازه فونت</h5>
                  <FontSizeHandler fontSize={fontSize} setFontSize={setFontSize} />
                </div>

                <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />

                
              </div>

              {/* comments */}
              <button
                type="button"
                onClick={() =>
                  commentsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="group w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/70 dark:focus-visible:ring-blue-900/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      <MessageCircle className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        نظرات کاربران
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        مشاهده دیدگاه‌ها و تجربه‌ها
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
              </button>

              {/* send/copy */}
              <div className="flex w-full gap-2">
                <SendPQComponent />
                {questionCode && (
                  <CopyClipBoard className="flex-1 text-xs" text={questionCode} label="شناسه سوال:" />
                )}
              </div>

              {/* mobile filter opener */}
              <div className="w-full lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900/40"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      فیلتر سوالات
                    </h3>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </button>
              </div>

              {/* desktop filter header */}
              <div className="hidden items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 lg:flex dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <Filter className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </span>
                  <h3 className={sectionTitle}>فیلتر سوالات</h3>
                </div>
              </div>

              {/* desktop filter panel */}
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:flex lg:flex-col dark:border-slate-700 dark:bg-slate-900">
                <Link
                  href={getClearFiltersUrl()}
                  className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <List className="h-4.5 w-4.5 text-slate-500" />
                    <span>نمایش همه سوالات دوره</span>
                  </div>
                </Link>

                {/* chapter filter */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsChaptersOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-rose-500" />
                      <h2 className="text-sm font-medium text-slate-700 dark:text-slate-200">بر اساس سرفصل</h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${isChaptersOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isChaptersOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50/70 dark:bg-slate-800/30"
                      >
                        <div className="custom-scrollbar flex max-h-[40vh] flex-col gap-1 overflow-y-auto p-2">
                          <button
                            onClick={() => onChapterClick(null)}
                            disabled={isAnyLoading}
                            className={`rounded-lg px-3 py-2.5 text-right text-sm transition ${
                              !currentChapterId
                                ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                                : "border border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            همه سرفصل‌ها
                          </button>

                          {chapters.length > 0 ? (
                            chapters.map((chapter) => {
                              const isActive = currentChapterId === chapter.id;
                              return (
                                <button
                                  key={chapter.id}
                                  onClick={() => onChapterClick(chapter.id)}
                                  disabled={isAnyLoading}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-right text-sm transition ${
                                    isActive
                                      ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                                      : "border border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span className="truncate">{chapter.title}</span>
                                  {isActive && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="py-4 text-center text-sm text-slate-400">سرفصلی یافت نشد.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* type filter */}
                <div>
                  <button
                    onClick={() => setIsTypeOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      <h2 className="text-sm font-medium text-slate-700 dark:text-slate-200">بر اساس نوع سوال</h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${isTypeOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isTypeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50/70 dark:bg-slate-800/30"
                      >
                        <div className="flex flex-col gap-2 p-3">
                          <button
                            onClick={() => onTypeClick(null)}
                            disabled={isAnyLoading}
                            className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                              !currentQuestionType
                                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            همه نوع سوالات
                          </button>

                          <button
                            onClick={() => onTypeClick("SARASARI")}
                            disabled={isAnyLoading}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition ${
                              currentQuestionType === "SARASARI"
                                ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>سوالات سراسری</span>
                            </div>
                            {currentQuestionType === "SARASARI" && <CheckCircle2 className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => onTypeClick("TALIFI")}
                            disabled={isAnyLoading}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition ${
                              currentQuestionType === "TALIFI"
                                ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              <span>سوالات تالیفی</span>
                            </div>
                            {currentQuestionType === "TALIFI" && <CheckCircle2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* collapsed */}
          <div
            className={`hidden transition-all duration-200 ${
              isDesktopCollapsed ? "h-auto opacity-100 lg:flex" : "h-0 overflow-hidden opacity-0"
            }`}
          >
            <div className="mt-14 w-full p-2.5">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`${baseBtn} ${ghostBtn} h-10 w-10`}
                  title={isDarkMode ? "تغییر به روز" : "تغییر به شب"}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  onClick={() =>
                    commentsRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className={`${baseBtn} ${ghostBtn} h-10 w-10`}
                  title="نظرات کاربران"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setIsDesktopCollapsed(false)}
                  className={`${baseBtn} ${ghostBtn} h-10 w-10`}
                  title="نمایش فیلترها"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* mobile bottom sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[1px] dark:bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <motion.div
              className="fixed inset-x-0 bottom-0 z-[95] lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="mx-auto w-full max-w-2xl rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 pb-3 pt-3 dark:border-slate-700">
                  <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      فیلتر سوالات
                    </h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className={`${baseBtn} ${ghostBtn} h-9 w-9`}
                      aria-label="بستن"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[75vh] space-y-3 overflow-y-auto p-3">
                  <Link
                    href={getClearFiltersUrl()}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4 text-slate-500" />
                      <span>نمایش همه سوالات دوره</span>
                    </div>
                  </Link>

                  {/* mobile chapters */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setIsChaptersOpen((v) => !v)}
                      className="flex w-full items-center justify-between bg-white p-4 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-rose-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          بر اساس سرفصل
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition ${isChaptersOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isChaptersOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50 dark:bg-slate-800/40"
                        >
                          <div className="flex max-h-[34vh] flex-col gap-1 overflow-y-auto p-2">
                            <button
                              onClick={() => onChapterClick(null)}
                              className={`rounded-lg px-3 py-2.5 text-right text-sm ${
                                !currentChapterId
                                  ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              }`}
                            >
                              همه سرفصل‌ها
                            </button>

                            {chapters.map((chapter) => {
                              const isActive = currentChapterId === chapter.id;
                              return (
                                <button
                                  key={chapter.id}
                                  onClick={() => onChapterClick(chapter.id)}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-right text-sm ${
                                    isActive
                                      ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span className="truncate">{chapter.title}</span>
                                  {isActive && <CheckCircle2 className="h-4 w-4" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* mobile types */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setIsTypeOpen((v) => !v)}
                      className="flex w-full items-center justify-between bg-white p-4 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          بر اساس نوع سوال
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition ${isTypeOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isTypeOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50 dark:bg-slate-800/40"
                        >
                          <div className="flex flex-col gap-2 p-3">
                            <button
                              onClick={() => onTypeClick(null)}
                              className={`rounded-lg border px-3 py-2.5 text-sm ${
                                !currentQuestionType
                                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                              }`}
                            >
                              همه نوع سوالات
                            </button>
                            <button
                              onClick={() => onTypeClick("SARASARI")}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
                                currentQuestionType === "SARASARI"
                                  ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                  : "border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                              }`}
                            >
                              <span>سوالات سراسری</span>
                              {currentQuestionType === "SARASARI" && <CheckCircle2 className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => onTypeClick("TALIFI")}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
                                currentQuestionType === "TALIFI"
                                  ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                  : "border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                              }`}
                            >
                              <span>سوالات تالیفی</span>
                              {currentQuestionType === "TALIFI" && <CheckCircle2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
