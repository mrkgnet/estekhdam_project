'use client'

import addIssueQuestionUser from '@/actions/user/issu-question/Actions'
import React, { useActionState, useState } from 'react'

const initialState = {
  success: false,
  message: '',
  errors: {} as Record<string, string>,
}

export default function SendPQComponent() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(addIssueQuestionUser, initialState)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-1.5 px-3 py-1.5 text-10 font-medium text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 bg-white/60 dark:bg-slate-800/60 hover:bg-amber-50/60 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-amber-200/80 dark:hover:border-amber-700/50"
      >
        <span>گزارش وجود مشکل در سوال</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* پس‌زمینه تاریک و بلور شده پشت مدال */}
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-colors duration-300"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-40 w-[98%] shadow max-w-md rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-xl top-20 md:top-0 border border-gray-300 dark:border-slate-700 transition-colors duration-300" dir="rtl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">گزارش مشکل در سوال </h3>
              <button
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="mt-4 space-y-3">
              <div>
                <label htmlFor="questionId" className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1 transition-colors">
                  شناسه سوال
                  *
                </label>
                <input
                  id="questionId"
                  name="questionId"
                  type="text"
                  placeholder="مثلاً 82G6OV"
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/30 transition-colors outline-none"
                />
                {state.errors?.questionId && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{state.errors.questionId}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1 transition-colors">
                  توضیحات*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="مشکل را توضیح دهید..."
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/30 transition-colors outline-none resize-none"
                />
                {state.errors?.description && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{state.errors.description}</p>
                )}
              </div>

              {state.message && (
                <p className={`text-xs ${state.success ? 'text-green-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {state.message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60 transition-colors"
                >
                  {isPending ? 'در حال ارسال...' : 'ارسال'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}