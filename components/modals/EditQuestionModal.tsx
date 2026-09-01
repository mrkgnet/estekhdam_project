"use client";

import React, { useActionState, useEffect } from "react";
import { X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { editQuestionAction } from "@/actions/admin/questions/gov/edit/Actions";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  chapters: any[];
  categoryChapters: any[];
  question: any;
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
  examPoints,
  setExamPoints,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
}: EditQuestionModalProps) {
  const [state, formAction, isPending] = useActionState(editQuestionAction, null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // بستن مودال در صورت موفقیت‌آمیز بودن عملیات
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  // بستن مودال با دکمه Escape
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

  // جلوگیری از اسکرول صفحه اصلی وقتی مودال باز است
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white p-6 rounded w-full max-w-4xl shadow-xl flex flex-col max-h-[95vh]"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">ویرایش سوال</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="بستن"
            aria-label="بستن"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="id" value={question.id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="questionTypeEdit" className="text-sm font-semibold">
                نوع سوال *
              </label>
              <select
                id="questionTypeEdit"
                name="questionType"
                required
                defaultValue={question.questionType || "TALIFI"}
                className="border p-2 rounded focus:outline-blue-500 bg-white"
              >
                <option value="TALIFI">تالیفی</option>
                <option value="SARASARI">سراسری</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="categoryChapterIdEdit" className="text-sm font-semibold">
                دسته‌بندی 
              </label>
              <select
                id="categoryChapterIdEdit"
                name="categoryChapterId"
                defaultValue={question.categoryChapterId || question.chapter?.categoryChapterId || ""}
                className="border p-2 rounded focus:outline-blue-500 bg-white"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categoryChapters?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="chapterIdEdit" className="text-sm font-semibold">
               فصل
            </label>
            <select
              id="chapterIdEdit"
              name="chapterId"
              defaultValue={question.chapterId || ""}
              className="border p-2 rounded focus:outline-blue-500 bg-white"
            >
              <option value="">بدون سرفصل (عمومی)</option>
              {chapters?.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.categoryChapter?.name && (
                    <span className="text-gray-500 text-xs">
                      [{chapter.categoryChapter.name}]
                    </span>
                  )}{" "}
                  فصل {chapter.order}: {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">صورت سوال *</label>
            <input type="hidden" name="questionText" value={questionText} />
            <RichTextEditor value={questionText} onChange={setQuestionText} />
          </div>

          {/* ================= شروع تغییرات بخش گزینه‌ها ================= */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              گزینه‌ها *{" "}
              <span className="text-xs text-gray-500 font-normal">
                (جواب درست را انتخاب کنید)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt, index) => (
                <div
                  key={index}
                  className={`flex flex-col border rounded p-3 transition-colors ${
                    correctAnswer === index
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
                      onChange={() => setCorrectAnswer(index)}
                      checked={correctAnswer === index}
                      className="w-4 h-4 cursor-pointer accent-green-600"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      گزینه {index + 1}
                    </span>
                  </div>
                  {/* اینپوت مخفی برای ارسال دیتا به اکشن سمت سرور */}
                  <input type="hidden" name={`option_${index}`} value={opt} />
                  
                  {/* استفاده از ادیتور برای هر گزینه */}
                  <div className="flex-grow">
                     <RichTextEditor
                       value={opt}
                       onChange={(value) => handleOptionChange(index, value)}
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* ================= پایان تغییرات بخش گزینه‌ها ================= */}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">توضیحات سوال *</label>
            <input type="hidden" name="answerText" value={answerText} />
            <RichTextEditor value={answerText} onChange={setAnswerText} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">نکات کنکوری (اختیاری)</label>
            <input type="hidden" name="examPoints" value={examPoints} />
            <RichTextEditor value={examPoints} onChange={setExamPoints} />
          </div>

          {state?.message && (
            <div
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
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "در حال ذخیره..." : "ویرایش اطلاعات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}