'use client'
import React, { useState, useEffect, useActionState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { addCategoryChapter } from '@/actions/admin/category_chapter/add/Actions'
import { editCategoryChapter } from '@/actions/admin/category_chapter/edit/Actions'
import DeleteButton from '@/components/ui/DeleteButton'
import { deleteCategoryChapter } from '@/actions/admin/category_chapter/delete/Actions'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'در حال ارسال...' : isEdit ? 'بروزرسانی' : 'ذخیره'}
    </button>
  )
}

// تابع تبدیل نام به اسلاگ
function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\u0600-\u06FF_-]/g, '')
}

export default function ShowData({ initialCategories = [] }: { initialCategories?: Category[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  // State برای مدیریت اسلاگ در مودال افزودن
  const [addSlug, setAddSlug] = useState('')
  const [addName, setAddName] = useState('')

  // State برای مدیریت اسلاگ در مودال ویرایش
  const [editSlug, setEditSlug] = useState('')
  const [editName, setEditName] = useState('')

  const [addState, addFormAction] = useActionState(addCategoryChapter, null)
  const [editState, editFormAction] = useActionState(editCategoryChapter, null)

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  useEffect(() => {
    if (addState?.success) {
      setIsAddModalOpen(false)
      setAddName('')
      setAddSlug('')
    }
  }, [addState])

  useEffect(() => {
    if (editState?.success) {
      setIsEditModalOpen(false)
      setSelectedCategory(null)
      setEditName('')
      setEditSlug('')
    }
  }, [editState])

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setEditName(category.name)
    setEditSlug(category.slug)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCategory(null)
    setEditName('')
    setEditSlug('')
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setAddName('')
    setAddSlug('')
  }

  // تغییر نام در مودال افزودن
  const handleAddNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setAddName(newName)
    setAddSlug(generateSlug(newName))
  }

  // تغییر نام در مودال ویرایش
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setEditName(newName)
    setEditSlug(generateSlug(newName))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
            <p className="text-sm text-gray-600 mt-1">
              تعداد کل: {categories.length} دسته‌بندی
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            افزودن دسته جدید
          </button>
        </div>

        {/* پیام موفقیت/خطا برای افزودن */}
        {addState?.message && (
          <div
            className={`mb-4 p-4 rounded ${
              addState.success
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {addState.message}
          </div>
        )}

        {/* پیام موفقیت/خطا برای ویرایش */}
        {editState?.message && (
          <div
            className={`mb-4 p-4 rounded ${
              editState.success
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {editState.message}
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">شناسه</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">نام دسته</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اسلاگ</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">توضیحات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">وضعیت</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    هیچ دسته‌بندی وجود ندارد. برای شروع یک دسته جدید اضافه کنید.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{category.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="ویرایش"
                        >
                          <Edit2 size={18} />
                        </button>
                        <DeleteButton
                          id={category.id}
                          action={deleteCategoryChapter}
                          itemName={category.name}
                          className="inline-flex cursor-pointer text-red-500 items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          حذف
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <>
          <div
            onClick={handleCloseAddModal}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-xl w-full max-w-md z-[101]">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">افزودن دسته جدید</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form action={addFormAction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام دسته <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={addName}
                  onChange={handleAddNameChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="مثال: ICDL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسلاگ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="مثال: icdl"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اسلاگ به صورت خودکار از نام ساخته می‌شود، اما می‌توانید آن را ویرایش کنید
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="توضیحات اختیاری..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive-add"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive-add" className="text-sm text-gray-700 cursor-pointer">
                  فعال
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                >
                  انصراف
                </button>
                <SubmitButton isEdit={false} />
              </div>
            </form>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategory && (
        <>
          <div
            onClick={handleCloseEditModal}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-xl w-full max-w-md z-[101]">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">ویرایش دسته‌بندی</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form action={editFormAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={selectedCategory.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام دسته <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editName}
                  onChange={handleEditNameChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="مثال: ICDL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسلاگ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="مثال: icdl"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اسلاگ به صورت خودکار از نام ساخته می‌شود، اما می‌توانید آن را ویرایش کنید
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={selectedCategory.description || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="توضیحات اختیاری..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive-edit"
                  defaultChecked={selectedCategory.isActive}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive-edit" className="text-sm text-gray-700 cursor-pointer">
                  فعال
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                >
                  انصراف
                </button>
                <SubmitButton isEdit={true} />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
