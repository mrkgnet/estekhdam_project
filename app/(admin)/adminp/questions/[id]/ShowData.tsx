"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit, Trash2, HelpCircle, CheckCircle2, GraduationCap, Plus, Download, FileSpreadsheet } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DeleteButton from "@/components/ui/DeleteButton";
import deleteQuestionAction from "@/actions/admin/questions/gov/delete/Actions";
import SearchBar from "@/components/ui/SearchBar";
import AddQuestionModal from "@/components/modals/AddQuestionModal";
import EditQuestionModal from "@/components/modals/EditQuestionModal";
import ImportQuestionsModal from "@/components/modals/ImportQuestionsModal";
import deleteAllQuestionCourseAction from "@/actions/admin/questions/gov/delete_all_questions/actions";
import Pagination from "@/components/ui/Pagination";
import BatchAddQuestionsModal from "@/components/modals/BatchAddQuestionsModal";

export default function ExamQuestionsPage({
  productId,
  questionsData,
  chapters,
  categoryChapters,
}: {
  productId: string;
  questionsData: {
    questions: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  chapters: any[];
  categoryChapters: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [examPoints, setExamPoints] = useState("");

  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editExamPoints, setEditExamPoints] = useState("");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isPendingDeleteAll, startTransitionDeleteAll] = useTransition();

  const { questions, totalCount, currentPage, totalPages } = questionsData;

  const productName =
    questions && questions.length > 0
      ? questions[0].product?.name
      : "هیچی !! چیزی پیدا نکردم";

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

  const handleOpenEditModal = (q: any) => {
    setEditingQuestion(q);
    setEditOptions([...q.options]);
    setEditCorrectAnswer(q.correctAnswer - 1);
    setEditQuestionText(q.questionText || "");
    setEditAnswerText(q.answerText || "");
    setEditExamPoints(q.examPoints || "");
  };

  const handleDeleteAllQuestions = () => {
    if (!questions || questions.length === 0) {
      alert("سوالی برای حذف وجود ندارد!");
      return;
    }

    const confirmed = window.confirm(
      "آیا کاملا مطمئن هستید؟ تمام سوالات این درس برای همیشه حذف خواهند شد!"
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
      if (searchQuery) {
        params.set("search", searchQuery);
        params.set("page", "1");
      } else {
        params.delete("search");
        if (currentPage !== 1) {
          params.set("page", "1");
        }
      }
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const startIndex = (currentPage - 1) * 10;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <span>مدیریت</span>
              <span className="text-rose-500 font-semibold">{productName}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">تعداد کل: {totalCount} سوال</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleDeleteAllQuestions}
              disabled={isPendingDeleteAll}
              className="flex cursor-pointer items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isPendingDeleteAll ? "در حال حذف..." : "حذف همه سوالات"}
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              ایمپورت از دسته‌بندی
            </button>
            
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-all shadow-sm shadow-emerald-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              افزودن گروهی (اکسل)
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-all shadow-sm shadow-blue-200"
            >
              <Plus className="w-3.5 h-3.5" />
              افزودن سوال جدید
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="جستجو در سوالات، گزینه‌ها و سرفصل‌ها..."
            className="md:w-1/3 text-xs"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold">
                  <th className="p-3 w-[6%] text-center">ردیف</th>
                  <th className="p-3 w-[10%] text-center">کد سوال</th>
                  <th className="p-3 w-[34%]">متن سوال</th>
                  <th className="p-3 w-[10%]">نوع سوال</th>
                  <th className="p-3 w-[12%]">دسته‌بندی</th>
                  <th className="p-3 w-[12%]">فصل</th>
                  <th className="p-3 w-[16%]">پاسخ تشریحی</th>
                  <th className="p-3 w-[12%] text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {questions && questions.length > 0 ? (
                  questions.map((q, index) => {
                    const category = categoryChapters?.find((c) => c.id === q.categoryChapterId);
                    const categoryName =
                      q.categoryChapter?.name || category?.title || category?.name;
                    const actualIndex = startIndex + index + 1;

                    return (
                      <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-3 text-center text-gray-500 font-medium">
                          {actualIndex}
                        </td>
                        <td className="p-3 text-center text-gray-500 font-medium break-words">
                          {q.questionCode}
                        </td>
                        <td className="p-3 break-words">
                          <div
                            className="text-gray-800 font-medium text-xs leading-relaxed line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: q.questionText || "" }}
                          />
                          <div className="flex flex-col gap-1 mt-2 text-[11px] text-gray-500">
                            {q.options.map((opt: string, i: number) => (
                              <div
                                key={i}
                                className={`px-2 py-1 rounded flex items-start gap-1.5 ${
                                  i + 1 === q.correctAnswer
                                    ? "bg-green-50 text-green-700 border border-green-200 font-semibold"
                                    : "bg-gray-50"
                                }`}
                              >
                                {i + 1 === q.correctAnswer && (
                                  <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                                )}
                                <span className="shrink-0">{i + 1}- </span>
                                <div
                                  className="[&>p]:m-0 break-words leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: opt || "" }}
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          {q.questionType === "SARASARI" ? (
                            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[11px] font-semibold border border-purple-100 inline-flex items-center gap-1 w-max">
                              <GraduationCap className="w-3 h-3" /> سراسری
                            </span>
                          ) : (
                            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[11px] font-semibold border border-orange-100 inline-flex items-center gap-1 w-max">
                              <Edit className="w-3 h-3" /> تالیفی
                            </span>
                          )}
                        </td>
                        <td className="p-3 break-words align-top">
                          {categoryName ? (
                            <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-[11px] border border-teal-100 inline-block max-w-full truncate">
                              {categoryName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">ندارد</span>
                          )}
                        </td>
                        <td className="p-3 break-words align-top">
                          {q.chapter?.title ? (
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] border border-blue-100 inline-block max-w-full">
                              فصل {q.chapter.order}: {q.chapter.title}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">عمومی</span>
                          )}
                        </td>
                        <td className="p-3 break-words align-top">
                          <div
                            className="text-gray-600 text-[11px] leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: q.answerText || "" }}
                          />
                        </td>
                        <td className="p-3 align-top">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(q)}
                              className="w-full sm:w-auto px-2 py-1 text-[11px] text-blue-600 border border-blue-200 hover:border-blue-400 cursor-pointer hover:bg-blue-50 rounded transition-colors text-center font-medium"
                            >
                              ویرایش
                            </button>
                            <DeleteButton
                              id={q.id}
                              action={deleteQuestionAction}
                              itemName="این سوال"
                              className="w-full sm:w-auto px-2 py-1 text-[11px] text-rose-600 cursor-pointer border border-rose-200 hover:border-rose-400 hover:bg-rose-50 rounded transition-colors text-center font-medium"
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
                    <td colSpan={8} className="p-10 text-center text-gray-500 text-xs">
                      هیچ سوالی یافت نشد!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            itemName="سوال"
          />
        </div>
      </div>

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