"use client";

import { useState } from "react";

export default function TestImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // هندل کردن انتخاب عکس توسط کاربر
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage(null);
      setProcessedImageUrl(null); // پاک کردن عکس قبلی
      // ایجاد یک URL موقت برای نمایش پیش‌نمایش عکسی که کاربر انتخاب کرده
      setPreviewOriginal(URL.createObjectURL(selectedFile));
    }
  };

  // ارسال عکس به API
  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("لطفاً ابتدا یک تصویر انتخاب کنید.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // ارسال درخواست به Route Handler ای که ساختید
      const response = await fetch("/api/upload-product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطایی در آپلود رخ داد");
      }

      // دریافت URL عکس پردازش شده از سمت سرور
      setProcessedImageUrl(data.url);
      
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          تست حذف پس‌زمینه و ایجاد بک‌گراند سفید
        </h1>

        {/* بخش انتخاب فایل */}
        <div className="flex flex-col items-center gap-4 mb-8 border-2 border-dashed border-gray-300 p-8 rounded-lg bg-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
              !file || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "در حال پردازش (ممکن است چند ثانیه طول بکشد)..." : "پردازش تصویر"}
          </button>
          
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* بخش نمایش تصاویر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* پیش‌نمایش عکس اصلی */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-3">عکس اصلی:</h3>
            <div className="w-full h-80 border rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {previewOriginal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewOriginal}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">عکسی انتخاب نشده</span>
              )}
            </div>
          </div>

          {/* پیش‌نمایش عکس پردازش شده */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-3">نتیجه نهایی (بک‌گراند سفید):</h3>
            <div className="w-full h-80 border rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
              {isLoading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              ) : processedImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={processedImageUrl}
                  alt="Processed"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">منتظر پردازش...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}