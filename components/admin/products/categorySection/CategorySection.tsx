import { LayoutList, X } from "lucide-react";

interface Category {
    id: string;
    catName: string;
    catSlug: string;
}

interface CategorySectionProps {
    allCategories: Category[];
    selectedCategories: Category[];
    onCategoriesChange: (categories: Category[]) => void;
}

export default function CategorySection({
    allCategories,
    selectedCategories,
    onCategoriesChange,
}: CategorySectionProps) {
    const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        const categoryObj = allCategories.find((c) => c.id === selectedId);
        if (categoryObj && !selectedCategories.some((cat) => cat.id === selectedId)) {
            onCategoriesChange([...selectedCategories, categoryObj]);
        }

        e.target.value = "";
    };

    const removeCategory = (idToRemove: string) => {
        onCategoriesChange(selectedCategories.filter((cat) => cat.id !== idToRemove));
    };

    return (
        <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded">
                    <LayoutList className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">دسته‌بندی‌های محصول</h2>
            </div>

            <div className="space-y-4">
                <select
                    defaultValue=""
                    onChange={handleSelectCategory}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                    <option value="" disabled>
                        جستجو و انتخاب دسته‌بندی...
                    </option>
                    {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.catName}
                        </option>
                    ))}
                </select>

                <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                    {selectedCategories.map((cat) => (
                        <span
                            key={cat.id}
                            className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded text-sm"
                        >
                            {cat.catName}
                            <button
                                type="button"
                                onClick={() => removeCategory(cat.id)}
                                className="text-purple-400 hover:text-red-500 bg-white rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
