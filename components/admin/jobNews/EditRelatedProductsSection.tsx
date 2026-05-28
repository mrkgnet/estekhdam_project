import { Box, Plus } from "lucide-react";

interface Props {
  selectedCount: number;
  openModal: () => void;
}

export default function EditRelatedProductsSection({ selectedCount, openModal }: Props) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Box className="w-5 h-5" />
          </div>
          <h2 className="text-slate-800 font-medium">محصولات مرتبط</h2>
        </div>
        <p className="text-slate-500 mt-2">
          تعداد <span className="text-indigo-600 font-bold">{selectedCount}</span> محصول برای این آگهی انتخاب شده است.
        </p>
      </div>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors font-medium"
      >
        <Plus className="w-4 h-4" />
        انتخاب / ویرایش محصولات
      </button>
    </div>
  );
}
