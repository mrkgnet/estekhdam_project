"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchDataQues } from "@/actions/user/resources/course/DataQues/Actions";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ExamSidebar from "@/components/user/questions/ExamSidebar";
import ExamContent from "@/components/user/questions/ExamContent";

// 👈 ایمپورت کامپوننت‌های جدا شده (مسیر زیر را متناسب با پوشه خود تنظیم کنید)

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

type Props = {
  initialResponse: any;
  courseId: string;
  currentStep: number;
  chapterId?: string;
  questionType?: string;
  pname: string;
};

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
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(14);

  // === State برای دارک مود ===
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // === State برای مدال پرش به سوال ===
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [jumpTarget, setJumpTarget] = useState("");

  const { isLoggedIn, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetStep, setTargetStep] = useState<number | null>(null);

  // === Effect بررسی اولیه و لود شدن کامپوننت برای تم ===
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem("theme");
      const root = document.documentElement;
      if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        setIsDarkMode(true);
        root.classList.add("dark");
      } else {
        setIsDarkMode(false);
        root.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    setSelected(null);
  }, [dbQuestion?.id]);

  useEffect(() => {
    if (isJumpModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isJumpModalOpen]);

  // === تابع تغییر تم ===
  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

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
        startTransition(() => router.push(`/plans`));
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
    if (type === currentQuestionType) return;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      if (type) params.set("questionType", type);
      else params.delete("questionType");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const formatQuestion = (dbQ?: DBQuestion): FormattedQuestion => {
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
    <div className="min-h-screen max-w-7xl text-bodyall m-auto text-right pb-24 lg:pb-8 dark:text-slate-200 transition-colors duration-300" dir="rtl">
      <div className="mt-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isJumpModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              onClick={() => setIsJumpModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, y: -150, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -120, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto border border-slate-200 dark:border-slate-700">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">پرش به سوال خاص</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    شماره سوال مورد نظر خود را وارد کنید (بین ۱ تا <span className="font-bold text-slate-700 dark:text-slate-300">{totalCount}</span>).
                  </p>
                  <input
                    type="number" min={1} max={totalCount} value={jumpTarget}
                    onChange={(e) => setJumpTarget(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleJumpSubmit(); }}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent transition-all dark:text-slate-100"
                    placeholder="مثلاً: 5" autoFocus
                  />
                </div>
                <div className="flex bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 p-4 gap-3 justify-end">
                  <button onClick={() => setIsJumpModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white rounded-xl transition-colors">انصراف</button>
                  <button onClick={handleJumpSubmit} className="px-5 py-2.5 text-sm font-medium bg-red-400 dark:bg-red-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-emerald-600 active:scale-95 transition-all shadow-sm">تایید و انتقال</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* ۱. اضافه شدن سایدبار جدا شده */}
        <ExamSidebar 
          fontSize={fontSize}
          setFontSize={setFontSize}
          mounted={mounted}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          commentsRef={commentsRef}
          questionCode={q?.code}
          chapters={chapters}
          currentChapterId={currentChapterId}
          currentQuestionType={currentQuestionType}
          isAnyLoading={isAnyLoading}
          getClearFiltersUrl={getClearFiltersUrl}
          handleChapterClick={handleChapterClick}
          handleTypeClick={handleTypeClick}
        />

        {/* ۲. اضافه شدن محتوای سوالات جدا شده */}
        <ExamContent 
          fontSize={fontSize}
          q={q}
          dbQuestion={dbQuestion}
          currentStep={currentStep}
          totalCount={totalCount}
          progressPercentage={progressPercentage}
          isAnyLoading={isAnyLoading}
          selected={selected}
          setSelected={setSelected}
          handleNavigation={handleNavigation}
          setIsJumpModalOpen={setIsJumpModalOpen}
          commentsRef={commentsRef}
        />
        
      </div>
    </div>
  );
}