"use client";
import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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
  BookMarked,
  Library,
  Loader2,
  Filter,
  Star,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DeleteButton from "@/components/ui/DeleteButton";
import deleteQuestionAction from "@/actions/admin/questions/gov/delete/Actions";
import AddQuestionModal from "@/components/modals/AddQuestionModal";
import EditQuestionModal from "@/components/modals/EditQuestionModal";
import ImportQuestionsModal from "@/components/modals/ImportQuestionsModal";
import BatchAddQuestionsModal from "@/components/modals/BatchAddQuestionsModal";
import deleteAllQuestionCourseAction from "@/actions/admin/questions/gov/delete_all_questions/actions";
import Pagination from "@/components/ui/Pagination";
import QuestionReferenceModal from "@/components/modals/QuestionReferenceModal";
import QuestionSpecialToggle from "@/components/admin/questions/QuestionSpecialToggle";
// ============================================
// Types
// ============================================
type QuestionReferenceOption = {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
};
type Question = {
  id: string;
  productId: string;
  isSpecial: boolean;
  referenceId?: string | null;
  reference?: QuestionReferenceOption | null;
  questionCode?: string | null;
  questionText: string;
  questionType: string;
  options: string[];
  correctAnswer: number;
  answerText?: string | null;
  examPoints?: string | null;
  studyGuide?: string | null;
  categoryChapterId?: number | null;
  product?: {
    name: string;
  };
  chapter?: {
    id: string;
    title: string;
    order: number;
  } | null;
  categoryChapter?: {
    id: number;
    name: string;
  } | null;
};
type Chapter = any;
type CategoryChapter = any;
interface QuestionsData {
  questions: Question[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
interface ShowDataProps {
  productId: string;
  questionsData: QuestionsData;
  chapters: Chapter[];
  categoryChapters: CategoryChapter[];
  references: QuestionReferenceOption[];
}
// ============================================
// Main Component
// ============================================
export default function ExamQuestionsPage({
  productId,
  questionsData,
  chapters,
  categoryChapters,
  references,
}: ShowDataProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ==========================================
  // Modal States
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<Question | null>(null);
  const [referenceQuestion, setReferenceQuestion] =
    useState<Question | null>(null);
  const closeReferenceModal = () => {
    setReferenceQuestion(null);
  };
  // ==========================================
  // Questions
  // ==========================================
  const [questions, setQuestions] = useState<Question[]>(
    questionsData.questions
  );
  useEffect(() => {
    setQuestions(questionsData.questions);
  }, [questionsData.questions]);
  // ==========================================
  // Add Form States
  // ==========================================
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] =
    useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [examPoints, setExamPoints] = useState("");
  const [studyGuide, setStudyGuide] = useState("");
  // ==========================================
  // Edit Form States
  // ==========================================
  const [editOptions, setEditOptions] = useState([
    "",
    "",
    "",
    "",
  ]);
  const [editCorrectAnswer, setEditCorrectAnswer] =
    useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editExamPoints, setEditExamPoints] = useState("");
  const [editStudyGuide, setEditStudyGuide] = useState("");
  // ==========================================
  // Search / Filter States
  // ==========================================
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isPendingDeleteAll, startTransitionDeleteAll] =
    useTransition();
  const [isFiltering, startFilterTransition] =
    useTransition();
  const { totalCount, currentPage, totalPages } =
    questionsData;
  // ==========================================
  // Product Name
  // ==========================================
  const productName = useMemo(() => {
    return questions.length > 0
      ? questions[0].product?.name || "نام محصول موجود نیست"
      : "نام محصول موجود نیست";
  }, [questions]);
  // ==========================================
  // Close Add Modal
  // ==========================================
  const closeAddModal = () => {
    setIsModalOpen(false);
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
    setQuestionText("");
    setAnswerText("");
    setExamPoints("");
    setStudyGuide("");
  };
  // ==========================================
  // Close Edit Modal
  // ==========================================
  const closeEditModal = () => {
    setEditingQuestion(null);
    setEditOptions(["", "", "", ""]);
    setEditCorrectAnswer(null);
    setEditQuestionText("");
    setEditAnswerText("");
    setEditExamPoints("");
    setEditStudyGuide("");
  };
  // ==========================================
  // Open Edit Modal
  // ==========================================
  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setEditOptions([
      ...(q.options || ["", "", "", ""]),
    ]);
    setEditCorrectAnswer(
      (q.correctAnswer ?? 1) - 1
    );
    setEditQuestionText(q.questionText || "");
    setEditAnswerText(q.answerText || "");
    setEditExamPoints(q.examPoints || "");
    setEditStudyGuide(q.studyGuide || "");
  };
  // ==========================================
  // Update Reference In Table
  // ==========================================
  const handleReferenceSuccess = (
    questionId: string,
    referenceId: string | null,
    reference: QuestionReferenceOption | null
  ) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === questionId
          ? {
              ...question,
              referenceId,
              reference,
            }
          : question
      )
    );
  };
  // ==========================================
  // Delete All Questions
  // ==========================================
  const handleDeleteAllQuestions = () => {
    if (questions.length === 0) {
      alert("سؤالی برای حذف وجود ندارد.");
      return;
    }
    const confirmed = window.confirm(
      "آیا مطمئن هستید؟ تمام سوالات این درس برای همیشه حذف می‌شوند."
    );
    if (!confirmed) return;
    startTransitionDeleteAll(async () => {
      try {
        const result =
          await deleteAllQuestionCourseAction(productId);
        if (result.success) {
          alert(result.message);
          router.refresh();
        } else {
          alert(result.message || "خطا در حذف سوالات");
        }
      } catch (error) {
        console.error("Delete all questions error:", error);
        alert("خطا در ارتباط با سرور.");
      }
    });
  };
  // ==========================================
  // Body Scroll Lock
  // ==========================================
  useEffect(() => {
    const isOpen =
      isModalOpen ||
      !!editingQuestion ||
      isImportModalOpen ||
      isBatchModalOpen ||
      !!referenceQuestion;
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [
    isModalOpen,
    editingQuestion,
    isImportModalOpen,
    isBatchModalOpen,
    referenceQuestion,
  ]);
  // ==========================================
  // Sync Search With URL
  // ==========================================
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchQuery === currentSearch) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, router]);
  // ==========================================
  // Reference Filter
  // ==========================================
  const selectedReferenceFilter =
    searchParams.get("reference") || "";
  const handleReferenceFilter = (value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    if (value) {
      params.set("reference", value);
    } else {
      params.delete("reference");
    }
    params.set("page", "1");
    startFilterTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };
  // ==========================================
  // Admin Special Questions Filter (server-side)
  // ==========================================
  const selectedSpecialFilter = searchParams.get("special") === "true";

  const handleSpecialFilter = (onlySpecial: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (onlySpecial) {
      params.set("special", "true");
    } else {
      params.delete("special");
    }

    params.set("page", "1");

    startFilterTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const startIndex = (currentPage - 1) * 10;
  // ==========================================
  // Render
  // ==========================================
  return (
    <div
      dir="rtl"
      className="my-4 min-h-screen px-2 sm:px-2 lg:px-2"
    >
      <div className="mx-auto space-y-5">
        {/* ==================================== */}
        {/* Header */}
        {/* ==================================== */}
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-800 sm:text-2xl">
                <HelpCircle className="h-5 w-5 shrink-0 text-blue-600" />
                <span className="truncate">
                  مدیریت سوالات
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-medium text-slate-700">
                  {productName}
                </span>
                <span className="mx-2">•</span>
                <span>{totalCount} سوال</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                افزودن سوال
              </button>
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                افزودن گروهی
              </button>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-amber-600" />
                ایمپورت
              </button>
              <button
                type="button"
                onClick={handleDeleteAllQuestions}
                disabled={isPendingDeleteAll}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                {isPendingDeleteAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isPendingDeleteAll
                  ? "در حال حذف..."
                  : "حذف همه"}
              </button>
            </div>
          </div>
        </header>
        {/* ==================================== */}
        {/* Search / Filters */}
        {/* ==================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="جستجو در متن سوال، فصل، رفرنس و..."
                aria-label="جستجوی سوالات"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="relative w-full md:max-w-xs">
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedReferenceFilter}
                disabled={isFiltering}
                onChange={(event) =>
                  handleReferenceFilter(event.target.value)
                }
                aria-label="فیلتر رفرنس سوالات"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white pr-9 pl-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              >
                <option value="">تمام رفرنس‌ها</option>
                <option value="unassigned">
                  سوالات بدون رفرنس
                </option>
                {references.map((reference) => (
                  <option
                    key={reference.id}
                    value={reference.id}
                  >
                    {reference.title}
                    {!reference.isActive ? " (غیرفعال)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleSpecialFilter(!selectedSpecialFilter)}
              disabled={isFiltering}
              aria-pressed={selectedSpecialFilter}
              className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 text-xs font-medium transition md:w-auto disabled:opacity-60 ${
                selectedSpecialFilter
                  ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Star className={`h-4 w-4 ${selectedSpecialFilter ? "fill-amber-500 text-amber-500" : "text-slate-500"}`} />
              {selectedSpecialFilter ? "نمایش همه سؤالات" : "فقط سؤالات ویژه"}
            </button>
            {isFiltering && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
        </section>
        {/* ==================================== */}
        {/* Questions Table */}
        {/* ==================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1350px] border-collapse text-right">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="w-12 p-3 text-center">
                    ردیف
                  </th>
                  <th className="w-24 p-3 text-center">
                    کد سوال
                  </th>
                  <th className="min-w-[300px] p-3">
                    متن سوال
                  </th>
                  <th className="w-24 p-3">
                    نوع
                  </th>
                  <th className="w-28 p-3">
                    دسته‌بندی
                  </th>
                  <th className="w-32 p-3">
                    فصل
                  </th>
                  <th className="w-36 p-3">
                    رفرنس سوال
                  </th>
                  <th className="w-40 p-3">
                    پاسخ تشریحی
                  </th>
                  <th className="w-24 p-3 text-center">
                    درس‌نامه
                  </th>
                  <th className="w-28 p-3 text-center">
                    سؤال ویژه
                  </th>
                  <th className="w-40 p-3 text-center">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {questions.length > 0 ? (
                  questions.map((q, index) => {
                    const category = categoryChapters?.find(
                      (item) =>
                        item.id === q.categoryChapterId
                    );
                    const categoryName =
                      q.categoryChapter?.name ||
                      category?.title ||
                      category?.name;
                    const actualIndex = startIndex + index + 1;
                    return (
                      <tr
                        key={q.id}
                        className="align-top transition hover:bg-slate-50/70"
                      >
                        {/* Index */}
                        <td className="p-3 text-center font-medium text-slate-500">
                          {actualIndex}
                        </td>
                        {/* Code */}
                        <td className="break-words p-3 text-center font-medium text-slate-500">
                          {q.questionCode || "-"}
                        </td>
                        {/* Question */}
                        <td className="p-3">
                          <div
                            className="line-clamp-3 leading-6 text-slate-800"
                            dangerouslySetInnerHTML={{
                              __html: q.questionText || "",
                            }}
                          />
                          <div className="mt-2 space-y-1.5 text-[11px]">
                            {(q.options || []).map(
                              (option, optionIndex) => {
                                const isCorrect =
                                  optionIndex + 1 ===
                                  q.correctAnswer;
                                return (
                                  <div
                                    key={optionIndex}
                                    className={`flex items-start gap-2 rounded-lg border px-2 py-1.5 ${
                                      isCorrect
                                        ? "border-green-200 bg-green-50 text-green-800"
                                        : "border-slate-200 bg-slate-50 text-slate-700"
                                    }`}
                                  >
                                    {isCorrect && (
                                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    )}
                                    <span className="shrink-0 font-medium">
                                      {optionIndex + 1})
                                    </span>
                                    <div
                                      className="break-words leading-5 [&>p]:m-0"
                                      dangerouslySetInnerHTML={{
                                        __html: option || "",
                                      }}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </td>
                        {/* Type */}
                        <td className="p-3">
                          {q.questionType === "SARASARI" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-700">
                              <GraduationCap className="h-3.5 w-3.5" />
                              سراسری
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700">
                              <Edit className="h-3.5 w-3.5" />
                              تالیفی
                            </span>
                          )}
                        </td>
                        {/* Category */}
                        <td className="p-3">
                          {categoryName ? (
                            <span className="inline-block max-w-full rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-medium text-teal-700">
                              {categoryName}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              ندارد
                            </span>
                          )}
                        </td>
                        {/* Chapter */}
                        <td className="p-3">
                          {q.chapter?.title ? (
                            <span className="inline-block max-w-full rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                              فصل {q.chapter.order}: {q.chapter.title}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              عمومی
                            </span>
                          )}
                        </td>
                        {/* Reference */}
                        <td className="p-3">
                          <div className="flex flex-col items-start gap-2">
                            {q.reference ? (
                              <span className="inline-flex max-w-full break-words rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                                {q.reference.title}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                بدون رفرنس
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setReferenceQuestion(q)
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              <Library className="h-3.5 w-3.5" />
                              {q.reference
                                ? "تغییر رفرنس"
                                : "انتخاب رفرنس"}
                            </button>
                          </div>
                        </td>
                        {/* Answer */}
                        <td className="p-3">
                          <div
                            className="line-clamp-4 text-[11px] leading-5 text-slate-600"
                            dangerouslySetInnerHTML={{
                              __html: q.answerText || "",
                            }}
                          />
                        </td>
                        {/* Study Guide */}
                        <td className="p-3 text-center">
                          {q.studyGuide?.trim() ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                              <BookMarked className="h-3 w-3" />
                              دارد
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              ندارد
                            </span>
                          )}
                        </td>
                        {/* Admin Special Question */}
                        <td className="p-3 text-center">
                          <QuestionSpecialToggle
                            questionId={q.id}
                            productId={productId}
                            isSpecial={q.isSpecial}
                            onSuccess={(value) => {
                                setQuestions((previous) =>
                                  previous.map((item) =>
                                    item.id === q.id
                                      ? { ...item, isSpecial: value }
                                      : item
                                  )
                                );
                                if (selectedSpecialFilter && !value) {
                                  router.refresh();
                                }
                            }}
                          />
                        </td>
                        {/* Actions */}
                        <td className="p-3">
                          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEditModal(q)
                              }
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                            >
                              ویرایش
                            </button>
                            <DeleteButton
                              id={q.id}
                              action={deleteQuestionAction}
                              itemName="این سوال"
                              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
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
                    <td
                      colSpan={11}
                      className="p-14 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <p className="text-sm font-medium text-slate-700">
                          نتیجه‌ای پیدا نشد
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          عبارت جست‌وجو یا فیلتر را تغییر دهید
                          یا سؤال جدید اضافه کنید.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
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
      {/* ====================================== */}
      {/* Add Question Modal */}
      {/* ====================================== */}
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
            studyGuide={studyGuide}
            setStudyGuide={setStudyGuide}
            examPoints={examPoints}
            setExamPoints={setExamPoints}
            options={options}
            setOptions={setOptions}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
          />
        )}
      </AnimatePresence>
      {/* ====================================== */}
      {/* Edit Question Modal */}
      {/* ====================================== */}
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
            studyGuide={editStudyGuide}
            setStudyGuide={setEditStudyGuide}
            examPoints={editExamPoints}
            setExamPoints={setEditExamPoints}
            options={editOptions}
            setOptions={setEditOptions}
            correctAnswer={editCorrectAnswer}
            setCorrectAnswer={setEditCorrectAnswer}
          />
        )}
      </AnimatePresence>
      {/* ====================================== */}
      {/* Import Questions Modal */}
      {/* ====================================== */}
      <AnimatePresence>
        {isImportModalOpen && (
          <ImportQuestionsModal
            isOpen={isImportModalOpen}
            onClose={() =>
              setIsImportModalOpen(false)
            }
            categoryChapters={categoryChapters}
            productId={productId}
          />
        )}
      </AnimatePresence>
      {/* ====================================== */}
      {/* Batch Add Questions Modal */}
      {/* ====================================== */}
      <AnimatePresence>
        {isBatchModalOpen && (
          <BatchAddQuestionsModal
            isOpen={isBatchModalOpen}
            onClose={() =>
              setIsBatchModalOpen(false)
            }
            productId={productId}
            chapters={chapters}
            categoryChapters={categoryChapters}
          />
        )}
      </AnimatePresence>
      {/* ====================================== */}
      {/* Reference Selection Modal */}
      {/* ====================================== */}
      {referenceQuestion && (
        <QuestionReferenceModal
          question={referenceQuestion}
          references={references}
          onClose={closeReferenceModal}
          onSuccess={handleReferenceSuccess}
        />
      )}
    </div>
  );
}
