"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  List,
  PlayCircle,
  Filter,
  Edit,
  GraduationCap,
} from "lucide-react";

type Chapter = {
  id: string;
  title: string;
  order?: number;
};

type QuestionFiltersProps = {
  isChaptersOpen: boolean;
  setIsChaptersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTypeOpen: boolean;
  setIsTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chapters: Chapter[];
  currentChapterId: string | null;
  currentQuestionType: string | null;
  getClearFiltersUrl: () => string;
  handleChapterClick: (id: string | null) => void;
  handleTypeClick: (type: string | null) => void;
  isAnyLoading: boolean;
};

export default function QuestionFilters({
  isChaptersOpen,
  setIsChaptersOpen,
  isTypeOpen,
  setIsTypeOpen,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  chapters,
  currentChapterId,
  currentQuestionType,
  getClearFiltersUrl,
  handleChapterClick,
  handleTypeClick,
  isAnyLoading,
}: QuestionFiltersProps) {
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center justify-between w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200/70 active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-700">فیلتر سوالات</h3>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Desktop Filter Header */}
      <div className="hidden lg:flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-400 bg-white/60 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-600" />
          </div>

          <h3 className="text-sm font-semibold text-gray-800">فیلتر سوالات</h3>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex z-10 bg-white rounded shadow-sm border border-slate-200/60 overflow-hidden flex-col">
        <Link
          href={getClearFiltersUrl()}
          className="group flex items-center justify-between bg-slate-50 border-b border-slate-200/60 p-3 transition-all hover:bg-slate-100"
        >
          <div className="flex items-center gap-3 text-slate-700 transition-colors">
            <List className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            <span>نمایش همه سوالات دوره</span>
          </div>
        </Link>

        <div className="border-b border-slate-200/60">
          <button
            onClick={() => setIsChaptersOpen(!isChaptersOpen)}
            className="w-full bg-white hover:bg-slate-50 transition-colors p-4 flex items-center justify-between outline-none"
          >
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-rose-500" />
              <h2 className="text-slate-700">بر اساس سرفصل</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                isChaptersOpen ? "rotate-0" : "rotate-90"
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {isChaptersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-50/50"
              >
                <div className="p-2 flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => handleChapterClick(null)}
                    disabled={isAnyLoading}
                    className={`text-right p-2.5 rounded transition-all ${
                      !currentChapterId
                        ? "bg-rose-100 text-rose-700 "
                        : "text-slate-600 hover:bg-slate-100"
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
                          onClick={() => handleChapterClick(chapter.id)}
                          disabled={isAnyLoading}
                          className={`flex items-center justify-between w-full text-right p-2.5 rounded transition-all ${
                            isActive
                              ? "bg-rose-100 text-rose-700"
                              : "text-slate-600 hover:bg-slate-100"
                          } ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          <span className="truncate pr-1">{chapter.title}</span>
                          {isActive && (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-600" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center text-slate-400 py-4">
                      سرفصلی یافت نشد.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <button
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="w-full bg-white hover:bg-slate-50 transition-colors p-4 flex items-center justify-between outline-none"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <h2 className="text-slate-700">بر اساس نوع سوال</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                isTypeOpen ? "rotate-0" : "rotate-90"
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {isTypeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-50/50"
              >
                <div className="p-3 flex flex-col gap-2">
                  <button
                    onClick={() => handleTypeClick(null)}
                    disabled={isAnyLoading}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                      !currentQuestionType
                        ? "border-blue-500 bg-blue-50 text-blue-700 "
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    همه نوع سوالات
                  </button>
                  <button
                    onClick={() => handleTypeClick("SARASARI")}
                    disabled={isAnyLoading}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      currentQuestionType === "SARASARI"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap
                        className={`w-4 h-4 ${
                          currentQuestionType === "SARASARI"
                            ? "text-purple-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span>سوالات سراسری</span>
                    </div>
                    {currentQuestionType === "SARASARI" && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleTypeClick("TALIFI")}
                    disabled={isAnyLoading}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      currentQuestionType === "TALIFI"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Edit
                        className={`w-4 h-4 ${
                          currentQuestionType === "TALIFI"
                            ? "text-orange-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span>سوالات تالیفی</span>
                    </div>
                    {currentQuestionType === "TALIFI" && (
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
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
              <div className="mx-auto w-full max-w-2xl rounded-t-2xl bg-white shadow-2xl border-t border-slate-400">
                <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                  <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">فیلتر سوالات</h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      بستن
                    </button>
                  </div>
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-3 space-y-3">
                  <Link
                    href={getClearFiltersUrl()}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="group flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-2 text-slate-700">
                      <List className="w-4 h-4 text-slate-500" />
                      <span>نمایش همه سوالات دوره</span>
                    </div>
                  </Link>

                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setIsChaptersOpen(!isChaptersOpen)}
                      className="w-full bg-white p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-rose-500" />
                        <span className="text-slate-700">بر اساس سرفصل</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition ${
                          isChaptersOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isChaptersOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50"
                        >
                          <div className="p-2 flex flex-col gap-1 max-h-[34vh] overflow-y-auto">
                            <button
                              onClick={() => handleChapterClick(null)}
                              className={`text-right p-2.5 rounded ${
                                !currentChapterId
                                  ? "bg-rose-100 text-rose-700"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              همه سرفصل‌ها
                            </button>
                            {chapters.map((chapter) => {
                              const isActive = currentChapterId === chapter.id;
                              return (
                                <button
                                  key={chapter.id}
                                  onClick={() => handleChapterClick(chapter.id)}
                                  className={`flex items-center justify-between w-full text-right p-2.5 rounded ${
                                    isActive
                                      ? "bg-rose-100 text-rose-700"
                                      : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <span className="truncate">{chapter.title}</span>
                                  {isActive && (
                                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setIsTypeOpen(!isTypeOpen)}
                      className="w-full bg-white p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700">بر اساس نوع سوال</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition ${
                          isTypeOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isTypeOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50"
                        >
                          <div className="p-3 flex flex-col gap-2">
                            <button
                              onClick={() => handleTypeClick(null)}
                              className={`p-2.5 rounded-lg border ${
                                !currentQuestionType
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              همه نوع سوالات
                            </button>
                            <button
                              onClick={() => handleTypeClick("SARASARI")}
                              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                                currentQuestionType === "SARASARI"
                                  ? "border-purple-500 bg-purple-50 text-purple-700"
                                  : "border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              <span>سوالات سراسری</span>
                              {currentQuestionType === "SARASARI" && (
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleTypeClick("TALIFI")}
                              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                                currentQuestionType === "TALIFI"
                                  ? "border-orange-500 bg-orange-50 text-orange-700"
                                  : "border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              <span>سوالات تالیفی</span>
                              {currentQuestionType === "TALIFI" && (
                                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                              )}
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
