"use client";

import React, { useActionState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSpreadsheet } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import addGovQuestion from "@/actions/admin/questions/gov/add/Actions";
import * as XLSX from "xlsx";

// ==================== Types ====================
interface Chapter {
  id: string;
  order: number;
  title: string;
  categoryChapter?: {
    name: string;
  };
}

interface CategoryChapter {
  id: string;
  name: string;
}

interface ActionState {
  success?: boolean;
  message?: string;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  chapters: Chapter[];
  categoryChapters: CategoryChapter[];
  questionText: string;
  setQuestionText: (value: string) => void;
  answerText: string;
  setAnswerText: (value: string) => void;
  examPoints: string;
  setExamPoints: (value: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswer: number | null;
  setCorrectAnswer: (index: number | null) => void;
}

// ==================== Constants ====================
const EXCEL_COLUMNS = {
  QUESTION_TEXT: 0,
  OPTION_1: 1,
  OPTION_2: 2,
  OPTION_3: 3,
  OPTION_4: 4,
  ANSWER_TEXT: 5,
  EXAM_POINTS: 6,
  CORRECT_ANSWER: 7,
} as const;

type ExcelRow = (string | number | boolean | undefined)[];

// ==================== Sub-components ====================
interface OptionEditorProps {
  index: number;
  value: string;
  isCorrect: boolean;
  onValueChange: (value: string) => void;
  onSetCorrect: () => void;
}

const OptionEditor = React.memo<OptionEditorProps>(
  ({ index, value, isCorrect, onValueChange, onSetCorrect }) => {
    return (
      <div
        className={`flex flex-col border rounded p-3 transition-colors ${
          isCorrect
            ? "border-green-500 bg-green-50/30 shadow-sm"
            : "border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 mb-2 border-b pb-2">
          <input
            type="radio"
            name="correctAnswer"
            value={index}
            required
            onChange={onSetCorrect}
            checked={isCorrect}
            className="w-4 h-4 cursor-pointer accent-green-600"
          />
          <span className="text-sm font-bold text-gray-700">
            گزینه {index + 1}
          </span>
        </div>
        <input type="hidden" name={`option_${index}`} value={value} />
        <div className="flex-grow">
          <RichTextEditor value={value} onChange={onValueChange} />
        </div>
      </div>
    );
  }
);

OptionEditor.displayName = "OptionEditor";

// ==================== Excel Parser ====================
function parseExcelRow(row: ExcelRow) {
  const getString = (index: number): string => {
    const value = row[index];
    return value !== undefined && value !== null ? String(value) : "";
  };

  const getCorrectAnswerIndex = (index: number): number | null => {
    const value = row[index];
    if (value === undefined || value === null) return null;

    const parsed = parseInt(String(value), 10);
    return parsed >= 1 && parsed <= 4 ? parsed - 1 : null;
  };

  return {
    questionText: getString(EXCEL_COLUMNS.QUESTION_TEXT),
    options: [
      getString(EXCEL_COLUMNS.OPTION_1),
      getString(EXCEL_COLUMNS.OPTION_2),
      getString(EXCEL_COLUMNS.OPTION_3),
      getString(EXCEL_COLUMNS.OPTION_4),
    ],
    answerText: getString(EXCEL_COLUMNS.ANSWER_TEXT),
    examPoints: getString(EXCEL_COLUMNS.EXAM_POINTS),
    correctAnswer: getCorrectAnswerIndex(EXCEL_COLUMNS.CORRECT_ANSWER),
  };
}

// ==================== Main Component ====================
export default function AddQuestionModal({
  isOpen,
  onClose,
  productId,
  chapters,
  categoryChapters,
  questionText,
  setQuestionText,
  answerText,
  setAnswerText,
  examPoints,
  setExamPoints,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
}: AddQuestionModalProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(addGovQuestion, null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      setOptions((prev) => {
        const newOptions = [...prev];
        newOptions[index] = value;
        return newOptions;
      });
    },
    [setOptions]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onerror = () => {
        alert("خطا در خواندن فایل. لطفاً دوباره تلاش کنید.");
      };

      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          if (!bstr) {
            alert("محتوای فایل خالی است.");
            return;
          }

          const wb = XLSX.read(bstr as string, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json<ExcelRow>(ws, { header: 1 });

          if (data.length < 2) {
            alert("فایل اکسل خالی است یا داده‌ای ندارد.");
            return;
          }

          const parsed = parseExcelRow(data[1]);

          setQuestionText(parsed.questionText);
          setOptions(parsed.options);
          setAnswerText(parsed.answerText);
          setExamPoints(parsed.examPoints);
          if (parsed.correctAnswer !== null) {
            setCorrectAnswer(parsed.correctAnswer);
          }
        } catch (error) {
          console.error("خطا در پردازش فایل اکسل:", error);
          alert("فرمت فایل اکسل صحیح نیست. لطفاً از قالب مشخص شده استفاده کنید.");
        }
      };

      reader.readAsBinaryString(file);

      // Reset input for re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setQuestionText, setOptions, setAnswerText, setExamPoints, setCorrectAnswer]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Memoized chapter options
  const chapterOptions = useMemo(
    () =>
      chapters.map((chapter) => {
        const categoryPrefix = chapter.categoryChapter?.name
          ? `[${chapter.categoryChapter.name}] `
          : "";
        return (
          <option key={chapter.id} value={chapter.id}>
            {categoryPrefix}فصل {chapter.order}: {chapter.title}
          </option>
        );
      }),
    [chapters]
  );

  // Memoized category options
  const categoryOptions = useMemo(
    () =>
      categoryChapters.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      )),
    [categoryChapters]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white p-6 rounded w-full max-w-4xl shadow-xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ==================== Header ==================== */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="modal-title" className="text-xl font-bold">
                  ثبت سوال جدید
                </h2>
                <div className="h-6 w-[1px] bg-gray-300 mx-2 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-all text-sm font-medium cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  وارد کردن از اکسل
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls"
                  className="hidden"
                  aria-label="آپلود فایل اکسل"
                />
              </div>
              <button
                onClick={onClose}
                aria-label="بستن مودال"
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* ==================== Form ==================== */}
            <form
              action={formAction}
              className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 flex-1"
            >
              <input type="hidden" name="productId" value={productId} />

              {/* Question Type & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="questionType" className="text-sm font-semibold">
                    نوع سوال *
                  </label>
                  <select
                    id="questionType"
                    name="questionType"
                    required
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
                  >
                    <option value="TALIFI">تالیفی</option>
                    <option value="SARASARI">سراسری</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="categoryChapterId"
                    className="text-sm font-semibold"
                  >
                    دسته‌بندی
                  </label>
                  <select
                    id="categoryChapterId"
                    name="categoryChapterId"
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
                  >
                    <option value="">همه دسته‌بندی‌ها</option>
                    {categoryOptions}
                  </select>
                </div>
              </div>

              {/* Chapter Select */}
              <div className="flex flex-col gap-1">
                <label htmlFor="chapterId" className="text-sm font-semibold">
                  فصل
                </label>
                <select
                  id="chapterId"
                  name="chapterId"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
                >
                  <option value="">بدون سرفصل (عمومی)</option>
                  {chapterOptions}
                </select>
              </div>

              {/* Question Text */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">صورت سوال *</label>
                <input type="hidden" name="questionText" value={questionText} />
                <RichTextEditor value={questionText} onChange={setQuestionText} />
              </div>

              {/* Options */}
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-semibold">
                  گزینه‌ها *{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    (جواب درست را انتخاب کنید)
                  </span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.map((opt, index) => (
                    <OptionEditor
                      key={index}
                      index={index}
                      value={opt}
                      isCorrect={correctAnswer === index}
                      onValueChange={(value) => handleOptionChange(index, value)}
                      onSetCorrect={() => setCorrectAnswer(index)}
                    />
                  ))}
                </div>
              </fieldset>

              {/* Answer Text */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">توضیحات سوال *</label>
                <input type="hidden" name="answerText" value={answerText} />
                <RichTextEditor value={answerText} onChange={setAnswerText} />
              </div>

              {/* Exam Points */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">
                  نکات کنکوری{" "}
                  <span className="text-xs text-gray-500 font-normal">(اختیاری)</span>
                </label>
                <input type="hidden" name="examPoints" value={examPoints} />
                <RichTextEditor value={examPoints} onChange={setExamPoints} />
              </div>

              {/* Message */}
              {state?.message && (
                <div
                  role="alert"
                  className={`p-3 rounded text-sm ${
                    state.success
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {state.message}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer bg-gray-200 rounded hover:bg-gray-300 text-gray-800 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      در حال ثبت...
                    </span>
                  ) : (
                    "ثبت سوال"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}