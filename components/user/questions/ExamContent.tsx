"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle, Lightbulb,
  GraduationCap, Loader2, Filter, Users, MessageCircleQuestion, Sparkles
} from "lucide-react";
import CommentManagment from "@/components/comment/CommentManagmet";

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

type FormattedQuestion = {
  id: string;
  text: string;
  choices: { key: ChoiceKey; text: string }[];
  correct: ChoiceKey;
  explanation: string;
  examPoints: string;
  code: string;
} | null;

interface ExamContentProps {
  fontSize: number;
  q: FormattedQuestion;
  dbQuestion?: DBQuestion;
  currentStep: number;
  totalCount: number;
  progressPercentage: number;
  isAnyLoading: boolean;
  selected: ChoiceKey | null;
  setSelected: React.Dispatch<React.SetStateAction<ChoiceKey | null>>;
  handleNavigation: (step: number) => void;
  setIsJumpModalOpen: (val: boolean) => void;
  commentsRef: React.RefObject<HTMLDivElement | null>;
}

const persianLetterMap: Record<ChoiceKey, string> = { A: "الف", B: "ب", C: "ج", D: "د" };

export default function ExamContent({
  fontSize, q, dbQuestion, currentStep, totalCount, progressPercentage,
  isAnyLoading, selected, setSelected, handleNavigation, setIsJumpModalOpen, commentsRef
}: ExamContentProps) {
  
  return (
    <main className="w-full flex-1 flex flex-col min-w-0 pb-10 transition-all duration-300" style={{ fontSize: `${fontSize}px` }}>
      <header className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 sm:p-5 rounded shadow-sm border border-gray-300 dark:border-slate-700 mb-5 transition-colors">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 dark:bg-emerald-900/30 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
            <GraduationCap className="w-6 h-6 text-green-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-slate-800 dark:text-slate-100 font-semibold">شبیه‌ساز آزمون</h1>
              {totalCount > 0 && (
                <button
                  onClick={() => setIsJumpModalOpen(true)}
                  className="text-xs bg-rose-400 dark:bg-rose-500 text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 py-1 px-2.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-600"
                >
                  برو به سواله ...
                </button>
              )}
            </div>
            {totalCount > 0 ? (
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                سوال <span className="text-slate-700 dark:text-slate-200">{currentStep}</span> از <span className="text-slate-700 dark:text-slate-200">{totalCount}</span>
              </p>
            ) : (
              <p className="text-red-500 dark:text-red-400 mt-0.5">سوالی با این فیلترها یافت نشد!</p>
            )}
          </div>
        </div>

        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-700" />
            <motion.circle
              cx="50%" cy="50%" r="42%"
              stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"
              strokeDasharray={100} animate={{ strokeDashoffset: 100 - progressPercentage }}
              className="text-green-500 dark:text-emerald-400" pathLength="100"
            />
          </svg>
          <span className="absolute text-slate-700 dark:text-slate-300 text-sm font-medium">{progressPercentage}%</span>
        </div>
      </header>

      <div className="relative z-10 border border-gray-300 dark:border-slate-700 rounded-lg transition-colors">
        {isAnyLoading && (
          <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center rounded border border-white/50 dark:border-slate-700/50">
            <Loader2 className="w-10 h-10 text-green-600 dark:text-emerald-500 animate-spin" />
          </div>
        )}

        {q ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-8 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <h2 dangerouslySetInnerHTML={{ __html: q.text }} className="text-slate-800 dark:text-slate-100 leading-relaxed flex-1"></h2>
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
          ${!showResult ? 'border-slate-300 dark:border-slate-600 hover:border-green-300 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus-visible:border-green-500 cursor-pointer' :
                          isRight ? 'border-green-500 dark:border-emerald-500 bg-green-50/50 dark:bg-emerald-900/20 cursor-default' :
                            isUserChoice ? 'border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/20 cursor-default' : 'border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 opacity-50 cursor-default'}
          `}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
              ${isUserChoice || (showResult && isRight) ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
              ${showResult && isRight ? 'text-green-600 dark:text-emerald-400 font-bold' : isUserChoice ? 'text-red-600 dark:text-red-400 font-bold' : ''}
          `}>
                          {persianLetterMap[ch.key]}
                        </span>

                        <div
                          className={`[&>p]:m-0 flex-1 ${(showResult && isRight) || isUserChoice ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                          dangerouslySetInnerHTML={{ __html: ch.text || "" }}
                        />
                      </div>

                      {showResult && isRight && <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-emerald-400 shrink-0 ml-2" />}
                      {showResult && isUserChoice && !isRight && <XCircle className="w-6 h-6 text-red-500 dark:text-red-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded border border-blue-100/60 dark:border-blue-800/40">
                      <div className="flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold">پاسخ تشریحی</span>
                      </div>
                      {q.explanation ? (
                        <p dangerouslySetInnerHTML={{ __html: q.explanation }} className="text-slate-700 dark:text-slate-300 leading-8 text-justify"></p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">پاسخ تشریحی برای این سوال ثبت نشده است.</p>
                      )}
                    </div>

                    <div className="p-5 mt-3 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded border border-blue-100/60 dark:border-blue-800/40">
                      <div className="flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold"> نکات کلیدی کنکوری</span>
                      </div>
                      {q.examPoints ? (
                        <p dangerouslySetInnerHTML={{ __html: q.examPoints }} className="text-slate-700 dark:text-slate-300 leading-8 text-justify"></p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">نکته کنکوری برای این سوال ثبت نشده است.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-10 flex flex-col items-center justify-center text-center transition-colors">
            <Filter className="w-16 h-16 text-slate-200 dark:text-slate-600 mb-4" />
            <h3 className="text-slate-600 dark:text-slate-300 mb-2 font-medium">سوالی یافت نشد!</h3>
            <p className="text-slate-500 dark:text-slate-400">با فیلترهای انتخاب شده هیچ سوالی برای نمایش وجود ندارد.</p>
          </div>
        )}

        {totalCount > 0 && (
          <div className="fixed bottom-0 left-0 border border-gray-300 dark:border-slate-700 w-full p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 lg:relative lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none lg:p-0 lg:mt-6 lg:z-auto transition-colors">
            <div className="flex gap-4 items-center justify-between w-full max-w-lg mx-auto lg:max-w-none">
              <button
                disabled={currentStep === 1 || isAnyLoading}
                onClick={() => handleNavigation(currentStep - 1)}
                className="flex-1 flex items-center justify-center gap-2 h-10 sm:h-12 rounded text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                <ChevronRight className="w-5 h-5" />
                سوال قبلی
              </button>

              <button
                disabled={currentStep === totalCount || isAnyLoading}
                onClick={() => handleNavigation(currentStep + 1)}
                className="flex-1 flex items-center justify-center gap-2 h-10 sm:h-12 rounded bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-md shadow-slate-900/20 dark:shadow-emerald-900/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-base"
              >
                سوال بعدی
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center shrink-0">
                <MessageCircleQuestion className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-slate-800 dark:text-slate-100 font-semibold flex items-center gap-2">
                  پرسش و پاسخ با دیگران
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-7">
                  سوالت رو درباره همین تست بپرس یا به بقیه کمک کن. پاسخ‌های دقیق و کوتاه سریع‌تر دیده می‌شن.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
                <Users className="w-3.5 h-3.5" />
                گفت‌وگوی جمعی
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-400">
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
  );
}