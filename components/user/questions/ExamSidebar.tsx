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
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

  return (
    <>
      <aside
        className={`relative w-full shrink-0 z-20 transition-all duration-150 ease-out ${
          isDesktopCollapsed ? "lg:w-[78px]" : "lg:w-[300px] xl:w-[320px]"
        }`}
      >
        {/* قاب اصلی سایدبار */}
        <div className="relative w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-visible">
          {/* دکمه باز/بستن روی بوردر */}
          <div
            className={`hidden lg:block absolute top-5 z-[70] ${
              isDesktopCollapsed ? "-left-3" : "-left-3"
            }`}
          >
            <div className="group relative">
              <button
                type="button"
                onClick={() => setIsDesktopCollapsed((prev) => !prev)}
                className="flex items-center justify-center w-7 h-7 rounded-full border border-slate-600 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-150"
                title={isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
                aria-label={isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
              >
                {isDesktopCollapsed ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-[11px] px-2 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
                {isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
              </div>
            </div>
          </div>

          {/* حالت باز */}
          <div
            className={`transition-all duration-150 overflow-hidden ${
              isDesktopCollapsed ? "lg:opacity-0 lg:h-0" : "opacity-100 h-auto"
            }`}
          >
            <div className="p-3 sm:p-4 flex flex-col gap-3">
              {/* تنظیمات فونت و تم */}
              <div className="flex flex-col gap-4 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                    تغییر اندازه فونت
                  </h5>
                  <FontSizeHandler fontSize={fontSize} setFontSize={setFontSize} />
                </div>

                <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center flex-wrap gap-2 flex-1">
                    <h5 className="text-slate-800 dark:text-slate-200 text-sm font-medium shrink-0">
                      تم نمایش
                    </h5>
                    <span className="text-[10px] leading-tight text-red-500 dark:text-red-400 text-justify">
                      درصورت مشکل تم را از این صفحه غیرفعال یا صفحه را رفرش کنید
                    </span>
                  </div>
                  <div className="shrink-0">
                    {mounted ? (
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
                        title={isDarkMode ? "تغییر به روز" : "تغییر به شب"}
                      >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* نظرات */}
              <button
                type="button"
                onClick={() =>
                  commentsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="group relative w-full rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/70 px-4 py-3 shadow-sm transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md active:scale-[0.98] outline-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 shadow-inner">
                      <MessageCircle className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 text-right">
                      <p className="truncate font-medium tracking-tight text-slate-800 dark:text-slate-200">
                        نظرات کاربران
                      </p>
                      <p className="truncate text-10 sm:text-12 leading-tight text-slate-400 dark:text-slate-500">
                        دیدگاه‌ها و تجربه‌ی دیگران
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
              </button>

              {/* ارسال/کپی */}
              <div className="flex text-10 gap-2 w-full">
                <SendPQComponent />
                {questionCode && (
                  <CopyClipBoard className="text-10 flex-1" text={questionCode} label="شناسه سوال:" />
                )}
              </div>

              {/* موبایل: دکمه باز کردن فیلتر */}
              <div className="lg:hidden w-full">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center justify-between w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/70 dark:border-slate-700/70 active:scale-[0.99] transition"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">فیلتر سوالات</h3>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </button>
              </div>

              {/* دسکتاپ: هدر فیلتر */}
              <div className="hidden lg:flex items-center justify-between w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Filter className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className="text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded p-1 text-slate-800 dark:text-slate-200">
                    فیلتر سوالات
                  </h3>
                </div>
              </div>

              {/* دسکتاپ: لیست فیلتر */}
              <div className="hidden lg:flex w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex-col">
                <Link
                  href={getClearFiltersUrl()}
                  className="group flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/60 p-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors">
                    <List className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    <span>نمایش همه سوالات دوره</span>
                  </div>
                </Link>

                <div className="border-b border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => setIsChaptersOpen(!isChaptersOpen)}
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-4 flex items-center justify-between outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                      <h2 className="text-slate-700 dark:text-slate-200">بر اساس سرفصل</h2>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isChaptersOpen ? "rotate-0" : "rotate-90"}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isChaptersOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                      >
                        <div className="p-2 flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
                          <button
                            onClick={() => onChapterClick(null)}
                            disabled={isAnyLoading}
                            className={`text-right p-2.5 rounded transition-all ${
                              !currentChapterId
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                                  className={`flex items-center justify-between w-full text-right p-2.5 rounded transition-all ${
                                    isActive
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  } ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                  <span className="truncate pr-1">{chapter.title}</span>
                                  {isActive && <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-center text-slate-400 py-4">سرفصلی یافت نشد.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button
                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-4 flex items-center justify-between outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <h2 className="text-slate-700 dark:text-slate-200">بر اساس نوع سوال</h2>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isTypeOpen ? "rotate-0" : "rotate-90"}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isTypeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                      >
                        <div className="p-3 flex flex-col gap-2">
                          <button
                            onClick={() => onTypeClick(null)}
                            disabled={isAnyLoading}
                            className={`p-2.5 rounded-lg border transition-all ${
                              !currentQuestionType
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500/50 dark:bg-blue-900/40 dark:text-blue-300"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            همه نوع سوالات
                          </button>
                          <button
                            onClick={() => onTypeClick("SARASARI")}
                            disabled={isAnyLoading}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                              currentQuestionType === "SARASARI"
                                ? "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-500/50 dark:bg-purple-900/40 dark:text-purple-300"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap
                                className={`w-4 h-4 ${
                                  currentQuestionType === "SARASARI"
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              />
                              <span>سوالات سراسری</span>
                            </div>
                            {currentQuestionType === "SARASARI" && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                          </button>
                          <button
                            onClick={() => onTypeClick("TALIFI")}
                            disabled={isAnyLoading}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                              currentQuestionType === "TALIFI"
                                ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500/50 dark:bg-orange-900/40 dark:text-orange-300"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Edit
                                className={`w-4 h-4 ${
                                  currentQuestionType === "TALIFI"
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              />
                              <span>سوالات تالیفی</span>
                            </div>
                            {currentQuestionType === "TALIFI" && <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* حالت بسته (آیکن‌ها) */}
          <div
            className={`hidden transition-all duration-150 ${
              isDesktopCollapsed ? "lg:flex opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <div className="w-full p-2.5 mt-14">
              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title={isDarkMode ? "تغییر به روز" : "تغییر به شب"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() =>
                    commentsRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="نظرات کاربران"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDesktopCollapsed(false)}
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="نمایش فیلترها"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* مدال فیلترهای موبایل */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 dark:bg-black/60 lg:hidden"
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
              <div className="mx-auto w-full max-w-2xl rounded-t-2xl bg-white dark:bg-slate-900 shadow-2xl border-t border-slate-400 dark:border-slate-700">
                <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">فیلتر سوالات</h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      بستن
                    </button>
                  </div>
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-3 space-y-3">
                  <Link
                    href={getClearFiltersUrl()}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="group flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <List className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>نمایش همه سوالات دوره</span>
                    </div>
                  </Link>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => setIsChaptersOpen(!isChaptersOpen)}
                      className="w-full bg-white dark:bg-slate-800 p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                        <span className="text-slate-700 dark:text-slate-200">بر اساس سرفصل</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition ${isChaptersOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isChaptersOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                        >
                          <div className="p-2 flex flex-col gap-1 max-h-[34vh] overflow-y-auto">
                            <button
                              onClick={() => onChapterClick(null)}
                              className={`text-right p-2.5 rounded ${
                                !currentChapterId
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                                  className={`flex items-center justify-between w-full text-right p-2.5 rounded ${
                                    isActive
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span className="truncate">{chapter.title}</span>
                                  {isActive && <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => setIsTypeOpen(!isTypeOpen)}
                      className="w-full bg-white dark:bg-slate-800 p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-200">بر اساس نوع سوال</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition ${isTypeOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isTypeOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                        >
                          <div className="p-3 flex flex-col gap-2">
                            <button
                              onClick={() => onTypeClick(null)}
                              className={`p-2.5 rounded-lg border ${
                                !currentQuestionType
                                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500/50 dark:bg-blue-900/40 dark:text-blue-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              همه نوع سوالات
                            </button>
                            <button
                              onClick={() => onTypeClick("SARASARI")}
                              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                                currentQuestionType === "SARASARI"
                                  ? "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-500/50 dark:bg-purple-900/40 dark:text-purple-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <span>سوالات سراسری</span>
                              {currentQuestionType === "SARASARI" && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                            </button>
                            <button
                              onClick={() => onTypeClick("TALIFI")}
                              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                                currentQuestionType === "TALIFI"
                                  ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500/50 dark:bg-orange-900/40 dark:text-orange-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <span>سوالات تالیفی</span>
                              {currentQuestionType === "TALIFI" && <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
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
