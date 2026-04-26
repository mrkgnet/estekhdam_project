"use client";

import { useState, useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addChapterAction } from "@/actions/admin/chapter/addChapter/Actions";
import { editChapterAction } from "@/actions/admin/chapter/editChapter/Actions"; // اکشن ویرایش
import { deleteChapterSAction } from "@/actions/admin/chapter/deleteChapter/Actions";
import DeleteButton from "@/components/ui/DeleteButton";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  order: number | null;
  product?: { name: string }; // برای جلوگیری از خطای تایپ اسکریپت
}

interface Props {
  productId: string;
  chapters: Chapter[];
}

export default function ShowDataChapter({ productId, chapters }: Props) {

  // --- State ها و اکشن مربوط به افزودن ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addState, addFormAction, isAdding] = useActionState(addChapterAction, null);

  // --- State ها و اکشن مربوط به ویرایش ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);





  const [editState, editFormAction, isEditing] = useActionState(editChapterAction, null);

  const productName = chapters && chapters.length > 0
    ? chapters[0].product?.name
    : "از طریق گزینه افزودن اضافه کنید";

  // بستن مدال افزودن در صورت موفقیت
  useEffect(() => {
    if (addState?.success) {
      setIsAddModalOpen(false)
      toast.success(addState?.message)
    };
  }, [addState]);

  // بستن مدال ویرایش در صورت موفقیت
  useEffect(() => {
    if (editState?.success) {
      setIsEditModalOpen(false);
      toast.success(editState?.success)
      setEditingChapter(null);
    }
  }, [editState]);

  // تابع باز کردن مدال ویرایش
  const handleOpenEditModal = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-4  min-h-screen max-w-6xl mx-auto">



      <nav className="mb-6  text-gray-500">
        <ol className="list-none p-0 inline-flex items-center space-x-2 rtl:space-x-reverse">
          <li className="flex items-center">
            <Link href="/adminp" className="hover:text-blue-600">داشبورد</Link>
          </li>
          <li>/</li>
          <li className="flex items-center">
            <Link href="/adminp/products/government/editproduct" className="hover:text-blue-600">درس ها</Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-semibold">{productName}</li>
        </ol>
      </nav>



      {/* هدر */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          مدیریت سرفصل‌ها:
          <span className="px-2 text-red-600">{productName}</span>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          افزودن سرفصل جدید
        </button>
      </div>



      {/* --- جدول نمایش سرفصل‌ها --- */}
      {chapters.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-right text-sm font-semibold text-gray-600 w-32">شماره فصل</th>
                <th className="p-3 text-right text-sm font-semibold text-gray-600">عنوان سرفصل</th>
                <th className="p-3 text-right w-64 font-semibold text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map(chapter => (
                <tr key={chapter.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-700">{chapter.order}</td>
                  <td className="p-3 text-gray-800">{chapter.title}</td>
                  <td className="p-3 flex items-center gap-3">
                    {/* دکمه ویرایش */}
                    <button
                      onClick={() => handleOpenEditModal(chapter)}
                      className="p-1.5 text-blue-600 cursor-pointer flex bg-blue-50 gap-1 hover:bg-blue-100 rounded-lg transition-colors items-center text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      ویرایش
                    </button>

                    <span className="text-gray-300">|</span>

                    {/* دکمه حذف */}
                    <DeleteButton
                      id={chapter.id}
                      action={deleteChapterSAction}
                      itemName="این سرفصل"
                      className="p-1.5 text-red-600 cursor-pointer flex bg-red-50 gap-1 hover:bg-red-100 rounded-lg transition-colors items-center text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف سرفصل
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 bg-white p-10 rounded-lg shadow">
          هنوز هیچ سرفصلی برای این محصول ثبت نشده است.
        </div>
      )}



      {/* --- مدال افزودن سرفصل --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">افزودن سرفصل جدید</h2>
              <form action={addFormAction} className="flex flex-col gap-4">
                <input type="hidden" name="productId" value={productId} />
                <input
                  type="text"
                  name="title"
                  placeholder="عنوان سرفصل (مثال: مقدمات)"
                  className="border p-2 rounded focus:outline-blue-500"
                  required
                />
                <input
                  type="number"
                  name="order"
                  placeholder="شماره سرفصل (مثال: 1)"
                  className="border p-2 rounded focus:outline-blue-500"
                  required
                />
                {addState?.error && <p className="text-red-500 text-sm">{addState.error}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4  cursor-pointer py-2 bg-gray-200 rounded hover:bg-gray-300">انصراف</button>
                  <button type="submit" disabled={isAdding} className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                    {isAdding ? "در حال ثبت..." : "ثبت سرفصل"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>





      {/* --- مدال ویرایش سرفصل --- */}
      <AnimatePresence>
        {isEditModalOpen && editingChapter && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">ویرایش سرفصل</h2>
              <form action={editFormAction} className="flex flex-col gap-4">
                {/* ارسال آیدی سرفصل و محصول */}
                <input type="hidden" name="id" value={editingChapter.id} />
                <input type="hidden" name="productId" value={productId} />

                <input
                  type="text"
                  name="title"
                  defaultValue={editingChapter.title}
                  placeholder="عنوان سرفصل"
                  className="border p-2 rounded focus:outline-blue-500"
                  required
                />
                <input
                  type="number"
                  name="order"
                  defaultValue={editingChapter.order || ""}
                  placeholder="شماره سرفصل"
                  className="border p-2 rounded focus:outline-blue-500"
                  required
                />
                {editState?.error && <p className="text-red-500 text-sm">{editState.error}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 cursor-pointer py-2 bg-gray-200 rounded hover:bg-gray-300">انصراف</button>
                  <button type="submit" disabled={isEditing} className="px-4 py-2 bg-yellow-500 cursor-pointer text-white rounded hover:bg-yellow-600 disabled:opacity-50">
                    {isEditing ? "در حال بروزرسانی..." : "بروزرسانی سرفصل"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
