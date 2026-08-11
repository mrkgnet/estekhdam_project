import { Info } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

interface Props {
  title: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slugNews: string;
  setSlugNews: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  product: any;
}

export default function EditBasicInfoSection({ title, handleTitleChange, slugNews, setSlugNews, description, setDescription, product }: Props) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-400 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-300">
        <div className="p-2 bg-blue-50 text-blue-600 rounded">
          <Info className="w-5 h-5" />
        </div>
        <h2 className="text-slate-800 font-medium">اطلاعات اصلی</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-slate-700">عنوان آزمون <span className="text-red-500">*</span></label>
          <input name="title" value={title} onChange={handleTitleChange} required className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>

        <div className="space-y-2">
          <label className="text-slate-700">شناسه (Slug) <span className="text-red-500">*</span></label>
          <input name="slugNews" value={slugNews} onChange={(e) => setSlugNews(e.target.value)} required dir="ltr" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left font-mono bg-slate-50" />
        </div>

        <div className="space-y-2">
          <label className="text-slate-700">لینک ثبت نام <span className="text-red-500">*</span></label>
          <input name="registerUrl" required defaultValue={product.registerUrl} dir="ltr" type="url" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left font-mono" />
        </div>

        <div className="space-y-2">
          <label className="text-slate-700">مجری آزمون</label>
          <input name="organization" defaultValue={product.organization} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="border border-slate-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
      </div>
    </div>
  );
}