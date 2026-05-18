import { Type, DollarSign } from "lucide-react";
import ImageUpload from "../imageUpload/ImageUpload";
import ActiveToggle from "../activeToggle/ActiveToggle";

interface BasicInfoSectionProps {
    productName: string;
    productSlug: string;
    oldPrice: number | null | undefined;
    newPrice: number;
    isActive: boolean;
    previewImage: string | null;
    externalImageUrl: string; // ✅ prop جدید
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSlugChange: (slug: string) => void;
    onActiveChange: (active: boolean) => void;
    onImageChange: (image: string | null) => void;
    onExternalImageUrlChange: (url: string) => void; // ✅ prop جدید
}

export default function BasicInfoSection({
    productName,
    productSlug,
    oldPrice,
    newPrice,
    isActive,
    previewImage,
    externalImageUrl,
    onNameChange,
    onSlugChange,
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

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        قیمت قبل (تومان)
                    </label>
                    <input
                        type="number"
                        name="oldPrice"
                        defaultValue={oldPrice || ""}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        قیمت جدید فروش (تومان) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="newPrice"
                        defaultValue={newPrice}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-green-500"
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
