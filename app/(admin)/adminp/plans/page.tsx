"use client";

import React, { useState, useActionState, useEffect, useTransition } from "react";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/actions/admin/plans/Actions";

type SubscriptionPlan = {
  id: string;
  title: string;
  slug: string;
  durationDays: number;
  price: number;
  discountPrice: number | null;
  description: string | null;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// فرمت کردن عدد به صورت جداشده با کاما (مثلاً 1000000 -> 1,000,000)
const formatNumberWithCommas = (value: string) => {
  const digitsOnly = value.replace(/\D/g, ""); // فقط ارقام را نگه می‌دارد
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString("en-US");
};

// حذف کاما و برگرداندن عدد خام برای ارسال به سرور
const unformatNumber = (value: string) => value.replace(/\D/g, "");

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  // وضعیت مدال (ایجاد یا ویرایش)
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // استیت مقدار اسلاگ برای تبدیل لحظه‌ای
  const [slugValue, setSlugValue] = useState("");

  // استیت مقادیر نمایشی قیمت (فرمت‌شده با کاما)
  const [priceDisplay, setPriceDisplay] = useState("");
  const [discountDisplay, setDiscountDisplay] = useState("");

  // تابع تبدیل فاصله به خط تیره
  const formatSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-") // جایگزینی فاصله با خط تیره
      .replace(/[^\w\u0600-\u06FF\-]+/g, "") // حذف کاراکترهای غیرمجاز (پشتیبانی از حروف فارسی و انگلیسی)
      .replace(/\-\-+/g, "-"); // جلوگیری از تکرار چند خط تیره پشت هم
  };

  // دریافت لیست پلن‌ها
  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionPlans();
      setPlans(data as unknown as SubscriptionPlan[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // اکشن ارسال فرم
  const [state, formAction, isSubmitting] = useActionState(
    async (prevState: any, formData: FormData) => {
      let res;
      if (editingPlan) {
        res = await updateSubscriptionPlan(editingPlan.id, formData);
      } else {
        res = await createSubscriptionPlan(formData);
      }

      if (res.success) {
        setIsOpen(false);
        await loadPlans();
        return { error: null };
      } else {
        return { error: res.error || "خطایی رخ داده است." };
      }
    },
    { error: null }
  );

  // قفل کردن اسکرول صفحه هنگام باز بودن مدال
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // باز کردن مدال برای ایجاد
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setSlugValue("");
    setPriceDisplay("");
    setDiscountDisplay("");
    setIsOpen(true);
  };

  // باز کردن مدال برای ویرایش
  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setSlugValue(plan.slug);
    setPriceDisplay(plan.price ? plan.price.toLocaleString("en-US") : "");
    setDiscountDisplay(
      plan.discountPrice ? plan.discountPrice.toLocaleString("en-US") : ""
    );
    setIsOpen(true);
  };

  // حذف پلن
  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این پلن اطمینان دارید؟")) {
      startDeleteTransition(async () => {
        const res = await deleteSubscriptionPlan(id);
        if (res.success) {
          await loadPlans();
        } else {
          alert(res.error);
        }
      });
    }
  };

  return (
    <div className="p-6 dir-rtl text-right font-sans bg-gray-50 min-h-screen">
      {/* سربرگ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت پلن‌های اشتراک</h1>
          <p className="text-sm text-gray-500 mt-1">افزودن، ویرایش و فعال/غیرفعال‌سازی پلن‌ها</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-all flex items-center gap-2"
        >
          <span>+</span> افزودن پلن جدید
        </button>
      </div>

      {/* جدول داده‌ها */}
      <div className="bg-white rounded shadow border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">در حال دریافت اطلاعات...</div>
        ) : plans.length === 0 ? (
          <div className="p-8 text-center text-gray-500">هیچ پلنی یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">عنوان</th>
                  <th className="py-3.5 px-4 font-semibold">اسلاگ</th>
                  <th className="py-3.5 px-4 font-semibold">مدت (روز)</th>
                  <th className="py-3.5 px-4 font-semibold">قیمت (تومان)</th>
                  <th className="py-3.5 px-4 font-semibold">قیمت با تخفیف</th>
                  <th className="py-3.5 px-4 font-semibold">وضعیت</th>
                  <th className="py-3.5 px-4 font-semibold">محبوب</th>
                  <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{plan.title}</td>
                    <td className="py-3.5 px-4 text-gray-500 dir-ltr text-right">{plan.slug}</td>
                    <td className="py-3.5 px-4 text-gray-600">{plan.durationDays} روز</td>
                    <td className="py-3.5 px-4 text-gray-800 font-semibold">
                      {plan.price.toLocaleString("fa-IR")}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                      {plan.discountPrice ? plan.discountPrice.toLocaleString("fa-IR") : "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          plan.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {plan.isActive ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {plan.isPopular ? (
                        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          ⭐ ویژه
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          disabled={isDeletePending}
                          className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition disabled:opacity-50"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* مدال افزودن / ویرایش */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPlan ? "ویرایش پلن اشتراک" : "افزودن پلن جدید"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {state?.error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {state.error}
              </div>
            )}

            {/* استفاده مستقیم از formAction برای ارسال بومی فرم */}
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* عنوان */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان پلن *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingPlan?.title || ""}
                    placeholder="مثلاً: اشتراک ۳ ماهه"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* اسلاگ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسلاگ یکتا (Slug) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={slugValue}
                    onChange={(e) => setSlugValue(formatSlug(e.target.value))}
                    placeholder="مثلاً: 3-months-plan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dir-ltr"
                  />
                </div>

                {/* مدت زمان */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مدت زمان (روز) *
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    required
                    min="1"
                    defaultValue={editingPlan?.durationDays || 30}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* قیمت اصلی - با فرمت کاما */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت اصلی (تومان) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceDisplay}
                    onChange={(e) =>
                      setPriceDisplay(formatNumberWithCommas(e.target.value))
                    }
                    placeholder="مثلاً: 1,500,000"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dir-ltr text-right"
                  />
                  {/* مقدار خام (بدون کاما) که واقعاً به سرور ارسال می‌شود */}
                  <input type="hidden" name="price" value={unformatNumber(priceDisplay)} />
                </div>

                {/* قیمت با تخفیف - با فرمت کاما */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت با تخفیف (تومان) - اختیاری
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={discountDisplay}
                    onChange={(e) =>
                      setDiscountDisplay(formatNumberWithCommas(e.target.value))
                    }
                    placeholder="در صورت عدم وجود خالی بگذارید"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dir-ltr text-right"
                  />
                  {/* مقدار خام (بدون کاما) که واقعاً به سرور ارسال می‌شود */}
                  <input
                    type="hidden"
                    name="discountPrice"
                    value={unformatNumber(discountDisplay)}
                  />
                </div>
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات کوتاه
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingPlan?.description || ""}
                  placeholder="توضیحاتی خلاصه درباره این پلن..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* امکانات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  امکانات پلن (هر امکان در یک سطر جدید)
                </label>
                <textarea
                  name="features"
                  rows={3}
                  defaultValue={editingPlan?.features?.join("\n") || ""}
                  placeholder="دسترسی کامل به فایل‌ها&#10;پشتیبانی ۲۴ ساعته&#10;تخفیف ویژه دوره"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* چک‌باکس‌ها */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingPlan ? editingPlan.isActive : true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  فعال بودن پلن
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    value="true"
                    defaultChecked={editingPlan ? editingPlan.isPopular : false}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  نشان پلن محبوب / ویژه ⭐
                </label>
              </div>

              {/* دکمه‌های ثبت و انصراف */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow transition disabled:opacity-50"
                >
                  {isSubmitting ? "در حال ثبت..." : editingPlan ? "بروزرسانی پلن" : "ایجاد پلن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
