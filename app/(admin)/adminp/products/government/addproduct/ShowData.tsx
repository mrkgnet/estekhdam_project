"use client";

import addProductAction from "@/actions/admin/products/government/addproduct/Actions";
import UploadImage from "@/components/admin/uploadImage/UploadImage";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { 
  ArrowLeft, UploadCloud, X, LayoutList, Tag, 
  DollarSign, ListChecks, Type, Link as LinkIcon, PackageOpen, Download, Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

type Category = {
  id: string;
  catId: number;
  catName: string;
  catSlug: string;
}

const initialState = { success: false, message: "", data: null };

export default function CreateProductPage({ dataCategory }: { dataCategory: any }) {
  const categories: Category[] = Array.isArray(dataCategory) ? dataCategory : (dataCategory?.data || []);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(addProductAction, initialState);

  // States
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productType, setProductType] = useState<"MAIN" | "FREE_RESOURCE">("MAIN");
  const [newPrice, setNewPrice] = useState<string>("");
  const [oldPrice, setOldPrice] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState(""); 
  const [selectedCategories, setSelectedCategories] = useState<{ id: string, name: string }[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [description, setDescription] = useState("");
  
  // رفع خطا: اضافه کردن State برای ریست کردن آپلودر بعد از ثبت محصول
  const [uploadResetKey, setUploadResetKey] = useState(0);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
        setSelectedCategories([]);
        setFeatures([]);
        setProductName("");
        setProductSlug("");
        setProductType("MAIN");
        setNewPrice("");
        setOldPrice("");
        setDownloadUrl("");
        clearImage();
        setDescription(""); 
        setUploadResetKey(prev => prev + 1); // تغییر کلید برای ریست شدن کامپوننت آپلودر
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProductName(val);
    setProductSlug(val.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setExternalImageUrl(val);
    if (val) {
      setPreviewImage(val);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setPreviewImage(null);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setExternalImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // رفع خطا: اضافه کردن تابع دریافت لینک موفقیت آمیز از کامپوننت آپلود
  const handleUploadSuccess = (url: string) => {
    if(url) {
      setExternalImageUrl(url);
      setPreviewImage(url);
    } else {
      clearImage(); // در صورتی که کاربر دکمه پاک کردن را در آپلودر زد
    }
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === "") return;
    const selectedCatObject = categories.find(c => c.id === selectedId);
    if (selectedCatObject && !selectedCategories.some(cat => cat.id === selectedId)) {
      setSelectedCategories((prev) => [...prev, { id: selectedId, name: selectedCatObject.catName }]);
    }
    e.target.value = "";
  };

  const removeCategory = (catToRemove: string) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat.id !== catToRemove));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
      setFeatureInput(""); 
    }
  };

  const removeFeature = (indexToRemove: number) => {
    setFeatures(features.filter((_, index) => index !== indexToRemove));
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  // هندل کردن قیمت و فیلتر کردن کاراکترهای غیر عددی
  const handleNewPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // حذف همه کاراکترهای غیر عددی
    setNewPrice(numericValue);
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setOldPrice(numericValue);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6 text-sm" dir="rtl">
      
      {/* هدر صفحه */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="tabsDataUserPanel text-gray-800 font-bold text-2xl">افزودن محصول جدید</h1>
          <p className="text-gray-500 tabsDataUserPanel mt-1.5 text-sm">اطلاعات محصول، قیمت و ویژگی‌های آن را وارد کنید</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm font-medium cursor-pointer"
        >
          <span>بازگشت</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form ref={formRef} action={formAction} className="space-y-6">
        {selectedCategories.map((cat, index) => (
          <input key={`cat-${index}`} type="hidden" name="categories" value={cat.id} />
        ))}
        {features.map((feature, index) => (
          <input key={`feat-${index}`} type="hidden" name="features" value={feature} />
        ))}

        {/* 1. اطلاعات پایه */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <h2 className="tabsDataUserPanel text-gray-800 font-bold text-lg">اطلاعات اصلی</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium">نام محصول <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={productName}
                onChange={handleNameChange}
                required 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                placeholder="مثال: بسته آموزشی آزمون استخدامی" 
              />
            </div>
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium flex justify-between">
                <span>اسلاگ (شناسه URL) <span className="text-red-500">*</span></span>
                <span className="text-xs text-gray-400 font-normal">تولید خودکار</span>
              </label>
              <input 
                type="text" 
                name="slug" 
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                required 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono tabsDataUserPanel" 
                dir="ltr" 
                placeholder="product-slug" 
              />
            </div>
          </div>

          {/* نوع محصول و قیمت‌گذاری */}
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-blue-500"/> نوع محصول <span className="text-red-500">*</span>
              </label>
              <select 
                name="type" 
                value={productType}
                onChange={(e) => setProductType(e.target.value as "MAIN" | "FREE_RESOURCE")}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="MAIN">محصول اصلی / پولی</option>
                <option value="FREE_RESOURCE">منابع رایگان / دانلودی</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500"/> قیمت فروش (تومان) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                required={productType === "MAIN"} 
                readOnly={productType === "FREE_RESOURCE"}
                value={productType === "FREE_RESOURCE" ? "0" : newPrice ? Number(newPrice).toLocaleString() : ""}
                onChange={handleNewPriceChange}
                className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none transition-all text-left font-mono ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500"}`}
                placeholder={productType === "FREE_RESOURCE" ? "رایگان" : "0"} 
                dir="ltr"
              />
              {/* ارسال مقدار واقعی به سرور */}
              <input type="hidden" name="newPrice" value={productType === "FREE_RESOURCE" ? "0" : newPrice} />
              {productType === "FREE_RESOURCE" && <p className="text-[11px] text-green-600 mt-1">منابع رایگان نیاز به قیمت‌گذاری ندارند.</p>}
            </div>

            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400"/> قیمت قبل (تومان)
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                readOnly={productType === "FREE_RESOURCE"}
                value={productType === "FREE_RESOURCE" ? "0" : oldPrice ? Number(oldPrice).toLocaleString() : ""}
                onChange={handleOldPriceChange}
                className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none transition-all text-left font-mono ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"}`} 
                placeholder="0" 
                dir="ltr"
              />
              {/* ارسال مقدار واقعی به سرور */}
              <input type="hidden" name="oldPrice" value={productType === "FREE_RESOURCE" ? "0" : oldPrice} />
            </div>
          </div>

          {/* آدرس دانلود - فقط برای FREE_RESOURCE */}
          {productType === "FREE_RESOURCE" && (
            <div className="space-y-2 pt-4 border-t border-gray-100 animate-in fade-in zoom-in duration-300">
              <label className="tabsDataUserPanel text-gray-700 font-medium flex items-center gap-2">
                <Download className="w-4 h-4 text-orange-500"/> آدرس فایل دانلودی <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-orange-400" />
                </div>
                <input
                  type="url"
                  name="downloadUrl"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  required
                  placeholder="https://example.com/file.pdf"
                  className="w-full pr-11 pl-4 py-3.5 border border-orange-200 rounded-xl bg-orange-50/30 outline-none focus:bg-orange-50 focus:ring-2 focus:ring-orange-400/50 transition-all text-left"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-gray-400">آدرس مستقیم فایل دانلودی را وارد کنید (PDF، ZIP و ...)</p>
            </div>
          )}
        </section>

        {/* 2. تصویر محصول */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="tabsDataUserPanel text-gray-800 font-bold text-lg">تصویر محصول</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <UploadImage key={`main-${uploadResetKey}`} onUploadSuccess={handleUploadSuccess} />
              </div>
              
              <div className="space-y-2">
                <label className="tabsDataUserPanel text-gray-700 font-medium block">
                  یا لینک مستقیم تصویر را وارد کنید <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="externalImageUrl"
                    required
                    value={externalImageUrl}
                    onChange={handleExternalUrlChange}
                    placeholder="https://example.com/main-image.jpg"
                    className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* بخش پیش‌نمایش تصویر */}
            <div className="flex flex-col space-y-2">
              <label className="tabsDataUserPanel text-gray-700 font-medium">پیش‌نمایش تصویر</label>
              <div className="relative w-full h-full min-h-[220px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group transition-all">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded-xl shadow-sm backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="حذف تصویر"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-400 flex flex-col items-center">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-sm">تصویری انتخاب نشده است</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. دسته‌بندی و ویژگی‌ها */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <LayoutList className="w-5 h-5" />
              </div>
              <h2 className="tabsDataUserPanel text-gray-800 font-bold text-lg">دسته‌بندی‌های محصول</h2>
            </div>
            
            <div className="space-y-4">
              <select defaultValue="" onChange={handleSelectCategory} className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer">
                <option value="" disabled>جستجو و انتخاب دسته‌بندی...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.catName}</option>
                ))}
              </select>
              
              <div className="flex flex-wrap gap-2 min-h-[44px] items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                {selectedCategories.length === 0 ? (
                  <span className="tabsDataUserPanel text-gray-400 text-sm m-auto">هیچ دسته‌بندی انتخاب نشده است.</span>
                ) : (
                  selectedCategories.map((cat, index) => (
                    <span key={index} className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg tabsDataUserPanel text-sm animate-in fade-in zoom-in duration-200">
                      {cat.name}
                      <button type="button" onClick={() => removeCategory(cat.id)} className="text-purple-400 hover:text-red-500 hover:bg-white rounded-md p-0.5 transition-colors cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ListChecks className="w-5 h-5" />
              </div>
              <h2 className="tabsDataUserPanel text-gray-800 font-bold text-lg">ویژگی‌ها و امکانات</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all tabsDataUserPanel"
                  placeholder="مثال: دارای پاسخنامه (سپس Enter بزنید)"
                />
                <button type="button" onClick={addFeature} className="bg-emerald-100 text-emerald-700 px-5 rounded-xl hover:bg-emerald-200 transition-colors font-medium cursor-pointer">
                  افزودن
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[44px] items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                {features.length === 0 ? (
                  <span className="tabsDataUserPanel text-gray-400 text-sm m-auto">ویژگی ثبت نشده است.</span>
                ) : (
                  features.map((f, index) => (
                    <div key={index} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg tabsDataUserPanel text-sm animate-in fade-in zoom-in duration-200">
                      <span>{f}</span>
                      <button type="button" onClick={() => removeFeature(index)} className="text-emerald-400 hover:text-red-500 hover:bg-white rounded-md p-0.5 transition-colors cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 4. توضیحات کامل */}
        <input type="hidden" name="description" value={description} />
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <label className="tabsDataUserPanel text-gray-800 flex items-center gap-2 mb-2 font-bold text-lg">
            <Tag className="w-5 h-5 text-blue-500"/> توضیحات کامل محصول
          </label>
          <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </section>

        {/* نوار دکمه شناور */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-5xl flex justify-end gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  در حال ذخیره...
                </span>
              ) : (
                <span>ذخیره محصول جدید</span>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}