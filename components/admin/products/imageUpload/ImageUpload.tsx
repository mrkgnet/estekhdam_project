import { UploadCloud, X, Link2 } from "lucide-react";
import { useRef, useEffect } from "react";

interface ImageUploadProps {
    previewImage: string | null;
    externalImageUrl: string;
    onImageChange: (image: string | null) => void;
    onExternalImageUrlChange: (url: string) => void;
}

export default function ImageUpload({ 
    previewImage, 
    externalImageUrl,
    onImageChange,
    onExternalImageUrlChange 
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ✅ وقتی لینک خارجی وارد شد، پیش‌نمایش رو به‌روز کن
    useEffect(() => {
        if (externalImageUrl.trim()) {
            onImageChange(externalImageUrl);
        }
    }, [externalImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(URL.createObjectURL(file));
            onExternalImageUrlChange(""); // ✅ اگر فایل انتخاب شد، لینک خارجی رو پاک کن
        }
    };

    const clearImage = () => {
        onImageChange(null);
        onExternalImageUrlChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        onExternalImageUrlChange(url);
        
        // ✅ اگر لینک وارد شد، فایل آپلود رو پاک کن
        if (url.trim() && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="text-sm font-semibold text-gray-700">تصویر محصول</label>
            
            {/* ✅ فیلد لینک خارجی */}
            <div className="space-y-2">
                <label className="text-xs text-gray-600 flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5" />
                    لینک تصویر (اختیاری)
                </label>
                <input
                    type="url"
                    value={externalImageUrl}
                    onChange={handleExternalUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    dir="ltr"
                />
            </div>

            {/* ✅ یا آپلود فایل */}
            <div className="relative">
                <p className="text-xs text-gray-500 text-center mb-2">یا فایل تصویر را آپلود کنید</p>
                <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/50 rounded transition-all overflow-hidden group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        required={!previewImage && !externalImageUrl}
                        name="imageFile"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {!previewImage ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded flex items-center justify-center mb-4 text-gray-500 group-hover:text-blue-500 transition-colors">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                برای انتخاب عکس کلیک کنید یا عکس را اینجا رها کنید
                            </p>
                        </div>
                    ) : (
                        <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
                            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded shadow-sm backdrop-blur-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
