"use client";

import React, { useActionState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { editGovQuestion } from "@/actions/admin/questions/gov/edit/Actions";

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

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  chapters: Chapter[];
  categoryChapters: CategoryChapter[];
  question: any;
  questionText: string;
  setQuestionText: (value: string) => void;
  answerText: string;
  setAnswerText: (value: string) => void;
  studyGuide: string;
  setStudyGuide: (value: string) => void;
  examPoints: string;
  setExamPoints: (value: string) => void;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  correctAnswer: number | null;
  setCorrectAnswer: (index: number | null) => void;
}

export default function EditQuestionModal({
  isOpen,
  onClose,
  productId,
  chapters,
  categoryChapters,
  question,
  questionText,
  setQuestionText,
  answerText,
  setAnswerText,
  studyGuide,
  setStudyGuide,
  examPoints,
  setExamPoints,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
}: EditQuestionModalProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(editGovQuestion, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

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

  const categoryOptions = useMemo(
    () =>
      categoryChapters.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      )),
    [categoryChapters]
  );

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-title"
        className="bg-white p-6 rounded w-full max-w-4xl shadow-xl flex flex-col max-h-[95vh]"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 id="modal-edit-title" className="text-xl font-bold">
            ویرایش سوال
          </h2>
          <button
            onClick={onClose}
            aria-label="بستن مودال"
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          action={formAction}
          className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 flex-1"
        >
          <input type="hidden" name="questionId" value={question.id} />
          <input type="hidden" name="productId" value={productId} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="edit-questionType" className="text-sm font-semibold">
                نوع سوال *
              </label>
              <select
                id="edit-questionType"
                name="questionType"
                defaultValue={question.questionType || "TALIFI"}
                required
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
              >
                <option value="TALIFI">تالیفی</option>
                <option value="SARASARI">سراسری</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="edit-categoryChapterId" className="text-sm font-semibold">
                دسته‌بندی
              </label>
              <select
                id="edit-categoryChapterId"
                name="categoryChapterId"
                defaultValue={question.categoryChapterId ?? ""}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categoryOptions}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="edit-chapterId" className="text-sm font-semibold">
              فصل
            </label>
            <select
              id="edit-chapterId"
              name="chapterId"
              defaultValue={question.chapterId ?? ""}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-shadow"
            >
              <option value="">بدون سرفصل (عمومی)</option>
              {chapterOptions}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">صورت سوال *</label>
            <input type="hidden" name="questionText" value={questionText} />
            <RichTextEditor value={questionText} onChange={setQuestionText} />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold">
              گزینه‌ها * <span className="text-xs text-gray-500 font-normal">(پاسخ درست را انتخاب کنید)</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt, index) => {
                const isCorrect = correctAnswer === index;
                return (
                  <div
                    key={index}
                    className={`flex flex-col border rounded p-3 transition-colors ${
                      isCorrect ? "border-green-500 bg-green-50/30 shadow-sm" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 border-b pb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={index}
                        required
                        onChange={() => setCorrectAnswer(index)}
                        checked={isCorrect}
                        className="w-4 h-4 cursor-pointer accent-green-600"
                      />
                      <span className="text-sm font-bold text-gray-700">گزینه {index + 1}</span>
                    </div>
                    <input type="hidden" name={`option_${index}`} value={opt} />
                    <div className="flex-grow">
                      <RichTextEditor value={opt} onChange={(val) => handleOptionChange(index, val)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">پاسخ تشریحی سوال *</label>
            <input type="hidden" name="answerText" value={answerText} />
            <RichTextEditor value={answerText} onChange={setAnswerText} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              نکات کنکوری <span className="text-xs text-gray-500 font-normal">(اختیاری)</span>
            </label>
            <input type="hidden" name="examPoints" value={examPoints} />
            <RichTextEditor value={examPoints} onChange={setExamPoints} />
          </div>

          {/* فیلد درس‌نامه بعد از نکات کنکوری */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-800">
              درس‌نامه <span className="text-xs text-gray-500 font-normal">(اختیاری)</span>
            </label>
            <input type="hidden" name="studyGuide" value={studyGuide} />
            <RichTextEditor value={studyGuide} onChange={setStudyGuide} />
          </div>

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
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "در حال ذخیره..." : "بروزرسانی سوال"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}