"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Edit, Trash2, Plus, CreditCard } from "lucide-react";
import { deleteUserAction } from "@/actions/admin/uesrs/deleteuser/Actions";
import DeleteButton from "@/components/ui/DeleteButton";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import AddUserModal from "@/components/modals/AddUserModal";
import EditUserModal from "@/components/modals/EditUserModal";
import UserSubscriptionsModal, {
  SubscriptionItem,
  PlanItem,
} from "@/components/modals/UserSubscriptionsModal";

type Role = "admin" | "user";

type DataUsers = {
  id: string;
  phoneNumber: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
  createdAt: Date;
  subscriptions: SubscriptionItem[];
};

type UsersResponse = {
  data?: DataUsers[];
  totalPages?: number;
  totalCount?: number;
};

const ITEMS_PER_PAGE = 10;

// ... (کامپوننت‌های اسکلتون SkeletonWave, UserTableRowsSkeleton, PaginationSkeleton بدون تغییر می‌مانند)
function SkeletonWave({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} />;
}

function UserTableRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-50">
          <td className="px-6 py-4"><SkeletonWave className="h-4 w-10" /></td>
          <td className="px-6 py-4"><SkeletonWave className="h-4 w-28" /></td>
          <td className="px-6 py-4"><SkeletonWave className="h-4 w-36" /></td>
          <td className="px-6 py-4"><SkeletonWave className="h-8 w-16 rounded-md" /></td>
          <td className="px-6 py-4"><SkeletonWave className="h-4 w-24" /></td>
          <td className="px-6 py-4 text-center"><div className="flex justify-center"><SkeletonWave className="h-8 w-28 rounded-md" /></div></td>
          <td className="px-6 py-4 text-center"><div className="flex justify-center"><SkeletonWave className="h-8 w-20 rounded-md" /></div></td>
          <td className="px-6 py-4 text-center"><div className="flex justify-center"><SkeletonWave className="h-8 w-16 rounded-md" /></div></td>
        </tr>
      ))}
    </>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-5 border-t border-gray-100">
      <SkeletonWave className="h-9 w-24 rounded-lg" />
      <SkeletonWave className="h-9 w-10 rounded-lg" />
      <SkeletonWave className="h-9 w-10 rounded-lg" />
      <SkeletonWave className="h-9 w-10 rounded-lg" />
      <SkeletonWave className="h-9 w-24 rounded-lg" />
    </div>
  );
}

export default function InfoUserData({
  dataUsers,
  plans = [],
}: {
  dataUsers: UsersResponse;
  plans?: PlanItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false);
  
  // برای ویرایش هم بهتر است به جای کل آبجکت، فقط ID را ذخیره کنید، اما برای جلوگیری از پیچیدگی فعلاً همانطور می‌گذاریم
  const [editingUser, setEditingUser] = useState<DataUsers | null>(null);
  
  // 🟢 تغییر اصلی اینجاست: فقط ID کاربری که مودال اشتراکش باز است را ذخیره می‌کنیم
  const [selectedUserIdForPlans, setSelectedUserIdForPlans] = useState<string | null>(null);
  
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const infoUsers: DataUsers[] = dataUsers?.data || [];
  const totalPages = dataUsers?.totalPages || 0;
  const totalUsersCount = dataUsers?.totalCount || 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // 🟢 استخراج داینامیک دیتای کاربر از لیست به‌روز شده
  // وقتی router.refresh() لیست infoUsers را آپدیت می‌کند، این متغیر به طور خودکار دیتای جدید (شامل اشتراک‌های جدید) را می‌گیرد
  const selectedUserForPlans = infoUsers.find(u => u.id === selectedUserIdForPlans) || null;

  useEffect(() => {
    setIsMounted(true);
    setLocalSearchQuery(searchParams.get("query") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!isMounted) return;

    const delayDebounceFn = setTimeout(() => {
      const currentUrlQuery = searchParams.get("query") || "";

      if (localSearchQuery !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearchQuery.trim()) {
          params.set("query", localSearchQuery.trim());
          params.set("page", "1");
        } else {
          params.delete("query");
          params.set("page", "1");
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [isMounted, localSearchQuery, pathname, router, searchParams]);

  return (
    <>
      <div className="min-h-screen my-12">
        <div
          dir="rtl"
          className="w-full max-w-7xl mx-auto overflow-hidden rounded bg-white text-12 sm:text-14 border border-gray-100 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* ... هدر جدول ... */}
            <div className="flex items-center gap-4">
              <h2 className="text-gray-800 font-bold">لیست کاربران</h2>
              {isMounted ? (
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-12 whitespace-nowrap">
                  تعداد کل: {totalUsersCount} نفر
                </span>
              ) : (
                <SkeletonWave className="h-8 w-32 rounded-full" />
              )}
            </div>

            {isMounted ? (
              <SearchBar
                value={localSearchQuery}
                onChange={setLocalSearchQuery}
                placeholder="جستجو (شماره، ایمیل، وضعیت)..."
                className="md:w-1/3"
              />
            ) : (
              <SkeletonWave className="h-10 w-full md:w-1/3 rounded-lg" />
            )}

            <button
              onClick={() => setIsModalAddUserOpen(true)}
              className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium whitespace-nowrap"
            >
              <Plus size={18} />
              افزودن کاربر جدید
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[1100px]">
              {/* ... Thead ... */}
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">ردیف</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">شماره موبایل</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">ایمیل</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">نقش</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">تاریخ ثبت نام</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-center">اشتراک‌ها</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-center">ویرایش</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-center">حذف</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {!isMounted ? (
                  <UserTableRowsSkeleton />
                ) : infoUsers.length > 0 ? (
                  infoUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {(startIndex + index + 1).toLocaleString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                        {user.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {user.email ?? <span className="text-gray-400">ثبت نشده</span>}
                      </td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md ${
                            user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "admin" ? "مدیر" : "کاربر"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {/* 🟢 تغییر دوم: به جای ثبت کل آبجکت کاربر، فقط ID آن را تنظیم می‌کنیم */}
                        <button
                          onClick={() => setSelectedUserIdForPlans(user.id)}
                          className="mx-auto text-amber-600 cursor-pointer inline-flex items-center gap-1 hover:text-amber-700 transition-colors bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded"
                          title="مشاهده اشتراک‌های کاربر"
                        >
                          <CreditCard size={16} />
                          اشتراک‌ها ({user.subscriptions?.length || 0})
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="mx-auto text-blue-500 cursor-pointer inline-flex items-center gap-1 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded"
                          title="ویرایش کاربر"
                        >
                          <Edit size={16} />
                          ویرایش
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <DeleteButton
                          id={user.id}
                          action={deleteUserAction}
                          itemName="این کاربر"
                          className="mx-auto p-1.5 text-red-600 cursor-pointer inline-flex items-center bg-red-50 gap-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                          حذف
                        </DeleteButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      هیچ کاربری یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isMounted ? (
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          ) : (
            <PaginationSkeleton />
          )}
        </div>

        <AddUserModal
          isOpen={isModalAddUserOpen}
          onClose={() => setIsModalAddUserOpen(false)}
        />

        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />

        {/* 🟢 تغییر سوم: مودال به جای خواندن مستقیم از استیت قدیمی، از متغیری که به‌روز می‌شود تغذیه می‌کند */}
        <UserSubscriptionsModal
          isOpen={!!selectedUserIdForPlans}
          userId={selectedUserForPlans?.id}
          subscriptions={selectedUserForPlans?.subscriptions || []}
          plans={plans}
          userName={
            selectedUserForPlans?.firstName && selectedUserForPlans?.lastName
              ? `${selectedUserForPlans.firstName} ${selectedUserForPlans.lastName}`
              : selectedUserForPlans?.phoneNumber
          }
          // با بسته شدن، ID را نال می‌کنیم
          onClose={() => setSelectedUserIdForPlans(null)}
        />
      </div>
    </>
  );
}