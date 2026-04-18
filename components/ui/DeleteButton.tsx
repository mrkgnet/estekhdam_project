"use client";

import toast from "react-hot-toast";

// تعریف پراپ‌های ورودی کامپوننت
interface DeleteButtonProps {
  id: string; // آیدی آیتمی که قرار است حذف شود
  action: (id: string) => Promise<{ success: boolean; message?: string }>; // اکشن سرور مربوطه
  itemName?: string; // نام آیتم برای نمایش در پیام (مثلاً "این کاربر" یا "این محصول")
  className?: string; // برای دریافت استایل‌های سفارشی
  children?: React.ReactNode; // برای قرار دادن آیکون یا متن داخل دکمه
}

export default function DeleteButton({
  id,
  action,
  itemName = "این آیتم",
  className,
  children,
}: DeleteButtonProps) {
  
  // همان منطق حذف که قبلاً نوشتیم
  const handleDeleteClick = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-800">
          آیا از حذف {itemName} مطمئن هستید؟
        </p>

        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("در حال حذف...");

              try {
                // صدا زدن اکشن سروری که از طریق پراپ پاس داده شده است
                const res = await action(id);

                if (res?.success) {
                  toast.success(res.message || "با موفقیت حذف شد", {
                    id: loadingToast,
                  });
                } else {
                  toast.error(res.message || "خطا: ابتدا زیر مجموعه را حذف کنید", {
                    id: loadingToast,
                  });
                }
              } catch (error) {
                toast.error("خطای ناشناخته‌ای رخ داد.", { id: loadingToast });
              }
            }}
          >
            بله، حذف کن
          </button>

          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            انصراف
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  return (
    <button onClick={handleDeleteClick} className={className}>
      {children ? children : "حذف"}
    </button>
  );
}
