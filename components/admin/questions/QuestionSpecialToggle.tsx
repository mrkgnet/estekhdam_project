
"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

import { updateQuestionSpecialAction } from "@/actions/admin/questions/Actions";

// ============================================
// Types
// ============================================

interface QuestionSpecialToggleProps {
  questionId: string;
  productId: string;
  isSpecial: boolean;
  onSuccess: (isSpecial: boolean) => void;
}

// ============================================
// Main Component
// ============================================

export default function QuestionSpecialToggle({
  questionId,
  productId,
  isSpecial,
  onSuccess,
}: QuestionSpecialToggleProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // Toggle Special Question
  // ============================================

  const handleToggle = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const newStatus = !isSpecial;

      const result = await updateQuestionSpecialAction(
        questionId,
        productId,
        newStatus
      );

      if (!result.success) {
        setError(
          result.message ||
            "خطا در تغییر وضعیت ویژه سؤال."
        );
        return;
      }

      // Update question state in parent component
      onSuccess(newStatus);
    } catch (error) {
      console.error(
        "Question Special Toggle Error:",
        error
      );

      setError("خطا در ارتباط با سرور.");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={isSpecial}
        aria-label={
          isSpecial
            ? "خارج کردن سؤال از حالت ویژه"
            : "ویژه کردن سؤال"
        }
        title={
          isSpecial
            ? "حذف از سؤالات ویژه"
            : "افزودن به سؤالات ویژه"
        }
        disabled={isSaving}
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 shrink-0
          items-center rounded-full
          transition-colors duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            isSpecial
              ? "bg-blue-800"
              : "bg-slate-400"
          }
        `}
      >
        <span
          className={`
            inline-block h-[18px] w-[18px]
            rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${
              isSpecial
                ? "-translate-x-6"
                : "-translate-x-1"
            }
          `}
        />
      </button>

      <span
        className={`
          text-[10px] font-medium
          ${
            isSpecial
              ? "text-amber-700"
              : "text-slate-500"
          }
        `}
      >
        {isSaving ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            ذخیره...
          </span>
        ) : isSpecial ? (
          "ویژه"
        ) : (
          "عادی"
        )}
      </span>

      {error && (
        <span
          role="alert"
          className="max-w-28 text-center text-[10px] leading-4 text-rose-600"
        >
          {error}
        </span>
      )}
    </div>
  );
}
