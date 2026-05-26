"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit, Trash2, HelpCircle, CheckCircle2, GraduationCap, Plus, Download } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DeleteButton from "@/components/ui/DeleteButton";
import deleteQuestionAction from "@/actions/admin/questions/gov/delete/Actions";
import SearchBar from "@/components/ui/SearchBar";
import AddQuestionModal from "@/components/modals/AddQuestionModal";
import EditQuestionModal from "@/components/modals/EditQuestionModal";
import ImportQuestionsModal from "@/components/modals/ImportQuestionsModal";
import deleteAllQuestionCourseAction from "@/actions/admin/questions/gov/delete_all_questions/actions";
import Pagination from "@/components/ui/Pagination";

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
  
  // State های مدال افزودن
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [examPoints, setExamPoints] = useState("");

  // State های مدال ویرایش
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editExamPoints, setEditExamPoints] = useState("");

  // State مدال ایمپورت
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
    if (isModalOpen || editingQuestion || isImportModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, editingQuestion, isImportModalOpen]);

  // 🔍 جستجو با debounce - فقط وقتی searchQuery تغییر کنه
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchQuery === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
        params.set("page", "1"); // ریست به صفحه اول
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
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              مدیریت
              <span className="text-red-400">{productName}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">تعداد کل: {totalCount} سوال</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteAllQuestions}
              disabled={isPendingDeleteAll}
              className="flex cursor-pointer items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isPendingDeleteAll ? "در حال حذف..." : "حذف همه سوالات"}
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded text-sm font-medium transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              ایمپورت از دسته‌بندی
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded text-sm font-medium transition-all shadow-sm shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              افزودن سوال جدید
            </button>
          </div>
        </header>

        <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="جستجو در سوالات، گزینه‌ها و سرفصل‌ها..."
            className="md:w-1/3"
          />
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {/* اضافه شدن کلس table-fixed برای کنترل دقیق اندازه ستون‌ها */}
            <table className="w-full text-right border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm font-medium">
                  <th className="p-4 w-[6%] text-center">ردیف</th>
                  <th className="p-4 w-[10%] text-center">کد سوال</th>
                  <th className="p-4 w-[34%]">متن سوال</th>
                  <th className="p-4 w-[10%]">نوع سوال</th>
                  <th className="p-4 w-[12%]">دسته‌بندی</th>
                  <th className="p-4 w-[12%]">فصل</th>
                  <th className="p-4 w-[16%]">پاسخ تشریحی</th>
                  <th className="p-4 w-[12%] text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {questions && questions.length > 0 ? (
                  questions.map((q, index) => {
                    const category = categoryChapters?.find((c) => c.id === q.categoryChapterId);
                    const categoryName =
                      q.categoryChapter?.name || category?.title || category?.name;
                    const actualIndex = startIndex + index + 1;

                    return (
                      <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                        <td className="p-4 text-center text-gray-500 font-medium">
                          {actualIndex}
                        </td>
                        <td className="p-4 text-center text-gray-500 font-medium break-words">
                          {q.questionCode}
                        </td>
                        <td className="p-4 break-words">
                          <div
                            className="text-gray-800 font-medium line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: q.questionText || "" }}
                          />
                          <div className="flex flex-col gap-1.5 mt-2 text-xs text-gray-500">
                            {q.options.map((opt: string, i: number) => (
                              <div
                                key={i}
                                className={`px-2 py-1 rounded-md flex items-start gap-2 ${
                                  i + 1 === q.correctAnswer
                                    ? "bg-green-50 text-green-700 border border-green-200 font-bold"
                                    : "bg-gray-50"
                                  }`}
                              >
                                {i + 1 === q.correctAnswer && (
                                  <CheckCircle2 className="w-3. h-3.5 mt-0.5 shrink-0" />
                                )}
                                <span className="shrink-0">{i + 1}- </span>
                                <div
                                  className="[&>p]:m-0 break-words"
                                  dangerouslySetInnerHTML={{ __html: opt || "" }}
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 vertical-align-top">
                          {q.questionType === "SARASARI" ? (
                            <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-bold border border-purple-100 flex items-center gap-1 w-max">
                              <GraduationCap className="w-3 h-3" /> سراسری
                            </span>
                          ) : (
                            <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-xs font-bold border border-orange-100 flex items-center gap-1 w-max">
                              <Edit className="w-3 h-3" /> تالیفی
                            </span>
                          )}
                        </td>
                        <td className="p-4 break-words">
                          {categoryName ? (
                            <span className="bg-teal-50 text-teal-600 px-2 py-1 rounded-md text-xs border border-teal-100 inline-block max-w-full truncate">
                              {categoryName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">ندارد</span>
                          )}
                        </td>
                        <td className="p-4 break-words">
                          {q.chapter?.title ? (
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs border border-blue-100 inline-block max-w-full">
                              فصل {q.chapter.order}: {q.chapter.title}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">عمومی</span>
                          )}
                        </td>
                        <td className="p-4 break-words">
                          <div
                            className="text-gray-600 text-xs line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: q.answerText || "" }}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(q)}
                              className="w-full sm:w-auto px-2 py-1 text-xs text-blue-500 border border-blue-300 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-center"
                            >
                              ویرایش
                            </button>
                            <DeleteButton
                              id={q.id}
                              action={deleteQuestionAction}
                              itemName="این سوال"
                              className="w-full sm:w-auto px-2 py-1 text-xs text-red-500 cursor-pointer border border-red-300 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors text-center"
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
                    <td colSpan={8} className="p-12 text-center text-gray-500">
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
    </div>
  );
}