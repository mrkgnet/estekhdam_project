"use client"

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Copy, Check, FileText } from 'lucide-react';

interface UploadResponse {
  url?: string;
  error?: string;
}

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  // اضافه شدن فرمت PDF به فرمت‌های مجاز
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('فقط فایل‌های تصویری و PDF مجاز هستند');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('حجم فایل نباید بیشتر از 500 مگابایت باشد');
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploadedUrl('');
    setProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('لطفاً یک فایل انتخاب کنید');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        throw new Error(`خطا در آپلود: ${res.status}`);
      }

      const data: UploadResponse = await res.json();

      if (data.url) {
        setUploadedUrl(data.url);
        setTimeout(() => {
          setProgress(0);
        }, 1000);
      } else {
        throw new Error(data.error || 'آپلود ناموفق بود');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'خطا در آپلود فایل');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setUploadedUrl('');
    setError('');
    setProgress(0);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fakeEvent = {
        target: { files: [droppedFile] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">آپلود فایل</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
            ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          `}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
            disabled={uploading}
          />

          {!previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  فایل را اینجا بکشید یا کلیک کنید
                </p>
                <p className="text-sm text-gray-500">
                  تصویر یا PDF (حداکثر 500MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative p-2">
              {file?.type === 'application/pdf' ? (
                <div className="flex flex-col items-center justify-center py-6 bg-red-50 rounded-lg border border-red-100">
                  <FileText className="w-16 h-16 text-red-500 mb-2" />
                  <span className="text-sm text-red-700 font-medium max-w-[200px] truncate" dir="ltr">
                    {file.name}
                  </span>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg shadow-sm"
                />
              )}
              
              {!uploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* File Info */}
        {file && !uploadedUrl && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded bg-blue-100 flex-shrink-0 flex items-center justify-center">
                {file.type === 'application/pdf' ? (
                  <FileText className="w-5 h-5 text-red-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate" dir="ltr">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">در حال آپلود...</span>
              <span className="text-blue-600 font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadedUrl && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                فایل با موفقیت آپلود شد
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline break-all flex-1"
                dir="ltr"
              >
                {uploadedUrl}
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`
                  px-3 py-1 text-xs rounded transition-all duration-300 whitespace-nowrap flex items-center gap-1.5
                  ${copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    لینک کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    کپی لینک
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!file || uploading}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium
              transition-all duration-300 transform
              ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                آپلود فایل
              </>
            )}
          </button>

          {(file || uploadedUrl) && !uploading && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              پاک کردن
            </button>
          )}
        </div>
      </form>
    </div>
  );
}