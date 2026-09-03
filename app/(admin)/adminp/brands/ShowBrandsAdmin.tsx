// app/admin/brands/BrandsAdminView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  createBrand, 
  updateBrand, 
  deleteBrand, 
  toggleBrandStatus, 
  toggleBrandsSectionSetting 
} from '@/actions/brands/Actions';
import UploadImage from '@/components/admin/uploadImage/UploadImage';
import { ImageIcon, LinkIcon, X } from 'lucide-react';

interface Brand {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Props {
  initial: {
    success: boolean;
    data: Brand[];
  };
  initialSectionVisible?: boolean;
}

export default function ShowBrandsAdmin({ initial, initialSectionVisible = true }: Props) {
  const router = useRouter();
  const brands = initial?.data || [];

  const [sectionVisible, setSectionVisible] = useState(initialSectionVisible);
  const [isTogglingSection, setIsTogglingSection] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);

  // استیت‌های اختصاصی مدال افزودن
  const [addImageUrl, setAddImageUrl] = useState('');
  const [addUploadKey, setAddUploadKey] = useState(0);

  // استیت‌های اختصاصی مدال ویرایش
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editUploadKey, setEditUploadKey] = useState(0);

  // هماهنگ‌سازی مقدار تصویر هنگام باز شدن مدال ویرایش
  useEffect(() => {
    if (editingBrand) {
      setEditImageUrl(editingBrand.imageUrl || '');
      setEditUploadKey((prev) => prev + 1);
    } else {
      setEditImageUrl('');
    }
  }, [editingBrand]);

  // ریست کردن فرم افزودن هنگام باز شدن
  const openAddModal = () => {
    setAddImageUrl('');
    setAddUploadKey((prev) => prev + 1);
    setIsAddOpen(true);
  };

  // سوئیچ کلی نمایش سکشن برندها
  const handleToggleGlobalSection = async () => {
    if (isTogglingSection) return;

    const previousState = sectionVisible;
    const nextState = !sectionVisible;

    setSectionVisible(nextState);
    setIsTogglingSection(true);

    await toast.promise(
      toggleBrandsSectionSetting(previousState).then(() => {
        router.refresh();
      }),
      {
        loading: 'در حال به‌روزرسانی وضعیت سکشن...',
        success: nextState 
          ? 'بخش برندها در سایت نمایش داده می‌شود' 
          : 'بخش برندها به طور کامل از سایت مخفی شد',
        error: () => {
          setSectionVisible(previousState);
          return 'خطا در ذخیره تنظیمات بخش برندها!';
        },
      }
    );

    setIsTogglingSection(false);
  };

  // افزودن برند جدید
  const handleCreateBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!addImageUrl.trim()) {
      toast.error('لطفاً تصویر برند را آپلود کرده یا لینک آن را وارد کنید');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('imageUrl', addImageUrl.trim());
    setLoading(true);

    await toast.promise(
      createBrand(formData).then(() => {
        setIsAddOpen(false);
        setAddImageUrl('');
        router.refresh();
      }),
      {
        loading: 'در حال ایجاد برند...',
        success: 'برند با موفقیت ایجاد شد',
        error: 'خطا در ثبت برند!',
      }
    );

    setLoading(false);
  };

  // ویرایش اطلاعات برند
  const handleUpdateBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !editingBrand) return;

    if (!editImageUrl.trim()) {
      toast.error('تصویر برند نمی‌تواند خالی باشد');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('imageUrl', editImageUrl.trim());
    setLoading(true);

    await toast.promise(
      updateBrand(editingBrand.id, formData).then(() => {
        setEditingBrand(null);
        router.refresh();
      }),
      {
        loading: 'در حال به‌روزرسانی برند...',
        success: 'اطلاعات برند با موفقیت ویرایش شد',
        error: 'خطا در ویرایش اطلاعات برند!',
      }
    );

    setLoading(false);
  };

  // تغییر وضعیت نمایش تک‌برند
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    await toast.promise(
      toggleBrandStatus(id, currentStatus).then(() => {
        router.refresh();
      }),
      {
        loading: 'در حال تغییر وضعیت...',
        success: currentStatus ? 'برند غیرفعال شد' : 'برند فعال شد',
        error: 'خطا در تغییر وضعیت برند!',
      }
    );
  };

  // حذف برند
  const handleConfirmDelete = async () => {
    if (loading || !deletingBrand) return;

    const brandTitle = deletingBrand.title;
    setLoading(true);

    await toast.promise(
      deleteBrand(deletingBrand.id).then(() => {
        setDeletingBrand(null);
        router.refresh();
      }),
      {
        loading: 'در حال حذف برند...',
        success: `برند «${brandTitle}» با موفقیت حذف شد`,
        error: 'خطا در حذف برند!',
      }
    );

    setLoading(false);
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت برندها</h1>
          <p className="text-xs text-gray-500 mt-1">مدیریت آیتم‌ها و تعیین وضعیت نمایش بخش برندها در سایت</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors shadow-sm"
        >
          + افزودن برند
        </button>
      </div>

      {/* بنر سوئیچ کنترل کلی سکشن */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full transition-colors ${sectionVisible ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <div>
            <h2 className="text-sm font-bold text-gray-800">وضعیت نمایش کل سکشن برندها در سایت</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {sectionVisible 
                ? 'بخش برندها در حال حاضر در صفحات کاربران فعال و قابل مشاهده است.' 
                : 'این بخش به طور کامل برای کاربران پنهان است (حتی برندهای فعال).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className={`text-xs font-semibold ${sectionVisible ? 'text-emerald-600' : 'text-gray-400'}`}>
            {sectionVisible ? 'سکشن فعال است' : 'سکشن مخفی است'}
          </span>
          <button
            type="button"
            disabled={isTogglingSection}
            onClick={handleToggleGlobalSection}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 ${
              sectionVisible ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                sectionVisible ? '-translate-x-5' : '-translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* جدول نمایش لیست برندها */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">تصویر</th>
              <th className="p-3 border-b">عنوان</th>
              <th className="p-3 border-b">وضعیت</th>
              <th className="p-3 border-b text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50 border-b">
                <td className="p-3 text-sm">{brand.id}</td>
                <td className="p-3">
                  <img
                    src={brand.imageUrl}
                    alt={brand.title}
                    className="w-12 h-12 object-contain border p-1 rounded bg-white"
                  />
                </td>
                <td className="p-3 font-medium text-sm">{brand.title}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      brand.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {brand.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      type="button"
                      onClick={() => setEditingBrand(brand)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      ویرایش
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(brand.id, brand.isActive)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                      تغییر وضعیت
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingBrand(brand)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  هیچ برندی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ۱. مدال افزودن برند */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={() => !loading && setIsAddOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors disabled:opacity-50"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-4 pb-2 border-b pl-8">افزودن برند جدید</h3>

            <form onSubmit={handleCreateBrand} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان برند <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  placeholder="مثال: نایکی"
                  required
                  className="w-full border p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* بخش آپلود و آدرس تصویر */}
              <div className="bg-gray-50/70 p-4 md:p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-gray-800">تصویر یا لوگوی برند</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <UploadImage 
                        key={`add-brand-${addUploadKey}`} 
                        onUploadSuccess={(url: string) => setAddImageUrl(url)} 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 font-medium mb-1 block">
                        یا لینک مستقیم تصویر را وارد کنید
                      </label>
                      <div className="relative">
                        <LinkIcon className="h-4 w-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        <input
                          type="url"
                          value={addImageUrl}
                          onChange={(e) => setAddImageUrl(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg bg-white text-xs outline-none focus:border-blue-500 text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* پیش‌نمایش */}
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-600 font-medium">پیش‌نمایش تصویر</span>
                    <div className="relative w-full h-44 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden group">
                      {addImageUrl ? (
                        <>
                          <img src={addImageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => {
                              setAddImageUrl('');
                              setAddUploadKey((prev) => prev + 1);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="حذف تصویر"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 flex flex-col items-center">
                          <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                          <span className="text-xs">تصویری انتخاب نشده است</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span>برند فعال باشد؟</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  تایید و ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۲. مدال ویرایش برند */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={() => !loading && setEditingBrand(null)}
          />
          <div className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              disabled={loading}
              onClick={() => setEditingBrand(null)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors disabled:opacity-50"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-4 pb-2 border-b pl-8">
              ویرایش برند ({editingBrand.title})
            </h3>

            <form onSubmit={handleUpdateBrand} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان برند <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBrand.title}
                  required
                  className="w-full border p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* بخش آپلود و آدرس تصویر ویرایش */}
              <div className="bg-gray-50/70 p-4 md:p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-gray-800">تغییر تصویر یا لوگوی برند</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <UploadImage 
                        key={`edit-brand-${editUploadKey}`} 
                        onUploadSuccess={(url: string) => setEditImageUrl(url)} 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 font-medium mb-1 block">
                        یا آدرس جدید تصویر را وارد کنید
                      </label>
                      <div className="relative">
                        <LinkIcon className="h-4 w-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        <input
                          type="url"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg bg-white text-xs outline-none focus:border-blue-500 text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* پیش‌نمایش */}
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-600 font-medium">پیش‌نمایش تصویر فعلی</span>
                    <div className="relative w-full h-44 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden group">
                      {editImageUrl ? (
                        <>
                          <img src={editImageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => {
                              setEditImageUrl('');
                              setEditUploadKey((prev) => prev + 1);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="حذف تصویر"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 flex flex-col items-center">
                          <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                          <span className="text-xs">تصویری انتخاب نشده است</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingBrand.isActive}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <span>برند فعال باشد؟</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setEditingBrand(null)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  تایید و ویرایش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۳. مدال تایید حذف */}
      {deletingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={() => !loading && setDeletingBrand(null)}
          />
          <div className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl z-10 text-center">
            {/* پیش‌نمایش تصویر برندی که قرار است حذف شود */}
            <div className="w-16 h-16 mx-auto mb-3 border rounded-xl p-1 bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img src={deletingBrand.imageUrl} alt={deletingBrand.title} className="w-full h-full object-contain" />
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">تایید حذف برند</h3>
            <p className="text-sm text-gray-500 mb-6">
              آیا از حذف برند <span className="font-semibold text-gray-800">«{deletingBrand.title}»</span> مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeletingBrand(null)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}