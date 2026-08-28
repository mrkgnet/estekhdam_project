
"use client";

import React from "react";
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

const persianLetterMap: Record<ChoiceKey, string> = {
  A: "الف",
  B: "ب",
  C: "ج",
  D: "د",
};

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
  const showResult = selected !== null;

  return (
    <main
      className="w-full flex-1 min-w-0 pb-24 lg:pb-8"
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="space-y-4">

        {/* ==================================================
            MODERN HEADER
        ================================================== */}
        <header
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          {/* Main toolbar */}
          <div className="flex flex-col gap-4 px-4 py-3.5 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">

            {/* -----------------------------------------------
                RIGHT SIDE — TITLE
            ------------------------------------------------ */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                "
              >
                <GraduationCap className="h-5 w-5" />
              </div>

              {/* Title & status */}
              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h1
                    className="
                      truncate
                      text-[15px]
                      font-semibold
                      tracking-tight
                      text-slate-900
                      dark:text-slate-100
                      sm:text-base
                    "
                  >
                    سوالات و درسنامه
                  </h1>

                  {totalCount > 0 && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-emerald-50
                        px-2
                        py-0.5
                        text-[10px]
                        font-medium
                        text-emerald-700
                        dark:bg-emerald-950/40
                        dark:text-emerald-400
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      در حال تمرین
                    </span>
                  )}
                </div>

                {totalCount > 0 ? (
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      سؤال
                    </span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {currentStep}
                    </span>

                    <span className="text-slate-300 dark:text-slate-600">
                      /
                    </span>

                    <span>
                      {totalCount}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                    سوالی با این فیلترها یافت نشد.
                  </p>
                )}
              </div>
            </div>

            {/* -----------------------------------------------
                LEFT SIDE — ACTIONS + PROGRESS
            ------------------------------------------------ */}
            {totalCount > 0 && (
              <div className="flex w-full items-center gap-3 lg:w-auto">

                {/* Jump button */}
                <button
                  type="button"
                  onClick={() => setIsJumpModalOpen(true)}
                  disabled={isAnyLoading}
                  className="
                    group
                    inline-flex
                    h-10
                    shrink-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-xs
                    font-medium
                    text-slate-700
                    shadow-sm
                    transition-all
                    hover:border-slate-300
                    hover:bg-slate-50
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:hover:border-slate-600
                    dark:hover:bg-slate-800
                  "
                >
                  <ListOrdered
                    className="
                      h-4
                      w-4
                      text-red-700
                      transition-colors
                      group-hover:text-slate-800
                      dark:text-slate-400
                      dark:group-hover:text-slate-200
                    "
                  />

                  <span className="text-red-700">
                    برو به سؤاله
                  </span>

                  <ArrowUpLeft className="h-3.5 w-3.5 text-red-700" />
                </button>

                {/* Vertical divider */}
                <div className="hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-700" />

                {/* Progress */}
                <div className="min-w-0 flex-1 lg:w-[210px] lg:flex-none">

                  <div className="mb-1.5 flex items-center justify-between">

                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      پیشرفت آزمون
                    </span>

                    <span className="text-[11px] font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div
                    className="
                      h-1.5
                      overflow-hidden
                      rounded-full
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  >
                    <motion.div
                      className="
                        h-full
                        rounded-full
                        bg-slate-800
                        dark:bg-slate-200
                      "
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

                {/* Percentage indicator */}
                <div
                  className="
                    hidden
                    h-10
                    min-w-[42px]
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-50
                    px-2
                    text-xs
                    font-semibold
                    tabular-nums
                    text-slate-700
                    sm:flex
                    dark:bg-slate-800
                    dark:text-slate-200
                  "
                >
                  {progressPercentage}%
                </div>
              </div>
            )}
          </div>

          {/* -----------------------------------------------
              PROGRESS STRIP
          ------------------------------------------------ */}
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

        {/* ==================================================
            QUESTION SECTION
        ================================================== */}
        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          {isAnyLoading && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-white/70
                backdrop-blur-[2px]
                dark:bg-slate-950/60
              "
            >
              <Loader2
                className="
                  h-8
                  w-8
                  animate-spin
                  text-emerald-600
                  dark:text-emerald-500
                "
              />
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

                {/* ==================================================
                    QUESTION BOX
                ================================================== */}
                <div
                  className="
                    mb-5
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50/40
                    dark:border-blue-900/60
                    dark:bg-blue-950/20
                  "
                >

                  {/* Question header */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-b
                      border-blue-200
                      bg-blue-50
                      px-4
                      py-3
                      dark:border-blue-900/60
                      dark:bg-blue-950/30
                    "
                  >
                    <div className="flex items-center gap-2.5">

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-600
                          text-white
                          shadow-sm
                          dark:bg-blue-500
                        "
                      >
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

                    {q.code && (
                      <span
                        className="
                          rounded-lg
                          border
                          border-blue-200
                          bg-white
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          text-slate-500
                          dark:border-blue-800
                          dark:bg-slate-900
                          dark:text-slate-400
                        "
                      >
                        {q.code}
                      </span>
                    )}
                  </div>

                  {/* Question text */}
                  <div className="px-4 py-5 sm:px-5 sm:py-6">
                    <div
                      className="
                        prose
                        max-w-none
                        prose-slate
                        dark:prose-invert
                        prose-p:my-0
                        prose-p:leading-8
                        prose-headings:my-0
                        prose-li:my-0
                        text-[15px]
                        leading-8
                        text-slate-800
                        dark:text-slate-200
                      "
                      dangerouslySetInnerHTML={{
                        __html: q.text,
                      }}
                    />
                  </div>
                </div>

                {/* ==================================================
                    OPTIONS TITLE
                ================================================== */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-emerald-500" />

                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    گزینه‌های پاسخ
                  </h2>

                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    یکی را انتخاب کنید
                  </span>
                </div>

                {/* ==================================================
                    OPTIONS
                ================================================== */}
                <div className="space-y-2.5">
                  {q.choices.map((ch) => {
                    const isUserChoice =
                      selected === ch.key;

                    const isRight =
                      ch.key === q.correct;

                    return (
                      <button
                        key={ch.key}
                        disabled={
                          showResult ||
                          isAnyLoading
                        }
                        onClick={() =>
                          setSelected(ch.key)
                        }
                        className={[
                          "w-full rounded-xl border-2 px-3.5 py-3 text-right transition sm:px-4 sm:py-3.5",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:focus-visible:ring-blue-900/40",

                          !showResult
                            ? "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            : isRight
                              ? "border-emerald-500 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-950/20"
                              : isUserChoice
                                ? "border-rose-500 bg-rose-50/60 dark:border-rose-500 dark:bg-rose-950/20"
                                : "border-slate-200 bg-slate-50/60 opacity-75 dark:border-slate-700 dark:bg-slate-800/40",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">

                          <span
                            className={[
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold sm:h-9 sm:w-9 sm:text-sm",

                              isRight
                                ? "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400"
                                : isUserChoice
                                  ? "border-rose-200 bg-white text-rose-700 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-400"
                                  : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                            ].join(" ")}
                          >
                            {persianLetterMap[ch.key]}
                          </span>

                          <div
                            className={[
                              "min-w-0 flex-1 text-sm sm:text-[15px]",

                              isRight ||
                              isUserChoice
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "text-slate-700 dark:text-slate-300",

                              "[&>p]:m-0 [&>ul]:my-0 [&>ol]:my-0",
                            ].join(" ")}
                            dangerouslySetInnerHTML={{
                              __html: ch.text || "",
                            }}
                          />

                          {showResult &&
                            isRight && (
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

                {/* ==================================================
                    ANSWER + EXPLANATION
                ================================================== */}
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
                      className="
                        mt-4
                        space-y-2.5
                        overflow-hidden
                        border-t
                        border-slate-200
                        pt-4
                        dark:border-slate-700
                      "
                    >

                      {/* Explanation */}
                      <div
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-3.5
                          dark:border-slate-700
                          dark:bg-slate-800/50
                          sm:p-4
                        "
                      >
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
                              __html:
                                q.explanation,
                            }}
                          />
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            پاسخ تشریحی برای این سوال ثبت نشده است.
                          </p>
                        )}
                      </div>

                      {/* Exam points */}
                      <div
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-3.5
                          dark:border-slate-700
                          dark:bg-slate-800/50
                          sm:p-4
                        "
                      >
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
                              __html:
                                q.examPoints,
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
              <div
                className="
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  text-slate-400
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-500
                "
              >
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

          {/* ==================================================
              NAVIGATION
          ================================================== */}
          {totalCount > 0 && (
            <div
              className="
                sticky
                bottom-0
                z-20
                border-t
                border-slate-200
                bg-white/95
                p-3
                backdrop-blur-xl
                dark:border-slate-700
                dark:bg-slate-900/95
                lg:static
                lg:border-t-0
                lg:bg-transparent
                lg:p-0
                lg:backdrop-blur-none
              "
            >
              <div className="mx-auto flex max-w-lg gap-2.5 lg:max-w-none">

                <button
                  disabled={
                    currentStep === 1 ||
                    isAnyLoading
                  }
                  onClick={() =>
                    handleNavigation(
                      currentStep - 1
                    )
                  }
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-3.5
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:border-slate-600
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:hover:bg-slate-800
                  "
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                  سوال قبلی
                </button>

                <button
                  disabled={
                    currentStep === totalCount ||
                    isAnyLoading
                  }
                  onClick={() =>
                    handleNavigation(
                      currentStep + 1
                    )
                  }
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-3.5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-slate-800
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:bg-emerald-600
                    dark:hover:bg-emerald-500
                  "
                >
                  سوال بعدی
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>

              </div>
            </div>
          )}
        </section>

        {/* ==================================================
            COMMENTS
        ================================================== */}
        <section
          ref={commentsRef}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            dark:border-slate-700
            dark:bg-slate-900
            sm:p-5
          "
        >
          {dbQuestion?.id && (
            <div className="space-y-3.5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      text-indigo-600
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-indigo-400
                    "
                  >
                    <MessageCircleQuestion className="h-4.5 w-4.5" />
                  </div>

                  <div>

                    <h3
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-900
                        dark:text-slate-100
                      "
                    >
                      پرسش و پاسخ

                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-6
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      سوال مرتبط با همین تست را بپرس یا به دیگران پاسخ بده.
                    </p>

                  </div>
                </div>

                <div className="hidden flex-wrap gap-2 sm:flex sm:justify-end">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-slate-200
                      bg-slate-50
                      px-2.5
                      py-1
                      text-[11px]
                      text-slate-600
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-slate-300
                    "
                  >
                    <Users className="h-3.5 w-3.5" />
                    گفت‌وگوی جمعی
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-emerald-200
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-[11px]
                      text-emerald-700
                      dark:border-emerald-800/60
                      dark:bg-emerald-900/30
                      dark:text-emerald-400
                    "
                  >
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
    </main>
  );
}

