"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Edit, Trash2, Plus, PackagePlus } from 'lucide-react';
import { deleteUserAction } from '@/actions/admin/uesrs/deleteuser/Actions';
import DeleteButton from '@/components/ui/DeleteButton';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import AddUserModal from '@/components/modals/AddUserModal';
import EditUserModal from '@/components/modals/EditUserModal';
import AssignProductModal from '@/components/modals/AssignProductModal';

// ایمپورت مدال های جدید


type Role = 'admin' | 'user';

type DataUsers = {
  id: string;
  phoneNumber: string;
  email: string | null;
  role: Role;
  createdAt: Date;
};

type DataProduct = {
  id: string;
  name: string;
}

const ITEMS_PER_PAGE = 10;

export default function InfoUserData({ dataUsers, dataProducts }: { dataUsers: any, dataProducts: any }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const infoUsers: DataUsers[] = dataUsers?.data || [];
  const totalPages = dataUsers?.totalPages || 0;
  const totalUsersCount = dataUsers?.totalCount || 0;

  const productsList: DataProduct[] = Array.isArray(dataProducts) ? dataProducts : (dataProducts?.products || []);

  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DataUsers | null>(null);
  const [addingProductUser, setAddingProductUser] = useState<DataUsers | null>(null);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('query') || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentUrlQuery = searchParams.get('query') || "";

      if (localSearchQuery !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearchQuery) {
          params.set('query', localSearchQuery);
          params.set('page', '1'); 
        } else {
          params.delete('query');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery, pathname, router, searchParams]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <>
      <div className='min-h-screen my-12'>
        <div dir="rtl" className="w-full text-12 sm:text-14  bg-white rounded max-w-6xl mx-auto border border-gray-100 shadow-sm overflow-hidden">
          
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
                  <th className="px-6 py-4 font-semibold text-gray-600">مدیریت پلن‌های کاربر</th>
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
                          onClick={() => setAddingProductUser(user)}
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

        {/* مدال‌ها */}
        <AddUserModal 
          isOpen={isModalAddUserOpen} 
          onClose={() => setIsModalAddUserOpen(false)} 
        />

        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
        />

        <AssignProductModal 
          user={addingProductUser} 
          productsList={productsList} 
          onClose={() => setAddingProductUser(null)} 
        />
        
      </div>
    </>
  );
}
