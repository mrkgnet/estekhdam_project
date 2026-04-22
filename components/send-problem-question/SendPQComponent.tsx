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
        className="group flex items-center gap-1.5 px-3 py-1.5 text-10 font-medium text-gray-500 hover:text-amber-600 bg-white/60 hover:bg-amber-50/60 rounded-lg transition-all duration-200 shadow-sm border border-gray-200/50 hover:border-amber-200/80"
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
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div
            className="absolute inset-0 "
            onClick={() => setOpen(false)}
          />

          <div className="relative z-40 w-[98%] shadow max-w-md rounded-2xl bg-white p-5 shadow-xl top-20 md:top-0 border border-gray-300" dir="rtl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">گزارش مشکل در سوال </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setOpen(false)}
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="mt-4 space-y-3">
              <div>
                <label htmlFor="questionId" className="block text-xs font-medium text-gray-700 mb-1">
                  شناسه سوال
                  *
                </label>
                <input
                  id="questionId"
                  name="questionId"
                  type="text"
                  placeholder="مثلاً 82G6OV"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
                {state.errors?.questionId && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.questionId}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                  توضیحات*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="مشکل را توضیح دهید..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
                {state.errors?.description && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.description}</p>
                )}
              </div>

              {state.message && (
                <p className={`text-xs ${state.success ? 'text-green-600' : 'text-red-500'}`}>
                  {state.message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:text-gray-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
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
