"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type ChoiceKey = "A" | "B" | "C" | "D";

type Question = {
  id: string;
  text: string;
  choices: { key: ChoiceKey; text: string }[];
  correct: ChoiceKey;

  // این متن را بعداً از پنل ادمین پر می‌کنی
  explanation?: string;

  // اگر خواستی برای هر گزینه توضیح جدا داشته باشی (اختیاری)
  explanationByChoice?: Partial<Record<ChoiceKey, string>>;
};

export default function ExamPage() {
  const params = useParams<{ examName: string }>();
  const examName = decodeURIComponent(params?.examName ?? "unknown");

  // فعلاً ۱ سوال نمونه — بعداً از دیتابیس/ادمین میاد
  const questions: Question[] = useMemo(
    () => [
      {
        id: "q1",
        text: "کدام جمله از نظر گرامری درست‌تر است؟",
        choices: [
          { key: "A", text: "She don’t like coffee." },
          { key: "B", text: "She doesn’t likes coffee." },
          { key: "C", text: "She doesn’t like coffee." },
          { key: "D", text: "She not like coffee." },
        ],
        correct: "C",
        explanation: "در زمان حال ساده، برای سوم‌شخص مفرد از doesn't + فعل ساده استفاده می‌کنیم: doesn't like.",
        explanationByChoice: {
          A: "در سوم‌شخص مفرد باید از doesn't استفاده شود، نه don't.",
          B: "بعد از doesn't فعل به حالت ساده می‌آید (like)، نه likes.",
          C: "✅ ساختار درست: doesn't + فعل ساده.",
          D: "ساختار جمله ناقص است و فعل کمکی ندارد.",
        },
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const q = questions[index];

  const [selected, setSelected] = useState<ChoiceKey | null>(null);

  // وقتی انتخاب انجام شد، پنل «پاسخ سوال» باز می‌شود
  const showAnswerPanel = selected !== null;

  // از اینجا تعیین می‌کنیم چه متنی نمایش داده شود
  const answerTitle = selected
    ? selected === q.correct
      ? "پاسخ سوال (انتخاب شما درست است ✅)"
      : "پاسخ سوال (انتخاب شما نادرست است ❌)"
    : "پاسخ سوال";

  const answerText =
    (selected && q.explanationByChoice?.[selected]) || q.explanation || "هنوز توضیح پاسخ برای این سوال ثبت نشده است.";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">آزمون: {examName}</h1>
              <p className="mt-1 text-sm text-slate-500">
                سوال {index + 1} از {questions.length}
              </p>
            </div>

            {/* Progress */}
            <div className="w-28">
              <div className="text-xs text-slate-500 mb-1 text-left">
                {Math.round(((index + 1) / questions.length) * 100)}%
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${((index + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-5">
          <div className= " flex justify-between gap-4  leading-7">
            <span className="text-slate-800 font-bold"> {q.text}</span>
            <span>بانک مرکزی</span>
          </div>

          {/* Choices */}
          <div className="mt-4 space-y-2">
            {q.choices.map((ch) => {
              const active = selected === ch.key;

              // بعد از انتخاب، رنگ درست/غلط هم مشخص می‌شود (بدون دکمه ثبت)
              const showResult = selected !== null;
              const isRightChoice = ch.key === q.correct;
              const isUserChoice = ch.key === selected;

              let borderClass = "border-slate-200";
              let bgClass = "bg-white";

              if (showResult) {
                if (isRightChoice) {
                  borderClass = "border-green-400";
                  bgClass = "bg-green-50";
                } else if (isUserChoice && !isRightChoice) {
                  borderClass = "border-red-400";
                  bgClass = "bg-red-50";
                }
              } else if (active) {
                borderClass = "border-slate-800";
                bgClass = "bg-slate-50";
              }

              return (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => setSelected(ch.key)}
                  className={`w-full text-right rounded-2xl border ${borderClass} ${bgClass} p-4 transition hover:bg-slate-50`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-800">{ch.text}</span>

                    <span className="shrink-0 h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      {ch.key}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Answer Panel (بازشونده بعد از کلیک) */}
          <div
            className={`mt-4 overflow-hidden rounded-2xl border transition-all ${
              showAnswerPanel
                ? "max-h-[400px] border-slate-200 bg-slate-50"
                : "max-h-0 border-transparent bg-transparent"
            }`}
          >
            <div className="p-4">
              <div className="text-sm font-extrabold text-slate-800">{answerTitle}</div>

              <div className="mt-2 text-sm text-slate-700 leading-7">{answerText}</div>

              {/* می‌تونی این بخش رو نگه داری یا حذف کنی */}
              {selected && (
                <div className="mt-3 text-xs text-slate-500">
                  پاسخ صحیح: <span className="font-bold">{q.correct}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => {
                setIndex((i) => Math.max(0, i - 1));
                setSelected(null); // با رفتن به سوال قبلی، پنل بسته می‌شود
              }}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
            >
              سوال قبلی
            </button>

            <button
              type="button"
              disabled={index === questions.length - 1}
              onClick={() => {
                setIndex((i) => Math.min(questions.length - 1, i + 1));
                setSelected(null); // با رفتن به سوال بعدی، پنل بسته می‌شود
              }}
              className="h-10 px-4 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:hover:bg-green-500"
            >
              سوال بعدی
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          نکته: متن «پاسخ سوال» از `explanation` یا `explanationByChoice` میاد؛ این‌ها رو بعداً از پنل ادمین ذخیره و لود
          می‌کنی.
        </div>
      </div>
    </div>
  );
}
