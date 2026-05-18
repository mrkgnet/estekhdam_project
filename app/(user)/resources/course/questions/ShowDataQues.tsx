"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchDataQues } from "@/actions/user/resources/course/DataQues/Actions";
import {
  ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, XCircle, Lightbulb,
  GraduationCap, Loader2, List, PlayCircle, Filter, Edit,
  Users, MessageCircleQuestion, Sparkles, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import CommentManagment from "@/components/comment/CommentManagmet";
import SendPQComponent from "@/components/send-problem-question/SendPQComponent";
import { CopyClipBoard } from "@/components/copy-clipboard/CopyClipBoard";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

type ChoiceKey = "A" | "B" | "C" | "D";

type DBQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  answerText: string;
  examPoints: string;
  questionCode: string;
};

type Chapter = {
  id: string;
  title: string;
  order?: number;
}

type Props = {
  initialResponse: any;
  courseId: string;
  currentStep: number;
  chapterId?: string;
  questionType?: string;
  pname: string;
};

const persianLetterMap: Record<ChoiceKey, string> = { A: "الف", B: "ب", C: "ج", D: "د" };

export default function ExamPage({
  initialResponse,
  courseId,
  currentStep,
  chapterId,
  questionType,
  pname
}: Props) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const commentsRef = React.useRef<HTMLDivElement | null>(null);

  const { data: response, isFetching } = useQuery({
    queryKey: ['exam-question', courseId, currentStep, chapterId, questionType],
    queryFn: async () => await fetchDataQues(courseId, currentStep, chapterId, questionType),
    initialData: initialResponse,
    staleTime: 1000 * 60 * 5,
  });

  const dbQuestion = response?.data as DBQuestion;
  const totalCount = response?.totalCount || 0;
  const hasPurchased = response?.hasPurchased || false;
  const chapters = (response?.chapters || []) as Chapter[];

  const currentChapterId = searchParams.get("chapterId");
  const currentQuestionType = searchParams.get("questionType");

  const [isPendingRoute, startTransition] = useTransition();
  const [selected, setSelected] = useState<ChoiceKey | null>(null);

  const [isChaptersOpen, setIsChaptersOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // === State برای مدال پرش به سوال ===
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [jumpTarget, setJumpTarget] = useState("");

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

  useEffect(() => {
    if (isMobileFilterOpen || isJumpModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen, isJumpModalOpen]);

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

  const handleJumpSubmit = () => {
    const target = parseInt(jumpTarget);
    if (!isNaN(target) && target >= 1 && target <= totalCount) {
      setIsJumpModalOpen(false);
      handleNavigation(target);
      setJumpTarget("");
    } else {
      alert(`لطفاً عددی بین ۱ تا ${totalCount} وارد کنید.`);
    }
  };

  const handleChapterClick = (id: string | null) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
    if (id === currentChapterId) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      if (id) params.set("chapterId", id);
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

  const formatQuestion = (dbQ?: DBQuestion) => {
    if (!dbQ) return null;
    const keys: ChoiceKey[] = ["A", "B", "C", "D"];
    const correctIndex = dbQ.correctAnswer > 0 ? dbQ.correctAnswer - 1 : 0;
    return {
      id: dbQ.id,
      text: dbQ.questionText,
      choices: dbQ.options.map((optText, i) => ({ key: keys[i], text: optText })),
      correct: keys[correctIndex],
      explanation: dbQ.answerText,
      examPoints: dbQ.examPoints,
      code: dbQ.questionCode,
    };
  };

  const q = formatQuestion(dbQuestion);
  const progressPercentage = totalCount > 0 ? Math.round((currentStep / totalCount) * 100) : 0;
  const isAnyLoading = isFetching || isPendingRoute;

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

  const breadcrumbItems = [
    { label: pname, href: `/resources/course/${pname}` },
    { label: 'سوالات', href: `` },
  ];

  return (
    <div className="min-h-screen max-w-6xl text-bodyall m-auto text-right pb-24 lg:pb-8 " dir="rtl">
      <div className="mt-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>

      {/* ==================== مدال پرش به سوال ==================== */}
      <AnimatePresence>
        {isJumpModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsJumpModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, y: -150, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -120, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <div className="bg-white rounded shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto border border-slate-200">

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    پرش به سوال خاص
                  </h3>
                  <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                    شماره سوال مورد نظر خود را وارد کنید (بین ۱ تا{" "}
                    <span className="font-bold text-slate-700">{totalCount}</span>
                    ).
                  </p>

                  <input
                    type="number"
                    min={1}
                    max={totalCount}
                    value={jumpTarget}
                    onChange={(e) => setJumpTarget(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleJumpSubmit(); }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="مثلاً: 5"
                    autoFocus
                  />
                </div>

                <div className="flex bg-slate-50/80 border-t border-slate-100 p-4 gap-3 justify-end">
                  <button
                    onClick={() => setIsJumpModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    onClick={handleJumpSubmit}
                    className="px-5 py-2.5 text-sm font-medium bg-red-400 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm"
                  >
                    تایید و انتقال
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      <div className="mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <aside className="w-full lg:w-[300px] xl:w-[320px] lg:sticky lg:top-6 flex flex-col gap-3 shrink-0 z-20">
          <button
            type="button"
            onClick={() => {
              commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              setIsMobileFilterOpen(false);
            }}
            className="group relative w-full rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-white hover:shadow-md active:scale-[0.98] outline-none"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 shadow-inner transition-all duration-200 group-hover:scale-105 group-hover:from-slate-200 group-hover:to-slate-300 group-hover:text-slate-800">
                  <MessageCircle className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
                </span>
                <div className="min-w-0 text-right">
                  <p className="truncate font-medium tracking-tight text-slate-800">نظرات کاربران</p>
                  <p className="truncate text-10 sm:text-12 leading-tight text-slate-400">دیدگاه‌ها و تجربه‌ی دیگران</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ChevronDown className="h-4.5 w-4.5 text-slate-400 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-slate-600" />
              </div>
            </div>
          </button>

          <div className="flex text-10 gap-2">
            <SendPQComponent />
            {q?.code && (
              <CopyClipBoard className="text-10" text={q.code} label="شناسه سوال:" />
            )}
          </div>

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

          <div className="hidden lg:flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-400 bg-white/60 backdrop-blur z-20">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-gray-200 shadow-sm">
                <Filter className="w-4 h-4 text-gray-600" />
              </div>

              <h3 className="text-sm font-semibold text-gray-800">
                فیلتر سوالات
              </h3>
            </div>
          </div>


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
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isChaptersOpen ? "rotate-0" : "rotate-90"}`} />
              </button>

              <AnimatePresence initial={false}>
                {isChaptersOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50/50">
                    <div className="p-2 flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
                      <button onClick={() => handleChapterClick(null)} disabled={isAnyLoading} className={`text-right p-2.5 rounded transition-all ${!currentChapterId ? 'bg-rose-100 text-rose-700 ' : 'text-slate-600 hover:bg-slate-100'}`}>
                        همه سرفصل‌ها
                      </button>
                      {chapters.length > 0 ? (
                        chapters.map((chapter) => {
                          const isActive = currentChapterId === chapter.id;
                          return (
                            <button key={chapter.id} onClick={() => handleChapterClick(chapter.id)} disabled={isAnyLoading} className={`flex items-center justify-between w-full text-right p-2.5 rounded transition-all ${isActive ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'} ${isAnyLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                              <span className="truncate pr-1">{chapter.title}</span>
                              {isActive && <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-600" />}
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
                className="w-full bg-white hover:bg-slate-50 transition-colors p-4 flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <h2 className="text-slate-700">بر اساس نوع سوال</h2>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isTypeOpen ? "rotate-0" : "rotate-90"}`} />
              </button>

              <AnimatePresence initial={false}>
                {isTypeOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50/50">
                    <div className="p-3 flex flex-col gap-2">
                      <button onClick={() => handleTypeClick(null)} disabled={isAnyLoading} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${!currentQuestionType ? 'border-blue-500 bg-blue-50 text-blue-700 ' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                        همه نوع سوالات
                      </button>
                      <button onClick={() => handleTypeClick("SARASARI")} disabled={isAnyLoading} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${currentQuestionType === "SARASARI" ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2">
                          <GraduationCap className={`w-4 h-4 ${currentQuestionType === "SARASARI" ? "text-purple-600" : "text-slate-400"}`} />
                          <span>سوالات سراسری</span>
                        </div>
                        {currentQuestionType === "SARASARI" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </button>
                      <button onClick={() => handleTypeClick("TALIFI")} disabled={isAnyLoading} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${currentQuestionType === "TALIFI" ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
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
          <header className="flex items-center justify-between bg-white p-4 sm:p-5 rounded shadow-sm border border-gray-300 mb-5">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1>شبیه‌ساز آزمون</h1>
                  {totalCount > 0 && (
                    <button
                      onClick={() => setIsJumpModalOpen(true)}
                      className="text-xs bg-rose-400 text-white hover:bg-slate-200 text-slate-700 py-1 px-2.5 rounded-lg transition-colors border border-slate-200"
                    >
                      برو به سواله ...
                    </button>
                  )}
                </div>
                {totalCount > 0 ? (
                  <p className="text-slate-500 mt-1">
                    سوال <span className="text-slate-700">{currentStep}</span> از <span className="text-slate-700">{totalCount}</span>
                  </p>
                ) : (
                  <p className="text-red-500 mt-0.5">سوالی با این فیلترها یافت نشد!</p>
                )}
              </div>
            </div>

            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                <motion.circle
                  cx="50%" cy="50%" r="42%"
                  stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"
                  strokeDasharray={100} animate={{ strokeDashoffset: 100 - progressPercentage }}
                  className="text-green-500" pathLength="100"
                />
              </svg>
              <span className="absolute text-slate-700">{progressPercentage}%</span>
            </div>
          </header>

          <div className="relative z-10 border border-gray-300">
            {isAnyLoading && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded border border-white/50">
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
                  className="bg-white rounded shadow-sm border border-slate-200/60 p-5 sm:p-8"
                >
                  <div className="flex text-14 md:text-14 flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                    <h2 dangerouslySetInnerHTML={{ __html: q.text }} className="text-slate-800 leading-relaxed flex-1 text-14"></h2>
                  </div>

                  <div className="space-y-3.5">
                    {q.choices.map((ch) => {
                      const isUserChoice = selected === ch.key;
                      const isRight = ch.key === q.correct;
                      const showResult = selected !== null;

                      return (
                        <button
                          key={ch.key}
                          disabled={showResult || isAnyLoading}
                          onClick={() => setSelected(ch.key)}
                          className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all text-right outline-none active:scale-[0.99]
                            ${!showResult ? 'border-slate-300 hover:border-green-300 hover:bg-slate-50 focus-visible:border-green-500 cursor-pointer' :
                              isRight ? 'border-green-500 bg-green-50/50 cursor-default' :
                                isUserChoice ? 'border-red-500 bg-red-50/50 cursor-default' : 'border-slate-50 bg-slate-50/30 opacity-50 cursor-default'}
                            `}
                        >
                          <div className="flex items-center gap-4 text-14">
                            <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                ${isUserChoice || (showResult && isRight) ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100 text-slate-500'}
                                ${showResult && isRight ? 'text-green-600' : isUserChoice ? 'text-red-600' : ''}
                            `}>
                              {persianLetterMap[ch.key]}
                            </span>
                            <span className={`${isUserChoice || isRight ? 'text-slate-900' : 'text-slate-700'}`}>
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
                        <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded border border-blue-100/60">
                          <div className="flex items-center gap-2 mb-3 text-blue-800">
                            <Lightbulb className="w-5 h-5 text-blue-600" />
                            <span className="font-bold">پاسخ تشریحی</span>
                          </div>
                          {q.explanation ? (
                            <p dangerouslySetInnerHTML={{ __html: q.explanation }} className="text-slate-700 text-14 leading-8 text-justify"></p>
                          ) : (
                            <p className="...">پاسخ تشریحی برای این سوال ثبت نشده است.</p>
                          )}
                        </div>

                        <div className="p-5 mt-3 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded border border-blue-100/60">
                          <div className="flex items-center gap-2 mb-3 text-blue-800">
                            <Lightbulb className="w-5 h-5 text-blue-600" />
                            <span className="font-bold"> نکات کلیدی کنکوری</span>
                          </div>
                          {q.examPoints ? (
                            <p dangerouslySetInnerHTML={{ __html: q.examPoints }} className="text-slate-700 text-14 leading-8 text-justify"></p>
                          ) : (
                            <p className="...">نکته کنکوری برای این سوال ثبت نشده است.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-10 flex flex-col items-center justify-center text-center">
                <Filter className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-slate-600 mb-2">سوالی یافت نشد!</h3>
                <p className="text-slate-500">با فیلترهای انتخاب شده هیچ سوالی برای نمایش وجود ندارد.</p>
              </div>
            )}

            {totalCount > 0 && (
              <div className="fixed bottom-0 left-0 border border-gray-300 w-full p-4 bg-white/90 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 lg:relative lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none lg:p-0 lg:mt-6 lg:z-auto">
                <div className="flex gap-4 items-center justify-between w-full max-w-lg mx-auto lg:max-w-none">
                  <button
                    disabled={currentStep === 1 || isAnyLoading}
                    onClick={() => handleNavigation(currentStep - 1)}
                    className="flex-1 flex items-center justify-center gap-2 h-10 sm:h-12 rounded text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <ChevronRight className="w-5 h-5" />
                    سوال قبلی
                  </button>

                  <button
                    disabled={currentStep === totalCount || isAnyLoading}
                    onClick={() => handleNavigation(currentStep + 1)}
                    className="flex-1 flex items-center justify-center gap-2 h-10 sm:h-12 rounded bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-base"
                  >
                    سوال بعدی
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="bg-white rounded shadow-sm border border-slate-200/60 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <MessageCircleQuestion className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-semibold flex items-center gap-2">
                      پرسش و پاسخ با دیگران
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 leading-7">
                      سوالت رو درباره همین تست بپرس یا به بقیه کمک کن. پاسخ‌های دقیق و کوتاه سریع‌تر دیده می‌شن.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5" />
                    گفت‌وگوی جمعی
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                    پاسخ مفید = ارزشمند
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div ref={commentsRef}>
            {dbQuestion?.id && (
              <CommentManagment targetId={dbQuestion.id} targetType="question" />
            )}
          </div>

        </main>
      </div>

      {/* ==================== فیلتر نسخه موبایل ==================== */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[95] lg:hidden"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="mx-auto w-full max-w-2xl rounded-t-2xl bg-white shadow-2xl border-t border-slate-400">
                <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                  <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">فیلتر سوالات</h3>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
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
                    <button onClick={() => setIsChaptersOpen(!isChaptersOpen)} className="w-full bg-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-rose-500" />
                        <span className="text-slate-700">بر اساس سرفصل</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition ${isChaptersOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isChaptersOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50">
                          <div className="p-2 flex flex-col gap-1 max-h-[34vh] overflow-y-auto">
                            <button onClick={() => handleChapterClick(null)} className={`text-right p-2.5 rounded ${!currentChapterId ? "bg-rose-100 text-rose-700" : "text-slate-600 hover:bg-slate-100"}`}>
                              همه سرفصل‌ها
                            </button>
                            {chapters.map((chapter) => {
                              const isActive = currentChapterId === chapter.id;
                              return (
                                <button key={chapter.id} onClick={() => handleChapterClick(chapter.id)} className={`flex items-center justify-between w-full text-right p-2.5 rounded ${isActive ? "bg-rose-100 text-rose-700" : "text-slate-600 hover:bg-slate-100"}`}>
                                  <span className="truncate">{chapter.title}</span>
                                  {isActive && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <button onClick={() => setIsTypeOpen(!isTypeOpen)} className="w-full bg-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700">بر اساس نوع سوال</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition ${isTypeOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isTypeOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50">
                          <div className="p-3 flex flex-col gap-2">
                            <button onClick={() => handleTypeClick(null)} className={`p-2.5 rounded-lg border ${!currentQuestionType ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"}`}>
                              همه نوع سوالات
                            </button>
                            <button onClick={() => handleTypeClick("SARASARI")} className={`flex items-center justify-between p-2.5 rounded-lg border ${currentQuestionType === "SARASARI" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-600"}`}>
                              <span>سوالات سراسری</span>
                              {currentQuestionType === "SARASARI" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                            </button>
                            <button onClick={() => handleTypeClick("TALIFI")} className={`flex items-center justify-between p-2.5 rounded-lg border ${currentQuestionType === "TALIFI" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-600"}`}>
                              <span>سوالات تالیفی</span>
                              {currentQuestionType === "TALIFI" && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
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
    </div>
  );
}
