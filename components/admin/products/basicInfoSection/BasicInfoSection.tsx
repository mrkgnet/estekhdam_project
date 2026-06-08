import { Type, DollarSign, PackageOpen } from "lucide-react";
import ImageUpload from "../imageUpload/ImageUpload";
import ActiveToggle from "../activeToggle/ActiveToggle";

interface BasicInfoSectionProps {
    productName: string;
    productSlug: string;
    productType: "MAIN" | "FREE_RESOURCE"; // 🟢 اضافه شدن پراپ نوع محصول
    oldPrice: string | number; // 🟢 تغییر به استیت کنترل شده
    newPrice: string | number; // 🟢 تغییر به استیت کنترل شده
    isActive: boolean;
    previewImage: string | null;
    externalImageUrl: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSlugChange: (slug: string) => void;
    onTypeChange: (type: "MAIN" | "FREE_RESOURCE") => void; // 🟢 اضافه شدن هندلر نوع محصول
    onNewPriceChange: (price: string) => void; // 🟢 اضافه شدن هندلر قیمت جدید
    onOldPriceChange: (price: string) => void; // 🟢 اضافه شدن هندلر قیمت قدیم
    onActiveChange: (active: boolean) => void;
    onImageChange: (image: string | null) => void;
    onExternalImageUrlChange: (url: string) => void;
}

export default function BasicInfoSection({
    productName,
    productSlug,
    productType,
    oldPrice,
    newPrice,
    isActive,
    previewImage,
    externalImageUrl,
    onNameChange,
    onSlugChange,
    onTypeChange,
    onNewPriceChange,
    onOldPriceChange,
    onActiveChange,
    onImageChange,
    onExternalImageUrlChange,
}: BasicInfoSectionProps) {
    return (
        <section className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                    <Type className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">اطلاعات اصلی و تصویر</h2>
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
                        className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        اسلاگ (شناسه URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        onChange={(e) => onSlugChange(e.target.value)}
                        name="slug"
                        value={productSlug}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono text-sm"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* 🟢 بخش جدید: انتخاب نوع محصول و قیمت‌گذاری (۳ ستونه) */}
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                {/* انتخاب نوع محصول */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <PackageOpen className="w-4 h-4 text-blue-500" /> نوع محصول <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="type"
                        value={productType}
                        onChange={(e) => onTypeChange(e.target.value as "MAIN" | "FREE_RESOURCE")}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="MAIN">محصول اصلی / پولی</option>
                        <option value="FREE_RESOURCE">منابع رایگان / دانلودی</option>
                    </select>
                </div>

                {/* قیمت جدید فروش */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        قیمت فروش (تومان) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="newPrice"
                        required={productType === "MAIN"}
                        readOnly={productType === "FREE_RESOURCE"}
                        value={productType === "FREE_RESOURCE" ? 0 : newPrice}
                        onChange={(e) => onNewPriceChange(e.target.value)}
                        className={`w-full px-4 py-3.5 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-green-500 ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400" : "bg-gray-50/50"}`}
                        placeholder={productType === "FREE_RESOURCE" ? "رایگان" : "0"}
                    />
                    {productType === "FREE_RESOURCE" && <p className="text-[10px] text-green-600 mt-1">منابع رایگان نیاز به قیمت‌گذاری ندارند.</p>}
                </div>

                {/* قیمت قبل */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        قیمت قبل (تومان)
                    </label>
                    <input
                        type="number"
                        name="oldPrice"
                        readOnly={productType === "FREE_RESOURCE"}
                        value={productType === "FREE_RESOURCE" ? 0 : oldPrice}
                        onChange={(e) => onOldPriceChange(e.target.value)}
                        className={`w-full px-4 py-3.5 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-gray-400 ${productType === "FREE_RESOURCE" ? "bg-gray-100 text-gray-400" : "bg-gray-50/50"}`}
                        placeholder="0"
                    />
                </div>
            </div>

            <ActiveToggle isActive={isActive} onChange={onActiveChange} />

            <ImageUpload
                previewImage={previewImage}
                externalImageUrl={externalImageUrl}
                onImageChange={onImageChange}
                onExternalImageUrlChange={onExternalImageUrlChange}
            />
        </section>
    );
}