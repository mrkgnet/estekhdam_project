
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  GraduationCap,
  Loader2,
  Filter,
  Users,
  MessageCircleQuestion,
  Sparkles,
  ListOrdered,
  ArrowUpLeft,
  X,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  AlignJustify,
  AlignRight,
  Maximize,
} from "lucide-react";

import CommentManagment from "@/components/comment/CommentManagmet";

// ==========================================
// TYPES & CONSTANTS
// ==========================================

type ChoiceKey = "A" | "B" | "C" | "D";
type ReaderTheme = "white" | "sepia" | "dark";
type LineHeight = "normal" | "relaxed" | "loose";
type TextAlign = "justify" | "right";
type ReaderWidth = "standard" | "wide";

const PERSIAN_LETTER_MAP: Record<ChoiceKey, string> = {
  A: "الف",
  B: "ب",
  C: "ج",
  D: "د",
};

export type DBQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  answerText: string;
  examPoints: string;
  questionCode: string;
  studyGuide?: string;

  reference?: {
    slug: string;
  } | null;
};

export type FormattedQuestion = {
  id: string;
  text: string;
  choices: {
    key: ChoiceKey;
    text: string;
  }[];
  correct: ChoiceKey;
  explanation: string;
  examPoints: string;
  code: string;
  studyGuide?: string;

  referenceSlug?: string | null;
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
  setSelected: React.Dispatch<
    React.SetStateAction<ChoiceKey | null>
  >;
  handleNavigation: (step: number) => void;
  setIsJumpModalOpen: (val: boolean) => void;
  commentsRef: React.RefObject<HTMLDivElement | null>;
}

// ==========================================
// SUB-COMPONENT: STUDY GUIDE MODAL
// ==========================================

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  content?: string;
}

function StudyGuideModal({
  isOpen,
  onClose,
  currentStep,
  content,
}: StudyGuideModalProps) {
  const [mounted, setMounted] = useState(false);

  const [fontSize, setFontSize] =
    useState<number>(16);

  const [theme, setTheme] =
    useState<ReaderTheme>("sepia");

  const [lineHeight, setLineHeight] =
    useState<LineHeight>("relaxed");

  const [textAlign, setTextAlign] =
    useState<TextAlign>("justify");

  const [readerWidth, setReaderWidth] =
    useState<ReaderWidth>("standard");

  const [scrollProgress, setScrollProgress] =
    useState<number>(0);

  const [isCopied, setIsCopied] =
    useState<boolean>(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const modalBoxRef =
    useRef<HTMLDivElement>(null);

  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // قفل اسکرول صفحه اصلی و جلوگیری از لرزش ناشی از نوار اسکرول
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    const originalPaddingRight =
      document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;

      document.body.style.paddingRight =
        originalPaddingRight;
    };
  }, [isOpen]);

  // کنترل تغییر حالت تمام‌صفحه
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, []);

  // بستن مدال با فشردن کلید Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !document.fullscreenElement
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [isOpen, onClose]);

  // محاسبه پیشرفت اسکرول برای نوار پیشرفت مطالعه
  const handleScroll = () => {
    const element =
      scrollContainerRef.current;

    if (!element) return;

    const totalHeight =
      element.scrollHeight -
      element.clientHeight;

    if (totalHeight <= 0) {
      setScrollProgress(100);
      return;
    }

    const currentScroll = element.scrollTop;

    const progress = Math.min(
      100,
      Math.max(
        0,
        (currentScroll / totalHeight) * 100
      )
    );

    setScrollProgress(Math.round(progress));
  };

  const toggleFullscreen = () => {
    if (!modalBoxRef.current) return;

    if (!document.fullscreenElement) {
      modalBoxRef.current
        .requestFullscreen()
        .catch(() => { });
    } else {
      document
        .exitFullscreen()
        .catch(() => { });
    }
  };

  // کپی متن خام درسنامه
  const handleCopyContent = async () => {
    if (!content) return;

    try {
      const textOnly =
        scrollContainerRef.current?.innerText ||
        content.replace(/<[^>]+>/g, "");

      await navigator.clipboard.writeText(
        textOnly
      );

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      // در صورت عدم دسترسی به کلیپ‌بورد
    }
  };

  const themeClasses = useMemo(() => {
    switch (theme) {
      case "white":
        return "bg-white text-slate-900 border-slate-200";

      case "dark":
        return "bg-[#141417] text-[#e4e4e7] border-zinc-800";

      case "sepia":
      default:
        return "bg-[#fbf0d9] text-[#3d2e1e] border-[#ebd8b2]";
    }
  }, [theme]);

  const lineHeightClass = useMemo(() => {
    switch (lineHeight) {
      case "normal":
        return "leading-7";

      case "loose":
        return "leading-[2.8rem]";

      case "relaxed":
      default:
        return "leading-9";
    }
  }, [lineHeight]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`درسنامه سوال ${currentStep}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 select-none sm:select-auto"
      onClick={onClose}
    >
      <div
        ref={modalBoxRef}
        className={`w-full max-w-5xl ${isFullscreen
            ? "h-full max-h-none rounded-none border-0"
            : "h-[92vh] max-h-[92dvh] rounded-2xl border"
          } flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 relative ${themeClasses}`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* هدر و تولبار ثابت مدال */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 border-b border-black/10 dark:border-white/10 shrink-0 bg-inherit backdrop-blur-md">
          {/* سمت راست: عنوان و نشانگر پیشرفت مطالعه */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">
                درسنامه سوال {currentStep}
              </h3>

              <span className="hidden sm:block text-[11px] opacity-60 tabular-nums">
                مطالعه شده: {scrollProgress}%
              </span>
            </div>
          </div>

          {/* فیلترها و تنظیمات مطالعه */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            {/* تم مطالعه */}
            <div className="flex items-center rounded-lg border border-black/10 dark:border-white/10 p-0.5 bg-black/5 dark:bg-white/5">
              {(
                [
                  "white",
                  "sepia",
                  "dark",
                ] as ReaderTheme[]
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`px-2 py-1 rounded-md transition-all ${theme === t
                      ? t === "dark"
                        ? "bg-zinc-800 text-white font-bold shadow-xs"
                        : t === "sepia"
                          ? "bg-[#ecd7b0] text-[#3d2e1e] font-bold shadow-xs"
                          : "bg-white text-black font-bold shadow-xs"
                      : "opacity-75 hover:opacity-100"
                    }`}
                >
                  {t === "white"
                    ? "روز"
                    : t === "sepia"
                      ? "کاهی"
                      : "شب"}
                </button>
              ))}
            </div>

            {/* کنترل اندازه فونت */}
            <div className="flex items-center rounded-lg border border-black/10 dark:border-white/10 p-0.5 bg-black/5 dark:bg-white/5">
              <button
                type="button"
                onClick={() =>
                  setFontSize((prev) =>
                    Math.max(13, prev - 1)
                  )
                }
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="کوچک‌تر کردن متن"
                title="کاهش قلم"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="px-1.5 font-bold tabular-nums">
                {fontSize}
              </span>

              <button
                type="button"
                onClick={() =>
                  setFontSize((prev) =>
                    Math.min(26, prev + 1)
                  )
                }
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="بزرگ‌تر کردن متن"
                title="افزایش قلم"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* فاصله بین خطوط */}
            <div className="hidden md:flex items-center rounded-lg border border-black/10 dark:border-white/10 p-0.5 bg-black/5 dark:bg-white/5">
              {(
                [
                  "normal",
                  "relaxed",
                  "loose",
                ] as LineHeight[]
              ).map((lh) => (
                <button
                  key={lh}
                  type="button"
                  onClick={() =>
                    setLineHeight(lh)
                  }
                  className={`px-2 py-1 rounded-md transition-all ${lineHeight === lh
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "opacity-75 hover:opacity-100"
                    }`}
                >
                  {lh === "normal"
                    ? "خط ۱"
                    : lh === "relaxed"
                      ? "خط ۲"
                      : "خط ۳"}
                </button>
              ))}
            </div>

            {/* فیلتر تراز متن */}
            <div className="hidden sm:flex items-center rounded-lg border border-black/10 dark:border-white/10 p-0.5 bg-black/5 dark:bg-white/5">
              <button
                type="button"
                onClick={() =>
                  setTextAlign("justify")
                }
                className={`p-1 rounded transition-all ${textAlign === "justify"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "opacity-75 hover:opacity-100"
                  }`}
                title="تراز دوطرفه (Justified)"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setTextAlign("right")
                }
                className={`p-1 rounded transition-all ${textAlign === "right"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "opacity-75 hover:opacity-100"
                  }`}
                title="راست‌چین"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* فیلتر عرض کادر مطالعه */}
            <button
              type="button"
              onClick={() =>
                setReaderWidth((prev) =>
                  prev === "standard"
                    ? "wide"
                    : "standard"
                )
              }
              className={`p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hidden sm:block ${readerWidth === "wide"
                  ? "bg-blue-600 text-white border-blue-600"
                  : ""
                }`}
              title={
                readerWidth === "standard"
                  ? "نمای عریض"
                  : "نمای متمرکز"
              }
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>

            {/* دکمه کپی متن */}
            {content && (
              <button
                type="button"
                onClick={handleCopyContent}
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hidden sm:block"
                title="کپی متن درسنامه"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* تمام‌صفحه */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hidden sm:block"
              title={
                isFullscreen
                  ? "خروج از تمام‌صفحه"
                  : "تمام‌صفحه"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* دکمه بستن */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-rose-500/40 bg-rose-50/80 text-rose-600 shadow-sm transition-all duration-150 hover:scale-105 hover:border-rose-600 hover:bg-rose-600 hover:text-white dark:border-rose-500/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white shrink-0 active:scale-95"
              aria-label="بستن پنجره"
              title="بستن درسنامه (Esc)"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* نوار پیشرفت مطالعه */}
        <div className="h-0.5 w-full bg-black/5 dark:bg-white/5 shrink-0">
          <div
            className="h-full bg-blue-600 transition-all duration-150"
            style={{
              width: `${scrollProgress}%`,
            }}
          />
        </div>

        {/* محتوای درسنامه */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-5 sm:p-8 lg:p-10 overflow-y-auto min-h-0 flex-1 overscroll-contain"
        >
          <div
            className={`mx-auto transition-all duration-200 ${readerWidth === "wide"
                ? "max-w-5xl"
                : "max-w-3xl"
              }`}
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            {content ? (
              <div
                className={`prose max-w-none ${textAlign === "justify"
                    ? "text-justify"
                    : "text-right"
                  } ${lineHeightClass} ${theme === "dark"
                    ? "prose-invert"
                    : ""
                  }`}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            ) : (
              <p className="py-16 text-center text-sm opacity-60">
                درسنامه‌ای برای این سؤال ثبت نشده است.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ==========================================
// MAIN COMPONENT: EXAM CONTENT
// ==========================================

export default function ExamContent({
  fontSize,
  q,
  dbQuestion,
  currentStep,
  totalCount,
  progressPercentage,
  isAnyLoading,
  selected,
  setSelected,
  handleNavigation,
  setIsJumpModalOpen,
  commentsRef,
}: ExamContentProps) {
  const [isLessonModalOpen, setIsLessonModalOpen] =
    useState(false);

  const showResult = selected !== null;

  const studyGuideContent =
    q?.studyGuide || dbQuestion?.studyGuide;

  return (
    <main
      className="w-full flex-1 min-w-0 pb-24 lg:pb-8"
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      <div className="space-y-4">
        {/* HEADER SECTION */}
        <header className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-4 px-4 py-3.5 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* RIGHT SIDE — TITLE */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">
                    سوالات و درسنامه
                  </h1>

                  {totalCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      در حال تمرین
                    </span>
                  )}
                </div>

                {totalCount > 0 ? (
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>سؤال</span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {currentStep}
                    </span>

                    <span className="text-slate-300 dark:text-slate-600">
                      /
                    </span>

                    <span>{totalCount}</span>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                    سوالی با این فیلترها یافت نشد.
                  </p>
                )}
              </div>
            </div>

            {/* LEFT SIDE — ACTIONS + PROGRESS */}
            {totalCount > 0 && (
              <div className="flex w-full items-center gap-3 lg:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    setIsJumpModalOpen(true)
                  }
                  disabled={isAnyLoading}
                  className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  <ListOrdered className="h-4 w-4 text-red-700 transition-colors group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200" />

                  <span className="text-red-700">
                    برو به سؤاله
                  </span>

                  <ArrowUpLeft className="h-3.5 w-3.5 text-red-700" />
                </button>

                <div className="hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-700" />

                <div className="min-w-0 flex-1 lg:w-[210px] lg:flex-none">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      پیشرفت آزمون
                    </span>

                    <span className="text-[11px] font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      className="h-full rounded-full bg-slate-800 dark:bg-slate-200"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progressPercentage}%`,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>

                <div className="hidden h-10 min-w-[42px] items-center justify-center rounded-xl bg-slate-50 px-2 text-xs font-semibold tabular-nums text-slate-700 sm:flex dark:bg-slate-800 dark:text-slate-200">
                  {progressPercentage}%
                </div>
              </div>
            )}
          </div>

          {totalCount > 0 && (
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${progressPercentage}%`,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              />
            </div>
          )}
        </header>

        {/* QUESTION SECTION */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {isAnyLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px] dark:bg-slate-950/60">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-500" />
            </div>
          )}

          {q ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="p-4 sm:p-5 lg:p-6"
              >
                {/* QUESTION CONTENT BOX */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between gap-3 border-b border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/30">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm dark:bg-blue-500">
                        <MessageCircleQuestion className="h-4.5 w-4.5" />
                      </div>

                      <div>
                        <span className="block text-xs font-medium text-blue-600 dark:text-blue-400">
                          سوال {currentStep}
                        </span>

                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                          صورت سؤال
                        </span>
                      </div>
                    </div>

                    {/* =================================== */}
                    {/* رفرنس واقعی همین سؤال */}
                    {/* =================================== */}

                    {q.referenceSlug && (
                      <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 shadow-sm transition-colors dark:border-blue-800/60 dark:bg-blue-950/30">
                        <BookOpen className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

                        <span className="shrink-0 text-[11px] font-medium text-slate-800 dark:text-slate-400">
                          مرجع سؤال:
                        </span>

                        <span className="h-4 w-px shrink-0 bg-blue-200 dark:bg-blue-800" />

                        <span
                          dir="ltr"
                          title={q.referenceSlug}
                          className="min-w-0 break-all text-left text-xs font-bold tracking-wide text-orange-900 dark:text-blue-300"
                        >
                          {q.referenceSlug}
                        </span>
                      </div>
                    )}


                    {(studyGuideContent || q.code) && (
                      <button
                        type="button"
                        onClick={() =>
                          setIsLessonModalOpen(true)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-white px-2.5 py-1 text-[13px] font-bold text-slate-600 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        درسنامه سوال
                      </button>
                    )}
                  </div>

                  <div className="px-4 py-5 sm:px-5 sm:py-6">
                    <div
                      className="prose max-w-none prose-slate dark:prose-invert prose-p:my-0 prose-p:leading-8 prose-headings:my-0 prose-li:my-0 text-[15px] leading-8 text-slate-800 dark:text-slate-200"
                      dangerouslySetInnerHTML={{
                        __html: q.text,
                      }}
                    />
                  </div>
                </div>

                {/* OPTIONS SECTION */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-emerald-500" />

                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    گزینه‌های پاسخ
                  </h2>

                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    یکی را انتخاب کنید
                  </span>
                </div>

                <div className="space-y-2.5">
                  {q.choices.map((ch) => {
                    const isUserChoice =
                      selected === ch.key;

                    const isRight =
                      ch.key === q.correct;

                    let buttonStyle =
                      "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800";

                    let badgeStyle =
                      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

                    if (showResult) {
                      if (isRight) {
                        buttonStyle =
                          "border-emerald-500 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-950/20";

                        badgeStyle =
                          "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400";
                      } else if (isUserChoice) {
                        buttonStyle =
                          "border-rose-500 bg-rose-50/60 dark:border-rose-500 dark:bg-rose-950/20";

                        badgeStyle =
                          "border-rose-200 bg-white text-rose-700 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-400";
                      } else {
                        buttonStyle =
                          "border-slate-200 bg-slate-50/60 opacity-75 dark:border-slate-700 dark:bg-slate-800/40";
                      }
                    }

                    return (
                      <button
                        key={ch.key}
                        disabled={
                          showResult || isAnyLoading
                        }
                        onClick={() =>
                          setSelected(ch.key)
                        }
                        className={`w-full rounded-xl border-2 px-3.5 py-3 text-right transition sm:px-4 sm:py-3.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:focus-visible:ring-blue-900/40 ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold sm:h-9 sm:w-9 sm:text-sm ${badgeStyle}`}
                          >
                            {PERSIAN_LETTER_MAP[ch.key]}
                          </span>

                          <div
                            className={`min-w-0 flex-1 text-sm sm:text-[15px] [&>p]:m-0 [&>ul]:my-0 [&>ol]:my-0 ${isRight || isUserChoice
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "text-slate-700 dark:text-slate-300"
                              }`}
                            dangerouslySetInnerHTML={{
                              __html: ch.text || "",
                            }}
                          />

                          {showResult && isRight && (
                            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
                          )}

                          {showResult &&
                            isUserChoice &&
                            !isRight && (
                              <XCircle className="h-4.5 w-4.5 shrink-0 text-rose-500" />
                            )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ANSWER & EXPLANATION SECTION */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="mt-4 space-y-2.5 overflow-hidden border-t border-slate-200 pt-4 dark:border-slate-700"
                    >
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
                        <div className="mb-2.5 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                          <Lightbulb className="h-4.5 w-4.5 text-amber-500" />

                          <span className="text-sm font-semibold">
                            پاسخ تشریحی
                          </span>
                        </div>

                        {q.explanation ? (
                          <div
                            className="text-sm leading-7 text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{
                              __html: q.explanation,
                            }}
                          />
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            پاسخ تشریحی برای این سوال ثبت نشده است.
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
                        <div className="mb-2.5 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                          <Lightbulb className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />

                          <span className="text-sm font-semibold">
                            نکات کلیدی کنکوری
                          </span>
                        </div>

                        {q.examPoints ? (
                          <div
                            className="text-sm leading-7 text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{
                              __html: q.examPoints,
                            }}
                          />
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            نکته کنکوری برای این سوال ثبت نشده است.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                <Filter className="h-6 w-6" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                سوالی یافت نشد
              </h3>

              <p className="mt-1.5 max-w-md text-xs leading-6 text-slate-500 dark:text-slate-400">
                با فیلترهای انتخاب شده هیچ سوالی برای نمایش وجود ندارد.
              </p>
            </div>
          )}

          {/* BOTTOM STEP NAVIGATION */}
          {totalCount > 0 && (
            <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 lg:static lg:border-t-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <div className="mx-auto flex max-w-lg gap-2.5 lg:max-w-none">
                <button
                  type="button"
                  disabled={
                    currentStep === 1 ||
                    isAnyLoading
                  }
                  onClick={() =>
                    handleNavigation(currentStep - 1)
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                  سوال قبلی
                </button>

                <button
                  type="button"
                  disabled={
                    currentStep === totalCount ||
                    isAnyLoading
                  }
                  onClick={() =>
                    handleNavigation(currentStep + 1)
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  سوال بعدی
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* COMMENTS SECTION */}
        <section
          ref={commentsRef}
          className="rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5"
        >
          {dbQuestion?.id && (
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400">
                    <MessageCircleQuestion className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      پرسش و پاسخ
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </h3>

                    <p className="mt-0.5 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      سوال مرتبط با همین تست را بپرس یا به دیگران پاسخ بده.
                    </p>
                  </div>
                </div>

                <div className="hidden flex-wrap gap-2 sm:flex sm:justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Users className="h-3.5 w-3.5" />
                    گفت‌وگوی جمعی
                  </span>

                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-400">
                    پاسخ کوتاه و دقیق
                  </span>
                </div>
              </div>

              <CommentManagment
                targetId={dbQuestion.id}
                targetType="question"
              />
            </div>
          )}
        </section>
      </div>

      {/* MODAL LESSON READER */}
      <StudyGuideModal
        isOpen={isLessonModalOpen}
        onClose={() =>
          setIsLessonModalOpen(false)
        }
        currentStep={currentStep}
        content={studyGuideContent}
      />
    </main>
  );
}
