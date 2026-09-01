"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Edit,
  Trash2,
  HelpCircle,
  CheckCircle2,
  GraduationCap,
  Plus,
  Download,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DeleteButton from "@/components/ui/DeleteButton";
import deleteQuestionAction from "@/actions/admin/questions/gov/delete/Actions";
import AddQuestionModal from "@/components/modals/AddQuestionModal";
import EditQuestionModal from "@/components/modals/EditQuestionModal";
import ImportQuestionsModal from "@/components/modals/ImportQuestionsModal";
import deleteAllQuestionCourseAction from "@/actions/admin/questions/gov/delete_all_questions/actions";
import Pagination from "@/components/ui/Pagination";
import BatchAddQuestionsModal from "@/components/modals/BatchAddQuestionsModal";

type Question = any;
type Chapter = any;
type CategoryChapter = any;

export default function ExamQuestionsPage({
  productId,
  questionsData,
  chapters,
  categoryChapters,
}: {
  productId: string;
  questionsData: {
    questions: Question[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  chapters: Chapter[];
  categoryChapters: CategoryChapter[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [examPoints, setExamPoints] = useState("");

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editExamPoints, setEditExamPoints] = useState("");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isPendingDeleteAll, startTransitionDeleteAll] = useTransition();

  const { questions, totalCount, currentPage, totalPages } = questionsData;

  const productName = useMemo(
    () =>
      questions && questions.length > 0
        ? questions[0].product?.name
        : "نام محصول موجود نیست",
    [questions]
  );

  const closeAddModal = () => {
    setIsModalOpen(false);
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
    setQuestionText("");
    setAnswerText("");
    setExamPoints("");
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
    setEditOptions(["", "", "", ""]);
    setEditCorrectAnswer(null);
    setEditQuestionText("");
    setEditAnswerText("");
    setEditExamPoints("");
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setEditOptions([...(q.options || ["", "", "", ""])]);
    setEditCorrectAnswer((q.correctAnswer ?? 1) - 1);
    setEditQuestionText(q.questionText || "");
    setEditAnswerText(q.answerText || "");
    setEditExamPoints(q.examPoints || "");
  };

  const handleDeleteAllQuestions = () => {
    if (!questions || questions.length === 0) {
      alert("سوالی برای حذف وجود ندارد.");
      return;
    }

    const confirmed = window.confirm(
      "آیا مطمئن هستید؟ تمام سوالات این درس برای همیشه حذف می‌شوند."
    );
    if (!confirmed) return;

    startTransitionDeleteAll(async () => {
      const result = await deleteAllQuestionCourseAction(productId);
      if (result.success) {
        alert(result.message);
        router.refresh();
      } else {
        alert(result.message || "خطا در حذف سوالات");
      }
    });
  };

  useEffect(() => {
    if (isModalOpen || editingQuestion || isImportModalOpen || isBatchModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, editingQuestion, isImportModalOpen, isBatchModalOpen]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchQuery === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, router]);

  const startIndex = (currentPage - 1) * 10;

  return (
    <div className="min-h-screen  px-2 sm:px-2 lg:px-4  my-4" dir="rtl">
      <div className="mx-auto  space-y-5">
        {/* Top Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-800 sm:text-2xl">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="truncate">مدیریت سوالات</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-medium text-slate-700">{productName}</span>
                <span className="mx-2">•</span>
                <span>{totalCount} سوال</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <Plus className="h-4 w-4" />
                افزودن سوال
              </button>

              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                افزودن گروهی
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30"
              >
                <Download className="h-4 w-4 text-amber-600" />
                ایمپورت
              </button>

              <button
                onClick={handleDeleteAllQuestions}
                disabled={isPendingDeleteAll}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
              >
                <Trash2 className="h-4 w-4" />
                {isPendingDeleteAll ? "در حال حذف..." : "حذف همه"}
              </button>
            </div>
          </div>
        </header>

        {/* Search Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در متن سوال، گزینه‌ها، فصل و دسته‌بندی..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* Table Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] table-fixed border-collapse text-right">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                  <th className="w-[6%] p-4 text-center">ردیف</th>
                  <th className="w-[10%] p-4 text-center">کد سوال</th>
                  <th className="w-[34%] p-4">متن سوال</th>
                  <th className="w-[10%] p-4">نوع</th>
                  <th className="w-[12%] p-4">دسته‌بندی</th>
                  <th className="w-[12%] p-4">فصل</th>
                  <th className="w-[16%] p-4">پاسخ تشریحی</th>
                  <th className="w-[12%] p-4 text-center">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {questions && questions.length > 0 ? (
                  questions.map((q, index) => {
                    const category = categoryChapters?.find((c) => c.id === q.categoryChapterId);
                    const categoryName =
                      q.categoryChapter?.name || category?.title || category?.name;
                    const actualIndex = startIndex + index + 1;

                    return (
                      <tr key={q.id} className="align-top transition hover:bg-slate-50/70">
                        <td className="p-4 text-center font-medium text-slate-500">{actualIndex}</td>

                        <td className="p-4 text-center font-medium text-slate-500 break-words">
                          {q.questionCode || "-"}
                        </td>

                        <td className="p-4">
                          <div
                            className="line-clamp-3 leading-7 text-slate-800"
                            dangerouslySetInnerHTML={{ __html: q.questionText || "" }}
                          />
                          <div className="mt-3 space-y-1.5 text-xs">
                            {(q.options || []).map((opt: string, i: number) => {
                              const isCorrect = i + 1 === q.correctAnswer;
                              return (
                                <div
                                  key={i}
                                  className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 ${
                                    isCorrect
                                      ? "border-green-200 bg-green-50 text-green-800"
                                      : "border-slate-200 bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  {isCorrect && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                                  <span className="shrink-0 font-medium">{i + 1})</span>
                                  <div
                                    className="[&>p]:m-0 break-words leading-6"
                                    dangerouslySetInnerHTML={{ __html: opt || "" }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        <td className="p-4">
                          {q.questionType === "SARASARI" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                              <GraduationCap className="h-3.5 w-3.5" />
                              سراسری
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                              <Edit className="h-3.5 w-3.5" />
                              تالیفی
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {categoryName ? (
                            <span className="inline-block max-w-full truncate rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                              {categoryName}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">ندارد</span>
                          )}
                        </td>

                        <td className="p-4">
                          {q.chapter?.title ? (
                            <span className="inline-block max-w-full rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              فصل {q.chapter.order}: {q.chapter.title}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">عمومی</span>
                          )}
                        </td>

                        <td className="p-4">
                          <div
                            className="line-clamp-4 text-xs leading-6 text-slate-600"
                            dangerouslySetInnerHTML={{ __html: q.answerText || "" }}
                          />
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                            <button
                              onClick={() => handleOpenEditModal(q)}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                            >
                              ویرایش
                            </button>

                            <DeleteButton
                              id={q.id}
                              action={deleteQuestionAction}
                              itemName="این سوال"
                              className="w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 sm:w-auto"
                            >
                              حذف
                            </DeleteButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-14 text-center">
                      <div className="mx-auto max-w-sm">
                        <p className="text-base font-medium text-slate-700">نتیجه‌ای پیدا نشد</p>
                        <p className="mt-1 text-sm text-slate-500">
                          عبارت جستجو را تغییر دهید یا سوال جدید اضافه کنید.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 bg-white p-2 sm:p-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              itemName="سوال"
            />
          </div>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <AddQuestionModal
            isOpen={isModalOpen}
            onClose={closeAddModal}
            productId={productId}
            chapters={chapters}
            categoryChapters={categoryChapters}
            questionText={questionText}
            setQuestionText={setQuestionText}
            answerText={answerText}
            setAnswerText={setAnswerText}
            examPoints={examPoints}
            setExamPoints={setExamPoints}
            options={options}
            setOptions={setOptions}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingQuestion && (
          <EditQuestionModal
            isOpen={!!editingQuestion}
            onClose={closeEditModal}
            productId={productId}
            chapters={chapters}
            categoryChapters={categoryChapters}
            question={editingQuestion}
            questionText={editQuestionText}
            setQuestionText={setEditQuestionText}
            answerText={editAnswerText}
            setAnswerText={setEditAnswerText}
            examPoints={editExamPoints}
            setExamPoints={setEditExamPoints}
            options={editOptions}
            setOptions={setEditOptions}
            correctAnswer={editCorrectAnswer}
            setCorrectAnswer={setEditCorrectAnswer}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImportModalOpen && (
          <ImportQuestionsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            categoryChapters={categoryChapters}
            productId={productId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBatchModalOpen && (
          <BatchAddQuestionsModal
            isOpen={isBatchModalOpen}
            onClose={() => setIsBatchModalOpen(false)}
            productId={productId}
            chapters={chapters}
            categoryChapters={categoryChapters}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
