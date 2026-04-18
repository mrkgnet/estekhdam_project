// app/(user)/resources/questions/ShowDataQues.tsx

"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, XCircle, Lightbulb,
  GraduationCap, Loader2, List, PlayCircle, Filter, Edit,
  Home
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import CommentManagment from "@/components/comment/CommentManagmet";

type ChoiceKey = "A" | "B" | "C" | "D";

type DBQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  answerText: string;
};

type Chapter = {
  id: string;
  title: string;
  order?: number;
}

type Props = {
  courseId: string;
  dbQuestion: DBQuestion;
  totalCount: number;
  currentStep: number;
  hasPurchased: boolean;
  chapters: Chapter[];
  pname: string
};

const persianLetterMap: Record<ChoiceKey, string> = { A: "الف", B: "ب", C: "ج", D: "د" };

export default function ExamPage({
  courseId,
  dbQuestion,
  totalCount,
  currentStep,
  hasPurchased,
  chapters,
  pname
}: Props) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // خواندن مقادیر فعلی فیلترها از URL
  const currentChapterId = searchParams.get("chapterId");
  const currentQuestionType = searchParams.get("questionType");

  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<ChoiceKey | null>(null);

  // وضعیت باز و بسته بودن آکاردئون‌های فیلتر (درون منو)
  const [isChaptersOpen, setIsChaptersOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  
  // وضعیت باز و بسته بودن کل منوی فیلتر در حالت موبایل
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsChaptersOpen(false);
      setIsTypeOpen(false);
    }
  }, []);

  const { isLoggedIn, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetStep, setTargetStep] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [dbQuestion?.id]);

  // متد کمکی برای حذف فیلترها و حفظ بقیه پارامترها (مثل pname)
  const getClearFiltersUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("chapterId");
    params.delete("questionType");
    params.set("step", "1");
    return `${pathname}?${params.toString()}`;
  };

  const handleNavigation = (newStep: number) => {
    if (newStep < 1 || newStep > totalCount) return;

    if (newStep > 4) {
      if (isLoading) return;
      if (!isLoggedIn) {
        setTargetStep(newStep);
        setIsAuthModalOpen(true);
        return;
      }
      if (!hasPurchased) {
        startTransition(() => router.push(`/cart/${courseId}`));
        return;
      }
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", newStep.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleChapterClick = (chapterId: string | null) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
    if (chapterId === currentChapterId) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      if (chapterId) params.set("chapterId", chapterId);
      else params.delete("chapterId");

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleTypeClick = (type: string | null) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
    if (type === currentQuestionType) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      if (type) params.set("questionType", type);
      else params.delete("questionType");

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const formatQuestion = (dbQ: DBQuestion) => {
    if (!dbQ) return null;
    const keys: ChoiceKey[] = ["A", "B", "C", "D"];
    const correctIndex = dbQ.correctAnswer > 0 ? dbQ.correctAnswer - 1 : 0;
    return {
      id: dbQ.id,
      text: dbQ.questionText,
      choices: dbQ.options.map((optText, i) => ({ key: keys[i], text: optText })),
      correct: keys[correctIndex],
      explanation: dbQ.answerText,
    };
  };

  const q = formatQuestion(dbQuestion);
  const progressPercentage = totalCount > 0 ? Math.round((currentStep / totalCount) * 100) : 0;

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    if (targetStep !== null) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", targetStep.toString());
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  };


  return (
    <div className="text-[14px] md:text-[15px] min-h-screen max-w-6xl m-auto text-right pb-24 lg:pb-8" dir="rtl">
      {/* bread crumb  */}
      <nav className="flex mb-2 font-medium text-[10px] sm:text-sm text-gray-500 mt-5 px-4 overflow-x-auto" aria-label="Breadcrumb">
        <ol className="flex items-center flex-nowrap min-w-max space-x-1 space-x-reverse md:space-x-2">
          <li className="inline-flex items-center flex-shrink-0">
            <Link href="/" className="inline-flex items-center hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100 whitespace-nowrap">
              <Home className="w-3.5 h-3.5 ml-1.5 mb-0.5" />
              خانه
            </Link>
          </li>
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Link
                href="/resources"
                className="text-gray-800 hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100 whitespace-nowrap"
              >
                منابع آموزشی
              </Link>
            </div>
          </li>
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Link
                href={`/resources/course/${pname}`}
                className="text-gray-800 hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100 whitespace-nowrap"
              >
                {pname}
              </Link>
            </div>
          </li>
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-800 border p-1 rounded-full bg-gray-100 whitespace-nowrap">
                سوالات
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <hr />

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>

      <div className="mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* 🟢 سایدبار با قابلیت فیلترهای چندگانه */}
        <aside className="w-full lg:w-[300px] xl:w-[320px] lg:sticky lg:top-6 flex flex-col gap-3 shrink-0 z-20">

          {/* دکمه باز/بسته کردن فیلتر در موبایل */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center justify-between w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200/60"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800 text-lg">فیلتر سوالات</h3>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isMobileFilterOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {/* هدر سایدبار در دسکتاپ */}
          <div className="hidden lg:flex items-center gap-2 mb-1 px-1">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold text-gray-800 text-lg">فیلتر سوالات</h3>
          </div>

          <div className={`${isMobileFilterOpen ? 'flex' : 'hidden'} lg:flex bg-white rounded shadow-sm border border-slate-200/60 overflow-hidden flex-col`}>

            {/* دکمه پاک کردن کل فیلترها - اصلاح شده برای حفظ pname */}
            <Link
              href={getClearFiltersUrl()}
              onClick={() => typeof window !== 'undefined' && window.innerWidth < 1024 && setIsMobileFilterOpen(false)}
              className="group flex items-center justify-between bg-slate-50 border-b border-slate-200/60 p-3 transition-all hover:bg-slate-100"
            >
              <div className="flex items-center gap-3 text-slate-700 transition-colors">
                <List className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
                <span className="font-bold text-sm">نمایش همه سوالات دوره</span>
              </div>
            </Link>

            {/* 🟢 آکاردئون سرفصل‌ها */}
            <div className="border-b border-slate-200/60">
              <button
                onClick={() => setIsChaptersOpen(!isChaptersOpen)}
                className="w-full bg-white hover:bg-slate-50 transition-colors p-4 flex items-center justify-between cursor-pointer outline-none"
              >
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-rose-500" />
                  <h2 className="font-bold text-slate-700 text-sm">
                    بر اساس سرفصل
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isChaptersOpen ? "rotate-0" : "rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isChaptersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="overflow-hidden bg-slate-50/50"
                  >
                    <div className="p-2 flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => handleChapterClick(null)}
                        disabled={isPending}
                        className={`text-right p-2.5 rounded-lg text-sm transition-all
                            ${!currentChapterId ? 'bg-rose-100 text-rose-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}
                          `}
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
                              disabled={isPending}
                              className={`relative flex items-center justify-between w-full text-right p-2.5 rounded-lg text-sm transition-all cursor-pointer overflow-hidden
                                ${isActive
                                  ? 'bg-rose-100 text-rose-700 font-bold'
                                  : 'text-slate-600 hover:bg-slate-100'
                                }
                                ${isPending ? 'opacity-60 cursor-not-allowed' : ''}
                                `}
                            >
                              <span className="truncate pr-1">{chapter.title}</span>
                              {isActive && <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-600" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center text-slate-400 py-4 text-xs">
                          سرفصلی یافت نشد.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🟢 آکاردئون نوع سوال */}
            <div>
              <button
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="w-full bg-white hover:bg-slate-50 transition-colors p-4 flex items-center justify-between cursor-pointer outline-none"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <h2 className="font-bold text-slate-700 text-sm">
                    بر اساس نوع سوال
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isTypeOpen ? "rotate-0" : "rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isTypeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="overflow-hidden bg-slate-50/50"
                  >
                    <div className="p-3 flex flex-col gap-2">

                      <button
                        onClick={() => handleTypeClick(null)}
                        disabled={isPending}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all text-sm
                            ${!currentQuestionType ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                          `}
                      >
                        همه نوع سوالات
                      </button>

                      <button
                        onClick={() => handleTypeClick("SARASARI")}
                        disabled={isPending}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-sm
                            ${currentQuestionType === "SARASARI" ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                          `}
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className={`w-4 h-4 ${currentQuestionType === "SARASARI" ? "text-purple-600" : "text-slate-400"}`} />
                          <span>سوالات سراسری</span>
                        </div>
                        {currentQuestionType === "SARASARI" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </button>

                      <button
                        onClick={() => handleTypeClick("TALIFI")}
                        disabled={isPending}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-sm
                            ${currentQuestionType === "TALIFI" ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                          `}
                      >
                        <div className="flex items-center gap-2">
                          <Edit className={`w-4 h-4 ${currentQuestionType === "TALIFI" ? "text-orange-600" : "text-slate-400"}`} />
                          <span>سوالات تالیفی</span>
                        </div>
                        {currentQuestionType === "TALIFI" && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </aside>

        <main className="w-full flex-1 flex flex-col min-w-0 pb-10">
          <header className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-5">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-800 text-base sm:text-lg">شبیه‌ساز آزمون</h1>
                {totalCount > 0 ? (
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                    سوال <span className="font-bold text-slate-700">{currentStep}</span> از <span className="font-bold text-slate-700">{totalCount}</span>
                  </p>
                ) : (
                  <p className="text-red-500 text-xs sm:text-sm mt-0.5 font-bold">
                    سوالی با این فیلترها یافت نشد!
                  </p>
                )}
              </div>
            </div>

            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                <motion.circle
                  cx="50%" cy="50%" r="42%"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={100}
                  animate={{ strokeDashoffset: 100 - progressPercentage }}
                  className="text-green-500"
                  pathLength="100"
                />
              </svg>
              <span className="absolute text-xs sm:text-sm font-bold text-slate-700">{progressPercentage}%</span>
            </div>
          </header>

          <div className="relative z-10">
            {isPending && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl border border-white/50">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
              </div>
            )}

            {q ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-8"
                >
                  <h2 className="text-slate-800 text-base sm:text-lg font-bold leading-relaxed mb-8">
                    {q.text}
                  </h2>

                  <div className="space-y-3.5">
                    {q.choices.map((ch) => {
                      const isUserChoice = selected === ch.key;
                      const isRight = ch.key === q.correct;
                      const showResult = selected !== null;

                      return (
                        <button
                          key={ch.key}
                          disabled={showResult || isPending}
                          onClick={() => setSelected(ch.key)}
                          className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer text-right outline-none active:scale-[0.99]
                            ${!showResult ? 'border-slate-100 hover:border-green-300 hover:bg-slate-50 focus-visible:border-green-500' :
                              isRight ? 'border-green-500 bg-green-50/50' :
                                isUserChoice ? 'border-red-500 bg-red-50/50' : 'border-slate-50 bg-slate-50/30 opacity-50'}
                            `}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors
                                ${isUserChoice || (showResult && isRight) ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100 text-slate-500'}
                                ${showResult && isRight ? 'text-green-600' : isUserChoice ? 'text-red-600' : ''}
                            `}>
                              {persianLetterMap[ch.key]}
                            </span>
                            <span className={`text-sm sm:text-base ${isUserChoice || isRight ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                              {ch.text}
                            </span>
                          </div>
                          {showResult && isRight && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
                          {showResult && isUserChoice && !isRight && <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-8 pt-6 border-t border-slate-100 overflow-hidden"
                      >
                        <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100/60">
                          <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
                            <Lightbulb className="w-5 h-5 text-blue-600" />
                            <span>پاسخ تشریحی</span>
                          </div>
                          <p className="text-slate-700 leading-8 text-justify">
                            {q.explanation || "پاسخ تشریحی برای این سوال ثبت نشده است."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-10 flex flex-col items-center justify-center text-center">
                <Filter className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-slate-600 font-bold text-lg mb-2">سوالی یافت نشد!</h3>
                <p className="text-slate-500 text-sm">با فیلترهای انتخاب شده هیچ سوالی برای نمایش وجود ندارد.</p>
              </div>
            )}

            {totalCount > 0 && (
              <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 lg:relative lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none lg:p-0 lg:mt-6 lg:z-auto">
                <div className="flex gap-4 items-center justify-between w-full max-w-lg mx-auto lg:max-w-none">
                  <button
                    disabled={currentStep === 1 || isPending}
                    onClick={() => handleNavigation(currentStep - 1)}
                    className="flex-1 flex items-center cursor-pointer justify-center gap-2 h-12 sm:h-14 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <ChevronRight className="w-5 h-5" />
                    سوال قبلی
                  </button>

                  <button
                    disabled={currentStep === totalCount || isPending}
                    onClick={() => handleNavigation(currentStep + 1)}
                    className="flex-1 flex items-center cursor-pointer justify-center gap-2 h-12 sm:h-14 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-base"
                  >
                    سوال بعدی
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-8 mt-6 mb-16 lg:mb-0">
            <CommentManagment productId={courseId} />
          </div>

        </main>
      </div>
    </div>
  );
}
