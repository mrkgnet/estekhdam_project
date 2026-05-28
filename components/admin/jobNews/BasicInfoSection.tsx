import { Info } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

interface Props {
    title: string;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    slugNews: string;
    setSlugNews: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
}

export default function BasicInfoSection({ title, handleTitleChange, slugNews, setSlugNews, description, setDescription }: Props) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Info className="w-5 h-5" />
                </div>
                <h2 className="text-slate-800">اطلاعات اصلی</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-slate-700">عنوان آزمون <span className="text-red-500">*</span></label>
                    <input name="title" value={title} onChange={handleTitleChange} required placeholder="مثال: آزمون استخدامی آموزش و پرورش" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>

                <div className="space-y-3">
                    <label className="text-slate-700">شناسه (Slug) <span className="text-red-500">*</span></label>
                    <input name="slugNews" value={slugNews} onChange={(e) => setSlugNews(e.target.value)} required dir="ltr" placeholder="اسلاگ خودکار تولید می شود" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left font-mono placeholder:text-slate-400 bg-slate-50" />
                </div>

                <div className="space-y-3">
                    <label className="text-slate-700">لینک ثبت نام <span className="text-red-500">*</span></label>
                    <input name="registerUrl" dir="ltr" type="url" required placeholder="https://..." className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left font-mono placeholder:text-slate-400" />
                </div>

                <div className="space-y-3">
                    <label className="text-slate-700">مجری آزمون</label>
                    <input name="organization" placeholder="مثال: جهاد دانشگاهی" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-slate-700">توضیحات تکمیلی</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <RichTextEditor value={description} onChange={setDescription} />
                </div>
            </div>
        </div>
    );
}
