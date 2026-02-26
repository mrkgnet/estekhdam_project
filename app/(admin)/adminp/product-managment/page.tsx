// app/(admin)/product-managment/page.tsx

"use client";


// به جای `useFormState` از `react-dom`، ما `useActionState` را از `react` وارد می‌کنیم.
import { useState, useActionState } from "react"; 
import { useFormStatus } from "react-dom";

// اکشنی که در مرحله قبل ساختیم را وارد می‌کنیم
import { createProduct } from "@/actions/create_product"; // (مسیر را در صورت نیاز اصلاح کنید)

// کامپوننت دکمه برای نمایش وضعیت لودینگ
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-green-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:bg-gray-500 sm:w-auto"
    >
      {pending ? "در حال ثبت..." : "ثبت محصول"}
    </button>
  );
}

export default function CreateProductForm() {
  // state ها برای بخش‌های تعاملی فرم که به رندر مجدد نیاز دارند باقی می‌مانند
  const [features, setFeatures] = useState<string[]>([""]);
  const [duration, setDuration] = useState<"instant" | "hours">("instant");
  const [hours, setHours] = useState("2");

  // useFormState را برای مدیریت پاسخ اکشن راه‌اندازی می‌کنیم
  const initialState = { message: "", errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);

  function addFeature() { setFeatures((prev) => [...prev, ""]); }
  function removeFeature(index: number) { setFeatures((prev) => prev.filter((_, i) => i !== index)); }
  function updateFeature(index: number, value: string) { setFeatures((prev) => prev.map((f, i) => (i === index ? value : f))); }


  return (
    // به جای `onSubmit` از `action` استفاده می‌کنیم
    <form action={formAction} className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-5">
        {/* نمایش پیام کلی موفقیت یا خطا */}
        {state.message && (
          <p className={`text-sm ${state.errors ? "text-red-600" : "text-green-600"}`}>{state.message}</p>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-gray-800">
            عنوان فارسی محصول
          </label>
          <input
            id="title"
            name="title" // <-- 'name' برای ارسال به اکشن ضروری است
            required
            placeholder="مثلاً: اشتراک ویژه"
            className="w-full rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
          />
          {state.errors?.title && <p className="mt-1 text-xs text-red-500">{state.errors.title[0]}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-2 block text-sm text-gray-800">
            عنوان خارجی (اسلاگ)
          </label>
          <input
            id="slug"
            name="slug" // <-- 'name'
            required
            placeholder="مثلاً: special-subscription"
            className="w-full rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
          />
          {state.errors?.slug && <p className="mt-1 text-xs text-red-500">{state.errors.slug[0]}</p>}
        </div>


        {/* image url */}
          {/* Image URL -- فیلد جدید */}
        <div>
          <label htmlFor="imageURL" className="mb-2 block text-sm text-gray-800">آدرس عکس اصلی محصول</label>
          <input id="imageURL" name="imageURL" required type="url" placeholder="https://example.com/image.jpg" className="w-full rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900" style={{ direction: 'ltr' }}/>
          {state.errors?.imageUrl && <p className="mt-1 text-xs text-red-500">{state.errors.imageUrl[0]}</p>}
        </div>

        {/* Features */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm text-gray-800">ویژگی‌های محصول</label>
            <button
              type="button"
              onClick={addFeature}
              className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white hover:bg-gray-800"
            >
              + افزودن ویژگی
            </button>
          </div>
          <div className="space-y-2">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  name="features" // <-- 'name'
                  value={f}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  placeholder={`ویژگی ${idx + 1}`}
                  className="flex-1 rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="rounded-2xl border px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
          {state.errors?.features && <p className="mt-1 text-xs text-red-500">{state.errors.features[0]}</p>}
        </div>

        {/* Price + Duration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-2 block text-sm text-gray-800">
              قیمت محصول (تومان)
            </label>
            <input
              id="price"
              name="price" // <-- 'name'
              placeholder="مثلاً: 350000"
              inputMode="numeric"
              className="w-full rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
            />
            {state.errors?.price && <p className="mt-1 text-xs text-red-500">{state.errors.price[0]}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-800">مدت زمان محصول</label>
            {/* یک فیلد مخفی برای ارسال نوع به اکشن */}
            <input type="hidden" name="durationType" value={duration} />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration("instant")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${duration === "instant" ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                فوری
              </button>
              <button
                type="button"
                onClick={() => setDuration("hours")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${duration === "hours" ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                چند ساعته
              </button>
            </div>
            {duration === "hours" && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  name="hours" // <-- 'name'
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  inputMode="numeric"
                  className="w-24 rounded-2xl border bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
                />
                <span className="text-sm text-gray-600">ساعت</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
         <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="reset" className="w-full rounded-2xl border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:w-auto">پاک کردن فرم</button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
