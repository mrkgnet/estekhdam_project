"use client";

import React, { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Edit, Trash2, Plus, X, PackagePlus } from 'lucide-react';
import { addUserAction } from '@/actions/admin/uesrs/addusers/Actions';
import toast from 'react-hot-toast';
import { editUserAction } from '@/actions/admin/uesrs/edituser/Actions';
import { deleteUserAction } from '@/actions/admin/uesrs/deleteuser/Actions';
import DeleteButton from '@/components/ui/DeleteButton';
import addProductToUser from '@/actions/admin/order/addProductFromPanel/Actions';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';

type Role = 'admin' | 'user';

type DataUsers = {
  id: string;
  phoneNumber: string;
  email: string | null;
  role: Role;
  createdAt: Date;
};

type DataProduct = {
  id: string,
  name: string
}

const ITEMS_PER_PAGE = 10;

export default function InfoUserData({ dataUsers, dataProducts }: { dataUsers: any, dataProducts: any }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  // 👇 گرفتن مقادیر جدیدی که از سرور فرستادیم
  const infoUsers: DataUsers[] = dataUsers?.data || [];
  const totalPages = dataUsers?.totalPages || 0;
  const totalUsersCount = dataUsers?.totalCount || 0;

  const productsList: DataProduct[] = Array.isArray(dataProducts) ? dataProducts : (dataProducts?.products || []);

  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DataUsers | null>(null);

  const [state, formAction, isPending] = useActionState(addUserAction, null);
  const [stateEdit, formEditAction, isPendingEdit] = useActionState(editUserAction, null);

  useEffect(() => {
    if (state?.success) {
      setIsModalAddUserOpen(false);
      toast.success(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (stateEdit?.success) {
      setEditingUser(null);
      toast.success(stateEdit.message);
    }
  }, [stateEdit]);

  const [addingProductUser, setAddingProductUser] = useState<DataUsers | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const [isPendingAssign, startTransition] = useTransition();

  const handleAssignProducts = () => {
    if (!addingProductUser?.id || selectedProductIds.length === 0) return;

    startTransition(async () => {
      const result = await addProductToUser(addingProductUser.id, selectedProductIds);

      if (result?.success) {
        toast.success(result.message);
        setAddingProductUser(null);
        setSelectedProductIds([]);
      } else {
        toast.error(result?.message || "خطایی رخ داد");
      }
    });
  };

  // 👇 مدیریت سرچ از طریق URL (Debounce ساده)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('query') || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // ۱. گرفتن مقدار فعلی جستجو در URL
      const currentUrlQuery = searchParams.get('query') || "";

      // ۲. ⚠️ شرط بسیار مهم: فقط اگر متن تایپ شده با متن داخل URL فرق داشت، URL را تغییر بده
      if (localSearchQuery !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearchQuery) {
          params.set('query', localSearchQuery);
          params.set('page', '1'); // با هر سرچ جدید برگردد صفحه اول
        } else {
          params.delete('query');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery, pathname, router, searchParams]);

  // محاسبه شماره ردیف شروع برای نمایش در جدول
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <>
      <div className='min-h-screen mt-6'>


        <div dir="rtl" className="w-full  text-xs  md:text-sm bg-white rounded max-w-6xl mx-auto border border-gray-100 shadow-sm overflow-hidden ">

          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-gray-800">لیست کاربران</h2>
              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                تعداد کل: {totalUsersCount} نفر
              </span>
            </div>

            <SearchBar
              value={localSearchQuery}
              onChange={setLocalSearchQuery}
              placeholder="جستجو (شماره، ایمیل، وضعیت)..."
              className="md:w-1/3"
            />

            <button
              onClick={() => setIsModalAddUserOpen(true)}
              className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium"
            >
              <Plus size={18} />
              افزودن کاربر جدید
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600">ردیف</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">شماره موبایل</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">ایمیل</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">نقش</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">تاریخ ثبت نام</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">مدیریت محصولات کاربر</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {infoUsers.length > 0 ? (
                  infoUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">
                        {(startIndex + index + 1).toLocaleString("fa-IR")}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-700">
                        {user.phoneNumber}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {user.email ? user.email : <span className="text-gray-400">ثبت نشده</span>}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        <span className={`px-2.5 py-1 rounded-md ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                          }`}>
                          {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        <button
                          onClick={() => {
                            setAddingProductUser(user);
                            setSelectedProductIds([]);
                          }}
                          className="flex items-center gap-1 text-green-600 cursor-pointer hover:text-green-800 transition-colors bg-green-50 px-3 py-2 rounded w-fit">
                          <PackagePlus size={16} />
                          افزودن محصول به کاربر
                        </button>
                      </td>

                      <td className="px-6 py-4 text-gray-500 flex items-center gap-3">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-500 cursor-pointer flex gap-1 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded">
                          <Edit size={16} />
                          ویرایش
                        </button>
                        <DeleteButton
                          id={user.id}
                          action={deleteUserAction}
                          itemName="این کاربر"
                          className="p-1.5 text-red-600 cursor-pointer flex bg-red-50 gap-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                          حذف
                        </DeleteButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      هیچ کاربری یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} />

        </div>

        {/* ============== مودال افزودن کاربر ============== */}
        {isModalAddUserOpen && (
          <div
            className="fixed inset-0 bg-black/5 flex justify-center items-center z-50"
            dir="rtl"
            onClick={() => setIsModalAddUserOpen(false)}
          >
            <div
              className="bg-white p-6 rounded w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2>افزودن کاربر جدید</h2>
                <button
                  type="button"
                  onClick={() => setIsModalAddUserOpen(false)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form action={formAction} className="flex flex-col gap-4">
                <label htmlFor="">شماره موبایل</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="09123456789"
                  className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
                  required
                />
                <label htmlFor="">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
                />
                <label htmlFor="">نقش</label>
                <select
                  name="role"
                  className="border p-2 rounded focus:outline-blue-500 cursor-pointer"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر سیستم</option>
                </select>

                {state?.success === false && (
                  <p className="text-red-500">{state.message || state.error}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalAddUserOpen(false)}
                    className="px-4 cursor-pointer py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============== مودال ویرایش کاربر ============== */}
        {editingUser && (
          <div
            className="fixed inset-0 bg-black/5 flex justify-center items-center z-50"
            dir="rtl"
            onClick={() => setEditingUser(null)}
          >
            <div
              className="bg-white p-6 rounded w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2>ویرایش کاربر</h2>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form action={formEditAction} className="flex flex-col gap-4">
                <input type="hidden" name='id' value={editingUser.id} />

                <label htmlFor="phoneNumber">شماره موبایل</label>
                <input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  defaultValue={editingUser.phoneNumber}
                  className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
                  required
                />

                <label htmlFor="email">ایمیل</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={editingUser.email || ''}
                  className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
                />

                <label htmlFor="role">نقش</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={editingUser.role}
                  className="border p-2 rounded focus:outline-blue-500 cursor-pointer"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر سیستم</option>
                </select>

                {stateEdit?.success === false && (
                  <p className="text-red-500">{stateEdit.message || stateEdit.error}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 cursor-pointer py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isPendingEdit}
                    className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isPendingEdit ? "در حال ذخیره..." : "ذخیره اطلاعات"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============== مودال تخصیص محصول ============== */}
        {addingProductUser && (
          <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setAddingProductUser(null)}
              className="absolute inset-0  backdrop-blur-sm"
            />

            <div
              className="relative w-full max-w-md bg-white rounded shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <div>
                  <h3 className="text-gray-800">تخصیص محصول</h3>
                  <p className="text-gray-500 mt-1">
                    کاربر: {addingProductUser.phoneNumber}
                  </p>
                </div>
                <button
                  onClick={() => setAddingProductUser(null)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                {productsList.length > 0 ? (
                  <div className="space-y-3">
                    {productsList.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                        <span className="text-gray-700 font-medium">
                          {product.name}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    هیچ محصولی در سیستم یافت نشد.
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={() => setAddingProductUser(null)}
                    className="flex-1 bg-white border border-gray-200 cursor-pointer hover:bg-gray-100 text-gray-700 py-3 rounded font-medium transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="button"
                    onClick={handleAssignProducts}
                    disabled={selectedProductIds.length === 0 || isPendingAssign}
                    className="flex-1 bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer hover:bg-green-700 text-white py-3 rounded font-medium transition-colors"
                  >
                    {isPendingAssign ? "در حال ثبت..." : `ثبت محصولات (${selectedProductIds.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
