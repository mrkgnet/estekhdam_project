import RichTextEditor from "@/components/editor/RichTextEditor";
import { Tag } from "lucide-react";

interface DescriptionSectionProps {
    description: string;
    onDescriptionChange: (description: string) => void;
}

export default function DescriptionSection({
    description,
    onDescriptionChange,
}: DescriptionSectionProps) {
    return (
        <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-500" />
                توضیحات محصول
            </label>

            <div className="border border-gray-200 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <RichTextEditor value={description} onChange={onDescriptionChange} />
            </div>
        </section>
    );
}
