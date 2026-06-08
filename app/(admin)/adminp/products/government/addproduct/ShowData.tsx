"use client";

import addProductAction from "@/actions/admin/products/government/addproduct/Actions";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { 
  ArrowLeft, UploadCloud, X, LayoutList, Tag, 
  DollarSign, ListChecks, Type, Link as LinkIcon, PackageOpen 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

// آدرس ایمپورت را بر اساس ساختار پوشه‌های خود تنظیم کنید

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

  // استیت‌های مقادیر فرم
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productType, setProductType] = useState<"MAIN" | "FREE_RESOURCE">("MAIN");
  
  // 🟢 استیت‌های جدید برای کنترل اصولی فیلدهای قیمت
  const [newPrice, setNewPrice] = useState<string | number>("");
  const [oldPrice, setOldPrice] = useState<string | number>("");

  const [selectedCategories, setSelectedCategories] = useState<{ id: string, name: string }[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  
  // استیت‌های مربوط به تصویر
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [externalImageUrl, setExternalImageUrl] = useState("");
  
  // استیت برای توضیحات ادیتور
  const [description, setDescription] = useState("");

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
        setNewPrice(""); // 🟢 ریست کردن قیمت جدید
        setOldPrice(""); // 🟢 ریست کردن قیمت قدیم
        clearImage();
        setDescription(""); 
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExternalImageUrl(""); 
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setExternalImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6 text-xs md:text-sm" dir="rtl">
      
      {/* هدر */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="tabsDataUserPanel text-gray-800 font-bold text-xl">افزودن محصول جدید</h1>
          <p className="text-gray-500 tabsDataUserPanel mt-2">اطلاعات محصول، قیمت و ویژگی‌های آن را وارد کنید</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm font-medium cursor-pointer"
        >
          <span>بازگشت</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form ref={formRef} action={formAction} className="space-y-8">
        
        {/* فیلدهای مخفی */}
        {selectedCategories.map((cat, index) => (
          <input key={`cat-${index}`} type="hidden" name="categories" value={cat.id} />
        ))}
        {features.map((feature, index) => (
          <input key={`feat-${index}`} type="hidden" name="features" value={feature} />
        ))}

        {/* 1. اطلاعات پایه و تصویر */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Type className="w-5 h-5" />
            </div>
            <h2 className="tabsDataUserPanel text-gray-800 font-bold">اطلاعات اصلی و تصویر</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700">نام محصول <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={productName}
                onChange={handleNameChange}
                required 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="مثال: بسته آموزشی آزمون استخدامی" 
              />
            </div>
            <div className="space-y-2">
               <label className="tabsDataUserPanel text-gray-700 flex justify-between">
                <span>اسلاگ (شناسه URL) <span className="text-red-500">*</span></span>
                <span className="text-xs text-gray-400 font-normal">تولید خودکار</span>
              </label>
              <input 
                type="text" 
                name="slug" 
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                required 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono tabsDataUserPanel" 
                dir="ltr" 
                placeholder="product-slug" 
              />
            </div>
          </div>

          {/* انتخاب نوع محصول و قیمت‌گذاری */}
          <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            {/* نوع محصول */}
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-blue-500"/> نوع محصول <span className="text-red-500">*</span>
              </label>
              <select 
                name="type" 
                value={productType}
                onChange={(e) => setProductType(e.target.value as "MAIN" | "FREE_RESOURCE")}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="MAIN">محصول اصلی / پولی</option>
                <option value="FREE_RESOURCE">منابع رایگان / دانلودی</option>
              </select>
            </div>

            {/* قیمت جدید */}
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500"/> قیمت فروش (تومان) <span className="text-red-500">*</span>
              </label>
              {/* 🟢 فیلد مدیریت شده با استیت */}
              <input 
                type="number" 
                name="newPrice" 
                required={productType === "MAIN"} 
                readOnly={productType === "FREE_RESOURCE"}
                value={productType === "FREE_RESOURCE" ? 0 : newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400" : "bg-gray-50/50"}`} 
                placeholder={productType === "FREE_RESOURCE" ? "رایگان" : "0"} 
              />
              {productType === "FREE_RESOURCE" && <p className="text-[10px] text-green-600 mt-1">منابع رایگان نیاز به قیمت‌گذاری ندارند.</p>}
            </div>

            {/* قیمت قبل */}
            <div className="space-y-2">
              <label className="tabsDataUserPanel text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400"/> قیمت قبل (تومان)
              </label>
              {/* 🟢 فیلد مدیریت شده با استیت */}
              <input 
                type="number" 
                name="oldPrice" 
                readOnly={productType === "FREE_RESOURCE"}
                value={productType === "FREE_RESOURCE" ? 0 : oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-400 ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400" : "bg-gray-50/50"}`} 
                placeholder="0" 
              />
            </div>
          </div>

          {/* بخش تصویر (آپلود یا لینک) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="tabsDataUserPanel text-gray-700">تصویر محصول (آپلود یا لینک) <span className="text-red-500">*</span></label>
            
            {/* فیلد لینک عکس */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="url" 
                name="externalImageUrl"
                value={externalImageUrl}
                onChange={handleExternalUrlChange}
                disabled={!!(previewImage && !externalImageUrl && fileInputRef.current?.value)}
                placeholder="لینک مستقیم تصویر را اینجا وارد کنید (مثال: https://site.com/img.jpg)"
                className="w-full pr-10 pl-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-left disabled:opacity-50 disabled:bg-gray-100"
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-center space-x-4 space-x-reverse text-gray-400 text-sm">
              <span className="h-[1px] w-full bg-gray-200"></span>
              <span>یا</span>
              <span className="h-[1px] w-full bg-gray-200"></span>
            </div>

            {/* آپلود فایل */}
            <div className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden group ${externalImageUrl ? 'border-gray-200 bg-gray-100 opacity-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'}`}>
              <input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!!externalImageUrl}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              
              {!previewImage ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500 group-hover:text-blue-500 transition-colors">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="tabsDataUserPanel font-medium text-gray-700">برای انتخاب عکس کلیک کنید یا عکس را اینجا رها کنید</p>
                  <p className="text-xs text-gray-400 mt-2">فرمت‌های مجاز: JPG, PNG, WEBP</p>
                </div>
              ) : (
                <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-xl shadow-sm backdrop-blur-sm transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
                    {externalImageUrl ? "تصویر از لینک" : "برای تغییر عکس کلیک کنید"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. دسته‌بندی و ویژگی‌ها */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <LayoutList className="w-5 h-5" />
              </div>
              <h2 className="tabsDataUserPanel text-gray-800 font-bold">دسته‌بندی‌های محصول</h2>
            </div>
            
            <div className="space-y-4">
              <select defaultValue="" onChange={handleSelectCategory} className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                <option value="" disabled>جستجو و انتخاب دسته‌بندی...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.catName}</option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                {selectedCategories.length === 0 ? (
                  <span className="tabsDataUserPanel text-gray-400 mt-2">هیچ دسته‌بندی انتخاب نشده است.</span>
                ) : (
                  selectedCategories.map((cat, index) => (
                    <span key={index} className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg tabsDataUserPanel animate-in fade-in zoom-in duration-200">
                      {cat.name}
                      <button type="button" onClick={() => removeCategory(cat.id)} className="text-purple-400 hover:text-red-500 bg-white rounded-full p-0.5 cursor-pointer">
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
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ListChecks className="w-5 h-5" />
              </div>
              <h2 className="tabsDataUserPanel text-gray-800 font-bold">ویژگی‌ها و امکانات</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-emerald-500 tabsDataUserPanel"
                  placeholder="مثال: دارای پاسخنامه (Enter بزنید)"
                />
                <button type="button" onClick={addFeature} className="bg-emerald-100 text-emerald-700 px-4 rounded-xl hover:bg-emerald-200 transition-colors font-medium cursor-pointer">
                  افزودن
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                {features.length === 0 ? (
                  <span className="tabsDataUserPanel text-gray-400 mt-2">ویژگی ثبت نشده است.</span>
                ) : (
                  features.map((f, index) => (
                    <div key={index} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg tabsDataUserPanel animate-in fade-in zoom-in duration-200">
                      <span>{f}</span>
                      <button type="button" onClick={() => removeFeature(index)} className="text-emerald-400 hover:text-red-500 bg-white rounded-full p-0.5 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 3. فیلد مخفی برای ارسال محتوای ادیتور */}
        <input type="hidden" name="description" value={description} />

        {/* 4. استفاده از کامپوننت ادیتور در بخش توضیحات */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <label className="tabsDataUserPanel text-gray-700 flex items-center gap-2 mb-2 font-bold">
            <Tag className="w-4 h-4 text-blue-500"/> توضیحات محصول
          </label>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <RichTextEditor 
              value={description} 
              onChange={setDescription} 
            />
          </div>
        </section>

        {/* نوار دکمه شناور در پایین */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-5xl flex justify-end gap-4 px-4 sm:px-6 lg:px-8">
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
              className="flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
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