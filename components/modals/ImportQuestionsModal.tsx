"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { X, Download, CheckCircle2 } from "lucide-react";
import { importQuestionsAction } from "@/actions/admin/import_questions/import/Actions";

interface ImportQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryChapters: any[];
  productId: string;
}

export default function ImportQuestionsModal({
  isOpen,
  onClose,
  categoryChapters,
  productId,
}: ImportQuestionsModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleImport = () => {
    if (!selectedCategoryId) {
      alert("لطفاً یک دسته‌بندی انتخاب کنید");
      return;
    }

    startTransition(async () => {
      // فراخوانی اکشن فقط با دو پارامتر
      const result = await importQuestionsAction(productId, parseInt(selectedCategoryId));
      
      if (result.success) {
        alert(result.message);
        onClose();
      } else {
        alert(result.message || "خطا در ایمپورت سوالات");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-600" />
            ایمپورت سوالات جدید از دسته‌بندی
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer" title="بستن">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="categorySelect" className="text-sm font-semibold text-gray-700">
              انتخاب دسته‌بندی سرفصل *
            </label>
            <select
              id="categorySelect"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-50 bg-white text-gray-800"
            >
              <option value="">-- یک دسته‌بندی را انتخاب کنید --</option>
              {categoryChapters?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.slug})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              سیستم به صورت خودکار سوالات تکراری را نادیده گرفته و فقط سوالات جدید را وارد می‌کند.
            </p>
          </div>

          {selectedCategoryId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-1">دسته‌بندی انتخاب شده:</p>
                  <p>
                    {categoryChapters.find((c) => c.id === parseInt(selectedCategoryId))?.name}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} disabled={isPending} className="px-5 py-2.5 cursor-pointer bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800 transition-colors disabled:opacity-50">
            انصراف
          </button>
          <button type="button" onClick={handleImport} disabled={!selectedCategoryId || isPending} className="px-5 py-2.5 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            {isPending ? (
              <>
                <span className="animate-spin">⏳</span>
                در حال پردازش...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                ایمپورت سوالات
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
