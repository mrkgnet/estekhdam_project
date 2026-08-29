"use client"

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Copy, Check, FileText } from 'lucide-react';

interface UploadResponse {
  url?: string;
  error?: string;
}

interface UploadImageProps {
  onUploadSuccess?: (url: string) => void;
}

export default function UploadImage({ onUploadSuccess }: UploadImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('حجم فایل نباید بیشتر از 500 مگابایت باشد');
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploadedUrl('');
    setProgress(0);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl('non-image-file');
    }
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
        onUploadSuccess?.(data.url);
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
    onUploadSuccess?.('');
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

  const isImageFile = file?.type.startsWith('image/');
  const isPdfFile = file?.type === 'application/pdf';

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-xs">
      <div className="flex items-center gap-1.5 mb-3">
        <Upload className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-semibold text-gray-800">آپلود فایل</h3>
      </div>

      <div className="space-y-3">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative border border-dashed rounded-lg p-4 text-center transition-all duration-300
            ${file ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
            ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          `}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="*/*"
            className="hidden"
            disabled={uploading}
          />

          {!previewUrl ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium text-xs mb-0.5">
                  فایل را اینجا بکشید یا کلیک کنید
                </p>
                <p className="text-[10px] text-gray-400">
                  حداکثر حجم: 500MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative p-1">
              {isImageFile ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-32 mx-auto rounded-md shadow-sm"
                />
              ) : (
                <div className={`flex flex-col items-center justify-center py-3 rounded-md border ${
                  isPdfFile ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'
                }`}>
                  <FileText className={`w-10 h-10 mb-1 ${isPdfFile ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium max-w-[160px] truncate ${
                    isPdfFile ? 'text-red-700' : 'text-gray-700'
                  }`} dir="ltr">
                    {file?.name}
                  </span>
                </div>
              )}

              {!uploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {file && !uploadedUrl && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 w-full">
              <div className="w-7 h-7 rounded bg-blue-100 flex-shrink-0 flex items-center justify-center">
                {isImageFile ? (
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <FileText className={`w-3.5 h-3.5 ${isPdfFile ? 'text-red-600' : 'text-gray-600'}`} />
                )}
              </div>
              <div className="overflow-hidden text-right">
                <p className="text-[11px] font-medium text-gray-800 truncate" dir="ltr">{file.name}</p>
                <p className="text-[10px] text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          </div>
        )}

        {uploading && progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-600">در حال آپلود...</span>
              <span className="text-blue-600 font-medium">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-700">{error}</p>
          </div>
        )}

        {uploadedUrl && (
          <div className="space-y-2 p-2.5 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-[11px] font-medium text-green-800">
                فایل با موفقیت آپلود شد
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 hover:text-blue-700 underline break-all flex-1"
                dir="ltr"
              >
                {uploadedUrl}
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`
                  px-2 py-0.5 text-[10px] rounded transition-all whitespace-nowrap flex items-center gap-1
                  ${copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    کپی
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || uploading}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium text-xs
              transition-all duration-300
              ${
                !file || uploading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                آپلود فایل
              </>
            )}
          </button>

          {(file || uploadedUrl) && !uploading && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              پاک کردن
            </button>
          )}
        </div>
      </div>
    </div>
  );
}