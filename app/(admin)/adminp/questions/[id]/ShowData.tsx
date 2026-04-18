"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Plus, Edit, Trash2, HelpCircle, CheckCircle2, Search, X, Save, GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import addGovQuestion from "@/actions/admin/questions/gov/add/Actions";
import DeleteButton from "@/components/ui/DeleteButton";
import deleteQuestionAction from "@/actions/admin/questions/gov/delete/Actions";
import { editQuestionAction } from "@/actions/admin/questions/gov/edit/Actions";
import SearchBar from "@/components/ui/SearchBar";

export default function ExamQuestionsPage({ productId, initialQuestions, chapters }: { productId: string, initialQuestions: any[], chapters: any[] }) {

    const [state, formActionQuestion, isPending] = useActionState(addGovQuestion, null)
    const [editState, formEditActionQuestion, isEditPending] = useActionState(editQuestionAction, null)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

    const productName = initialQuestions && initialQuestions.length > 0
        ? initialQuestions[0].product?.name
        : "هیچی !! چیزی پیدا نکردم";

    const [editingQuestion, setEditingQuestion] = useState<any | null>(null)

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOptions(["", "", "", ""]);
        setCorrectAnswer(null);
    };

    useEffect(() => {
        if (state?.success) {
            closeModal();
        }
    }, [state])

    useEffect(() => {
        if (editState?.success) {
            setOptions(["", "", "", ""]);
            setEditingQuestion(null);
        }
    }, [editState])

    const handleOpenEditModal = (q: any) => {
        setEditingQuestion(q)
        setOptions(q.options)
        setCorrectAnswer(q.correctAnswer - 1)
    }

    const [searchQuery, setSearchQuery] = useState('')

    const filteredQuestions = initialQuestions.filter((q) => {
        const query = searchQuery.toLowerCase();

        const matchQuestion = q.questionText?.toLowerCase().includes(query) ?? false;
        const matchAnswer = q.answerText?.toLowerCase().includes(query) ?? false;
        const matchOptions = q.options?.some((opt: string) =>
            opt.toLowerCase().includes(query)
        ) ?? false;
        const matchChapter = q.chapter?.title?.toLowerCase().includes(query) ?? false;

        return matchQuestion || matchAnswer || matchOptions || matchChapter;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8" dir="rtl">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* هدر صفحه */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-blue-600" />
                            مدیریت
                            <span className="text-red-400">
                                {productName}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            در این بخش می‌توانید سوالات مربوط به آزمون را مدیریت کنید.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded text-sm font-medium transition-all shadow-sm shadow-blue-200"
                    >
                        <Plus className="w-4 h-4" />
                        افزودن سوال جدید
                    </button>
                </header>

                {/* نوار جستجو */}
                <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="جستجو در سوالات، گزینه‌ها و سرفصل‌ها..."
                        className="md:w-1/3"
                    />
                </div>

                {/* جدول سوالات */}
                <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm font-medium">
                                    <th className="p-4 w-16 text-center">ردیف</th>
                                    <th className="p-4 w-1/4">متن سوال</th>
                                    <th className="p-4 w-1/6">نوع سوال</th>
                                    <th className="p-4 w-1/6">سرفصل</th>
                                    <th className="p-4 w-1/4">پاسخ سوال</th>
                                    <th className="p-4 text-center">عملیات</th>
                                </tr>

                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredQuestions && filteredQuestions.length > 0 ? (
                                    filteredQuestions.map((q, index) => (
                                        <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4 text-center text-gray-500 font-medium">{index + 1}</td>

                                            <td className="p-4">
                                                <p className="text-gray-800 font-medium text-sm line-clamp-2">
                                                    {q.questionText}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                                    {q.options.map((opt: string, i: number) => (
                                                        <span key={i} className={`px-2 py-1 rounded-md ${i + 1 === q.correctAnswer ? 'bg-green-50 text-green-700 border border-green-200 font-bold flex items-center gap-1' : 'bg-gray-100'}`}>
                                                            {i + 1 === q.correctAnswer && <CheckCircle2 className="w-3 h-3" />}
                                                            {i + 1}- {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* 🟢 نمایش نوع سوال */}
                                            <td className="p-4">
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

                                            <td className="p-4">
                                                <p className="text-gray-600 font-medium text-sm">
                                                    {q.chapter?.title ? (
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs border border-blue-100">
                                                            فصل {q.chapter.order}: {q.chapter.title}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">عمومی</span>
                                                    )}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <p className="text-gray-800 font-medium text-sm line-clamp-2">
                                                    {q.answerText}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenEditModal(q)}
                                                        className="p-2 text-blue-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="ویرایش سوال"
                                                    >
                                                        ویرایش
                                                    </button>
                                                    <DeleteButton
                                                        id={q.id}
                                                        action={deleteQuestionAction}
                                                        itemName="این سوال"
                                                        className="p-1.5 text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                    >
                                                        حذف
                                                    </DeleteButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <HelpCircle className="w-12 h-12 mb-3 text-gray-300" />
                                                <p className="text-lg font-medium text-gray-600">هنوز هیچ سوالی ثبت/یافت نشده است!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* مدال افزودن سوال جدید */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                            className="bg-white p-6 rounded w-full max-w-2xl shadow-xl flex flex-col max-h-[95vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">ثبت سوال جدید</h2>

                            <form action={formActionQuestion} className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                                <input type="hidden" name="productId" value={productId} />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 🟢 اضافه شدن فیلد نوع سوال */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="questionType" className="text-sm font-semibold">نوع سوال *</label>
                                        <select
                                            id="questionType"
                                            name="questionType"
                                            required
                                            className="border p-2 rounded focus:outline-blue-500 bg-white"
                                        >
                                            <option value="TALIFI">تالیفی</option>
                                            <option value="SARASARI">سراسری</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="chapterId" className="text-sm font-semibold">انتخاب سرفصل</label>
                                        <select
                                            id="chapterId"
                                            name="chapterId"
                                            className="border p-2 rounded focus:outline-blue-500 bg-white"
                                        >
                                            <option value="">بدون سرفصل (عمومی)</option>
                                            {chapters && chapters.map(chapter => (
                                                <option key={chapter.id} value={chapter.id}>
                                                    فصل {chapter.order}: {chapter.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">متن سوال *</label>
                                    <textarea
                                        rows={3}
                                        name="questionText"
                                        required
                                        placeholder="سوال خود را اینجا بنویسید..."
                                        className="border p-2 rounded focus:outline-blue-500 resize-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold">
                                        گزینه‌ها * <span className="text-xs text-gray-500 font-normal">(جواب درست را انتخاب کنید)</span>
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {options.map((opt, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center border p-2 rounded focus-within:outline focus-within:outline-blue-500 transition-colors ${correctAnswer === index ? "border-green-500 bg-green-50/50" : "border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    value={index}
                                                    required
                                                    onChange={() => setCorrectAnswer(index)}
                                                    checked={correctAnswer === index}
                                                    className="ml-2 w-4 h-4 cursor-pointer accent-green-600"
                                                />
                                                <span className="text-xs text-gray-400 font-bold ml-2 w-4 text-center">{index + 1}</span>
                                                <input
                                                    type="text"
                                                    name={`option_${index}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    required
                                                    placeholder={`متن گزینه ${index + 1}`}
                                                    className="w-full bg-transparent outline-none text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">توضیحات سوال *</label>
                                    <textarea
                                        rows={3}
                                        name="answerText"
                                        required
                                        placeholder="توضیحات پاسخ را اینجا بنویسید..."
                                        className="border p-2 rounded focus:outline-blue-500 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 cursor-pointer bg-gray-200 rounded hover:bg-gray-300 text-gray-800 transition-colors"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isPending ? "در حال ثبت..." : "ثبت سوال"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* مدال ویرایش سوال */}
            <AnimatePresence>
                {editingQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
                        onClick={() => setEditingQuestion(null)}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                            className="bg-white p-6 rounded w-full max-w-2xl shadow-xl flex flex-col max-h-[95vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">ویرایش سوال</h2>

                            <form action={formEditActionQuestion} className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                                <input type="hidden" name="productId" value={productId} />
                                <input type="hidden" name="id" value={editingQuestion.id} />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 🟢 اضافه شدن فیلد نوع سوال در مودال ویرایش */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="questionTypeEdit" className="text-sm font-semibold">نوع سوال *</label>
                                        <select
                                            id="questionTypeEdit"
                                            name="questionTypeEdit"
                                            required
                                            defaultValue={editingQuestion.questionType || "TALIFI"}
                                            className="border p-2 rounded focus:outline-blue-500 bg-white"
                                        >
                                            <option value="TALIFI">تالیفی</option>
                                            <option value="SARASARI">سراسری</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="chapterIdEdit" className="text-sm font-semibold">انتخاب سرفصل</label>
                                        <select
                                            id="chapterIdEdit"
                                            name="chapterIdEdit"
                                            defaultValue={editingQuestion.chapterId || ""}
                                            className="border p-2 rounded focus:outline-blue-500 bg-white"
                                        >
                                            <option value="">بدون سرفصل (عمومی)</option>
                                            {chapters && chapters.map(chapter => (
                                                <option key={chapter.id} value={chapter.id}>
                                                    فصل {chapter.order}: {chapter.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">متن سوال *</label>
                                    <textarea
                                        rows={3}
                                        name="questionTextEdit"
                                        defaultValue={editingQuestion.questionText}
                                        required
                                        placeholder="سوال خود را اینجا بنویسید..."
                                        className="border p-2 rounded focus:outline-blue-500 resize-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold">
                                        گزینه‌ها * <span className="text-xs text-gray-500 font-normal">(جواب درست را انتخاب کنید)</span>
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {options.map((opt, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center border p-2 rounded focus-within:outline focus-within:outline-blue-500 transition-colors ${correctAnswer === index ? "border-green-500 bg-green-50/50" : "border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="correctAnswerEdit"
                                                    value={index}
                                                    required
                                                    onChange={() => setCorrectAnswer(index)}
                                                    checked={correctAnswer === index}
                                                    className="ml-2 w-4 h-4 cursor-pointer accent-green-600"
                                                />
                                                <span className="text-xs text-gray-400 font-bold ml-2 w-4 text-center">{index + 1}</span>
                                                <input
                                                    type="text"
                                                    name={`optionEdit_${index}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    required
                                                    placeholder={`متن گزینه ${index + 1}`}
                                                    className="w-full bg-transparent outline-none text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">توضیحات سوال *</label>
                                    <textarea
                                        rows={3}
                                        name="answerTextEdit"
                                        defaultValue={editingQuestion.answerText}
                                        required
                                        placeholder="توضیحات پاسخ را اینجا بنویسید..."
                                        className="border p-2 rounded focus:outline-blue-500 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingQuestion(null)}
                                        className="px-4 py-2 cursor-pointer bg-gray-200 rounded hover:bg-gray-300 text-gray-800 transition-colors"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditPending}
                                        className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isEditPending ? "در حال ذخیره..." : "ویرایش اطلاعات"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
