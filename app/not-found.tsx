// app/not-found.tsx  یا pages/404.tsx
import Link from "next/link";
import { Home, ArrowRight, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center border border-gray-200 rounded-2xl bg-white shadow-sm p-8 md:p-10">
        {/* آیکون هشدار رسمی */}
        <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h1 className="mt-6 text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
          404
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-gray-800">
          صفحه مورد نظر پیدا نشد
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          ممکن است آدرس اشتباه باشد یا این صفحه حذف شده باشد.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 h-11 rounded-lg bg-gray-900 text-white font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Link>

     
        </div>

        {/* لینک کمکی (اختیاری) */}
        <p className="mt-6 text-xs text-gray-400">
          اگر فکر می‌کنید این خطا اشتباه است، با پشتیبانی تماس بگیرید.
        </p>
      </div>
    </main>
  );
}