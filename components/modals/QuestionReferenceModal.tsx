
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Library,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { updateQuestionReferenceIdAction } from "@/actions/admin/questions/Actions";

export interface QuestionReferenceOption {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
}

export interface ReferenceQuestion {
  id: string;
  referenceId?: string | null;
  questionCode?: string | null;
}

interface ReferenceModalProps {
  question: ReferenceQuestion;
  references: QuestionReferenceOption[];
  onClose: () => void;
  onSuccess: (
    questionId: string,
    referenceId: string | null,
    reference: QuestionReferenceOption | null
  ) => void;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFC")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F]/g, "")
    .trim()
    .toLocaleLowerCase("fa-IR");
}

export default function QuestionReferenceModal({
  question,
  references,
  onClose,
  onSuccess,
}: ReferenceModalProps) {
  const router = useRouter();

  const [selectedReference, setSelectedReference] = useState(
    question.referenceId || ""
  );
  const [referenceSearch, setReferenceSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  // ==========================================
  // Filter References
  // ==========================================

  const filteredReferences = useMemo(() => {
    const query = normalizeSearchText(referenceSearch);

    if (!query) return references;

    return references.filter((reference) => {
      const title = normalizeSearchText(reference.title);
      const slug = normalizeSearchText(reference.slug);

      return title.includes(query) || slug.includes(query);
    });
  }, [references, referenceSearch]);

  const selectedReferenceItem = useMemo(() => {
    return (
      references.find(
        (reference) => reference.id === selectedReference
      ) || null
    );
  }, [references, selectedReference]);

  const isChanged =
    selectedReference !== (question.referenceId || "");

  // ==========================================
  // Accessibility
  // ==========================================

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    searchInputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingRef.current) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose]);

  // ==========================================
  // Select Reference
  // ==========================================

  const handleSelectReference = (referenceId: string) => {
    if (savingRef.current) return;

    setSelectedReference(referenceId);
    setError("");
  };

  // ==========================================
  // Save Reference
  // ==========================================

  const handleSave = async () => {
    if (savingRef.current) return;

    if (!isChanged) {
      onClose();
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setError("");

    try {
      const result = await updateQuestionReferenceIdAction(
        question.id,
        selectedReference || null
      );

      if (!result.success || !result.data) {
        setError(
          result.message || "ذخیره رفرنس انجام نشد."
        );
        return;
      }

      const savedReferenceId = result.data.referenceId;

      const reference =
        references.find(
          (item) => item.id === savedReferenceId
        ) || null;

      onSuccess(
        question.id,
        savedReferenceId,
        reference
      );

      onClose();
      router.refresh();
    } catch (error) {
      console.error(
        "Save question reference error:",
        error
      );

      setError(
        "خطا در ارتباط با سرور. دوباره تلاش کنید."
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-[2px] sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !savingRef.current
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reference-dialog-title"
        aria-describedby="reference-dialog-description"
        className="flex h-[min(520px,85dvh)] w-full max-w-[540px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Library className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h2
                id="reference-dialog-title"
                className="text-xs font-bold text-slate-900 sm:text-sm"
              >
                تعیین رفرنس سؤال
              </h2>

              <p
                id="reference-dialog-description"
                className="mt-0.5 text-[10px] text-slate-500"
              >
                انتخاب منبع سؤال
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="بستن پنجره"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3 py-3 sm:px-4">
          {/* Question Information */}

          <div className="flex shrink-0 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-[10px] text-slate-500">
              سؤال انتخاب‌شده
            </span>

            <span className="max-w-[65%] truncate text-[11px] font-semibold text-slate-700">
              {question.questionCode
                ? `کد ${question.questionCode}`
                : "سؤال بدون کد"}
            </span>
          </div>

          {/* Reference Search */}

          <div className="flex shrink-0 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="reference-search"
                className="text-xs font-semibold text-slate-700"
              >
                انتخاب رفرنس
              </label>

              <span className="text-[10px] text-slate-400">
                {filteredReferences.length.toLocaleString("fa-IR")} نتیجه
              </span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                ref={searchInputRef}
                id="reference-search"
                type="search"
                autoComplete="off"
                value={referenceSearch}
                disabled={isSaving}
                onChange={(event) =>
                  setReferenceSearch(event.target.value)
                }
                placeholder="جست‌وجوی عنوان یا اسلاگ..."
                className="h-9 w-full rounded-lg border border-slate-300 bg-white pr-8 pl-8 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />

              {referenceSearch && (
                <button
                  type="button"
                  disabled={isSaving}
                  aria-label="پاک‌کردن جست‌وجو"
                  onClick={() => {
                    setReferenceSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Reference List */}

          <div
            role="group"
            aria-label="لیست رفرنس‌های سؤال"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-white"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent",
            }}
          >
            {!referenceSearch.trim() && (
              <button
                type="button"
                disabled={isSaving}
                aria-pressed={selectedReference === ""}
                onClick={() => handleSelectReference("")}
                className={`flex w-full items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 text-right transition ${
                  selectedReference === ""
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-[11px] font-medium">
                  بدون رفرنس
                </span>

                {selectedReference === "" && (
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                )}
              </button>
            )}

            {filteredReferences.length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5 p-2 sm:grid-cols-2">
                {filteredReferences.map((reference) => {
                  const isSelected =
                    selectedReference === reference.id;

                  const isDisabled =
                    !reference.isActive &&
                    reference.id !== question.referenceId;

                  return (
                    <button
                      key={reference.id}
                      type="button"
                      disabled={isSaving || isDisabled}
                      aria-pressed={isSelected}
                      onClick={() =>
                        handleSelectReference(reference.id)
                      }
                      className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-right transition ${
                        isSelected
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                      } ${
                        isDisabled
                          ? "cursor-not-allowed opacity-45"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          title={reference.title}
                          className={`line-clamp-2 break-words text-[11px] font-medium leading-4 ${
                            isSelected
                              ? "text-indigo-700"
                              : "text-slate-700"
                          }`}
                        >
                          {reference.title}
                        </p>

                        <p
                          dir="ltr"
                          title={reference.slug}
                          className="mt-0.5 truncate text-left text-[9px] text-slate-400"
                        >
                          {reference.slug}
                        </p>

                        {!reference.isActive && (
                          <p className="mt-0.5 text-[9px] text-amber-600">
                            غیرفعال
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-3 py-6 text-center">
                <Search className="mb-2 h-5 w-5 text-slate-300" />

                <p className="text-xs font-medium text-slate-600">
                  رفرنسی پیدا نشد
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  عبارت جست‌وجو را تغییر دهید.
                </p>

                {referenceSearch && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setReferenceSearch("");
                      searchInputRef.current?.focus();
                    }}
                    className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    نمایش تمام رفرنس‌ها
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Selected Reference */}

          <div className="flex shrink-0 items-center justify-between gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2">
            <span className="shrink-0 text-[10px] text-indigo-500">
              انتخاب فعلی:
            </span>

            <span className="min-w-0 truncate text-[11px] font-semibold text-indigo-700">
              {selectedReferenceItem?.title || "بدون رفرنس"}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="shrink-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700"
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-3 py-2.5 sm:px-4">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="h-8 rounded-lg border border-slate-300 bg-white px-3 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={isSaving || !isChanged}
            onClick={handleSave}
            className="inline-flex h-8 min-w-28 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                ذخیره رفرنس
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
