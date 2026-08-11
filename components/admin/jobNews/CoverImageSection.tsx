import { ImageIcon, LinkIcon, UploadCloud, X } from "lucide-react";
import { RefObject } from "react";

interface Props {
    externalImageUrl: string;
    handleExternalUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: RefObject<HTMLInputElement>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    previewImage: string | null;
    removeImage: (e: React.MouseEvent) => void;
}

export default function CoverImageSection({ externalImageUrl, handleExternalUrlChange, fileInputRef, handleImageChange, previewImage, removeImage }: Props) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-400">
                <div className="p-2 bg-purple-50 text-purple-600 rounded">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-slate-800">تصویر کاور آگهی <span className="text-red-500">*</span></h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full space-y-6 flex-1">
                    <div className="space-y-3">
                        <label className="text-slate-700 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-slate-500" />
                            لینک مستقیم تصویر (اولویت اول)
                        </label>
                        <input
                            type="url"
                            name="externalImageUrl"
                            value={externalImageUrl}
                            onChange={handleExternalUrlChange}
                            disabled={!!(fileInputRef.current?.files?.length)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-slate-400 rounded p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-slate-100 disabled:opacity-50 text-left dir-ltr"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full">
                        <div className="h-px bg-slate-400 flex-1"></div>
                        <span className="text-slate-500 text-xs">یا</span>
                        <div className="h-px bg-slate-400 flex-1"></div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-slate-700 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-slate-500" />
                            آپلود فایل تصویر
                        </label>
                        <input
                            type="file"
                            name="imageFile"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            disabled={!!externalImageUrl}
                            accept="image/*"
                            className="w-full border border-slate-400 rounded p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
                    <span className="text-slate-700 w-full text-right">پیش‌نمایش:</span>
                    {previewImage ? (
                        <div className="relative w-full aspect-video rounded overflow-hidden border border-slate-400 shadow-sm group">
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full aspect-video rounded border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">عکسی انتخاب نشده</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
