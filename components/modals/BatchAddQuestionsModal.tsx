"use client";

import React, { useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import batchAddQuestionsAction from "@/actions/admin/questions/Actions";

// ==================== Types & Constants ====================
interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  chapters: any[];
  categoryChapters: any[];
}

type ExcelRow = (string | number | boolean | undefined)[];

// تطابق دقیق با ایندکس‌های کد قبلی شما + اضافه شدن نوع سوال
const EXCEL_COLUMNS = {
  QUESTION_TEXT: 0,
  OPTION_1: 1,
  OPTION_2: 2,
  OPTION_3: 3,
  OPTION_4: 4,
  ANSWER_TEXT: 5,
  EXAM_POINTS: 6,
  CORRECT_ANSWER: 7,
  QUESTION_TYPE: 8, // ستون جدید
} as const;

export default function BatchAddQuestionsModal({
  isOpen,
  onClose,
  productId,
  chapters,
  categoryChapters,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [defaultQuestionType, setDefaultQuestionType] = useState("TALIFI");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================== Handlers ====================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValidFile =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      fileName.endsWith(".csv");

    if (isValidFile) {
      setSelectedFile(file);
      setFileError("");
    } else {
      setFileError(
        "لطفاً فقط فایل‌های اکسل با فرمت XLSX، XLS یا CSV انتخاب کنید."
      );
      setSelectedFile(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // تابع پارس کردن هر ردیف بر اساس ایندکس (مشابه سیستم سینگل)
  const parseExcelRow = (row: ExcelRow) => {
    const getString = (index: number): string => {
      const value = row[index];
      return value !== undefined && value !== null ? String(value).trim() : "";
    };

    const getCorrectAnswerIndex = (index: number): number => {
      const value = row[index];
      if (value === undefined || value === null) return 1;

      const parsed = parseInt(String(value), 10);
      return parsed >= 1 && parsed <= 4 ? parsed : 1; // اگر نامعتبر بود ۱ در نظر میگیرد
    };

    const getQuestionType = (index: number): string => {
      const val = getString(index).toUpperCase();
      if (val.includes("سراسری") || val === "SARASARI") return "SARASARI";
      if (val.includes("تالیفی") || val === "TALIFI") return "TALIFI";
      return defaultQuestionType; // اگر خالی بود یا نامعتبر، مقدار پیش‌فرض را می‌گیرد
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
      questionType: getQuestionType(EXCEL_COLUMNS.QUESTION_TYPE),
    };
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) {
      setFileError("لطفاً ابتدا یک فایل انتخاب کنید.");
      return;
    }

    setFileError("");

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const binaryString = evt.target?.result;

        if (!binaryString) {
          setFileError("امکان خواندن فایل وجود ندارد.");
          return;
        }

        const workbook = XLSX.read(binaryString, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // استفاده از header: 1 برای خواندن خروجی آرایه‌ای بر اساس ایندکس ستون‌ها
        const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { header: 1 });

        if (data.length < 2) {
          setFileError("فایل اکسل شما خالی است یا فاقد دیتای سوالات می‌باشد.");
          return;
        }

        // نادیده گرفتن ردیف اول (هدر) و پارس کردن ردیف‌های بعدی
        const rows = data.slice(1);
        const formattedQuestions = rows.map((row) => parseExcelRow(row));

        // فیلتر کردن ردیف‌های خالی
        const validQuestions = formattedQuestions.filter(
          (question) => question.questionText !== ""
        );

        if (validQuestions.length === 0) {
          setFileError(
            "هیچ سوال معتبری در فایل یافت نشد. لطفاً ساختار اکسل را بررسی کنید."
          );
          return;
        }

        startTransition(async () => {
          const response = await batchAddQuestionsAction(
            productId,
            selectedChapterId || null,
            selectedCategoryId ? Number(selectedCategoryId) : null,
            validQuestions as any
          );

          if (response.success) {
            alert(response.message);
            onClose();
          } else {
            setFileError(response.message || "خطا در ثبت اطلاعات");
          }
        });
      } catch (error) {
        console.error("Excel Parsing Error:", error);
        setFileError("فرمت فایل نامعتبر است. ساختار اکسل را بررسی کنید.");
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/60 p-3 backdrop-blur-sm sm:p-4 md:p-6">
      <div
        dir="rtl"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="flex items-center gap-2.5 text-xs font-bold text-slate-800 sm:text-sm">
            <span className="rounded-lg bg-emerald-50 p-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </span>
            افزودن گروهی سوالات (اکسل)
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="بستن"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 custom-scrollbar">

          {/* راهنما */}
          <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-[10px] leading-relaxed text-blue-800 sm:text-xs">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

            <div>
              <p className="mb-1.5 font-semibold text-blue-900">
                ترتیب اجباری ستون‌های اکسل:
              </p>
              <p className="text-blue-800/90 leading-relaxed font-medium">
                1. صورت سوال | 2. گزینه اول | 3. گزینه دوم | 4. گزینه سوم | 5. گزینه چهارم <br />
                6. پاسخ تشریحی | 7. نکات کنکوری | 8. شماره گزینه صحیح (1 تا 4) | 9. نوع سوال
              </p>
              <p className="mt-2 text-[10px] opacity-75">
                * نام هدر مهم نیست، فقط <span className="font-bold">ترتیب ستون‌ها</span> دقیقاً رعایت شود. <br/>
                * ستون نوع سوال اگر خالی باشد، مقدار پیش‌فرض انتخاب شده اعمال می‌شود.
              </p>
            </div>
          </div>

          {/* تنظیمات پیش‌فرض */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700">
                فصل (اختیاری)
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              >
                <option value="">بدون فصل (عمومی)</option>
                {chapters?.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700">
                دسته‌بندی (اختیاری)
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              >
                <option value="">بدون دسته‌بندی</option>
                {categoryChapters?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700">
                نوع سوال پیش‌فرض
              </label>
              <select
                value={defaultQuestionType}
                onChange={(e) => setDefaultQuestionType(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              >
                <option value="TALIFI">تالیفی</option>
                <option value="SARASARI">سراسری</option>
              </select>
            </div>
          </div>

          {/* ناحیه آپلود فایل */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold text-slate-700">
              فایل سوالات
            </label>

            {!selectedFile ? (
              <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-colors hover:border-emerald-300 hover:bg-slate-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-white p-3 text-slate-500 shadow-sm ring-1 ring-slate-100 transition-colors group-hover:text-emerald-600">
                    <Upload className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      برای انتخاب فایل کلیک کنید یا فایل را بکشید
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      فایل‌های XLSX و CSV پشتیبانی می‌شوند
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>

                  <div className="min-w-0 truncate">
                    <p
                      dir="ltr"
                      className="truncate text-xs font-semibold text-slate-800"
                    >
                      {selectedFile.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      فایل آماده آپلود
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isPending}
                  title="حذف فایل"
                  className="ml-1 shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-500">
                <span className="block h-1 w-1 rounded-full bg-rose-500" />
                {fileError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse items-center justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 sm:w-auto"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleConfirmUpload}
            disabled={!selectedFile || isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-medium text-white shadow-sm shadow-emerald-200 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                در حال ثبت اطلاعات...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                تایید و آپلود فایل
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
