import { Type, DollarSign, PackageOpen, Download, Link as LinkIcon, Image as ImageIcon, X } from "lucide-react";
import UploadImage from "../../uploadImage/UploadImage"; 
import ActiveToggle from "../activeToggle/ActiveToggle";

interface BasicInfoSectionProps {
  productName: string;
  productSlug: string;
  productType: "MAIN" | "FREE_RESOURCE";
  oldPrice: string | number;
  newPrice: string | number;
  downloadUrl: string;
  isActive: boolean;
  previewImage: string | null;
  externalImageUrl: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (slug: string) => void;
  onTypeChange: (type: "MAIN" | "FREE_RESOURCE") => void;
  onNewPriceChange: (price: string) => void;
  onOldPriceChange: (price: string) => void;
  onDownloadUrlChange: (url: string) => void;
  onActiveChange: (active: boolean) => void;
  onImageChange: (image: string | null) => void;
  onExternalImageUrlChange: (url: string) => void;
  onUploadSuccess: (url: string) => void; 
}

export default function BasicInfoSection({
  productName,
  productSlug,
  productType,
  oldPrice,
  newPrice,
  downloadUrl,
  isActive,
  previewImage,
  externalImageUrl,
  onNameChange,
  onSlugChange,
  onTypeChange,
  onNewPriceChange,
  onOldPriceChange,
  onDownloadUrlChange,
  onActiveChange,
  onImageChange,
  onExternalImageUrlChange,
  onUploadSuccess,
}: BasicInfoSectionProps) {

  const clearImage = () => {
    onImageChange(null);
    onExternalImageUrlChange("");
  };

  const formatPrice = (value: string | number) => {
    if (!value) return "";
    const numericValue = value.toString().replace(/\D/g, ""); 
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("en-US"); 
  };

  return (
    <>
      {/* ===================== سکشن: اطلاعات اصلی ===================== */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Type className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">اطلاعات اصلی</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              نام محصول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={onNameChange}
              name="name"
              value={productName}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="مثال: بسته آموزشی آزمون استخدامی"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex justify-between">
              <span>اسلاگ (شناسه URL) <span className="text-red-500">*</span></span>
              <span className="text-xs text-gray-400 font-normal">تولید خودکار</span>
            </label>
            <input
              type="text"
              onChange={(e) => onSlugChange(e.target.value)}
              name="slug"
              value={productSlug}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono text-sm"
              dir="ltr"
              placeholder="product-slug"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <PackageOpen className="w-4 h-4 text-blue-500" /> نوع محصول <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={productType}
              onChange={(e) => onTypeChange(e.target.value as "MAIN" | "FREE_RESOURCE")}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="MAIN">محصول اصلی / پولی</option>
              <option value="FREE_RESOURCE">منابع رایگان / دانلودی</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              قیمت فروش (تومان) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              required={productType === "MAIN"}
              readOnly={productType === "FREE_RESOURCE"}
              value={productType === "FREE_RESOURCE" ? "0" : formatPrice(newPrice)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                onNewPriceChange(rawValue);
              }}
              className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none transition-all text-left font-mono ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500"}`}
              placeholder={productType === "FREE_RESOURCE" ? "رایگان" : "0"}
              dir="ltr"
            />
            {productType === "FREE_RESOURCE" && (
              <p className="text-[11px] text-green-600 mt-1">منابع رایگان نیاز به قیمت‌گذاری ندارند.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              قیمت قبل (تومان)
            </label>
            <input
              type="text"
              inputMode="numeric"
              readOnly={productType === "FREE_RESOURCE"}
              value={productType === "FREE_RESOURCE" ? "0" : formatPrice(oldPrice)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                onOldPriceChange(rawValue);
              }}
              className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none transition-all text-left font-mono ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"}`}
              placeholder="0"
              dir="ltr"
            />
          </div>
        </div>

        {productType === "FREE_RESOURCE" && (
          <div className="space-y-2 pt-4 border-t border-gray-100 animate-in fade-in zoom-in duration-300">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-500" />
              آدرس فایل دانلودی <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-orange-400" />
              </div>
              <input
                type="url"
                name="downloadUrl"
                value={downloadUrl}
                onChange={(e) => onDownloadUrlChange(e.target.value)}
                required
                placeholder="https://example.com/file.pdf"
                className="w-full pr-11 pl-4 py-3.5 border border-orange-200 rounded-xl bg-orange-50/30 outline-none focus:bg-orange-50 focus:ring-2 focus:ring-orange-400/50 transition-all text-left"
                dir="ltr"
              />
            </div>
            <p className="text-[11px] text-gray-400">آدرس مستقیم فایل دانلودی را وارد کنید (PDF، ZIP و ...)</p>
          </div>
        )}

        {/* تاگل وضعیت محصول */}
        <ActiveToggle isActive={isActive} onChange={onActiveChange} />
      </section>

      {/* ===================== سکشن: تصویر محصول ===================== */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">تصویر محصول</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <UploadImage onUploadSuccess={onUploadSuccess} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                یا لینک مستقیم تصویر را وارد کنید <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="url"
                  required
                  value={externalImageUrl}
                  onChange={(e) => onExternalImageUrlChange(e.target.value)}
                  placeholder="https://example.com/main-image.jpg"
                  className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* بخش پیش‌نمایش تصویر */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">پیش‌نمایش تصویر</label>
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
    </>
  );
}