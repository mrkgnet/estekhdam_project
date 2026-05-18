import { ListChecks, X } from "lucide-react";
import { useState } from "react";

interface FeaturesSectionProps {
    features: string[];
    onFeaturesChange: (features: string[]) => void;
}

export default function FeaturesSection({ features, onFeaturesChange }: FeaturesSectionProps) {
    const [featureInput, setFeatureInput] = useState("");

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (trimmed && !features.includes(trimmed)) {
            onFeaturesChange([...features, trimmed]);
            setFeatureInput("");
        }
    };

    const removeFeature = (indexToRemove: number) => {
        onFeaturesChange(features.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addFeature();
        }
    };

    return (
        <section className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                    <ListChecks className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">ویژگی‌ها و امکانات</h2>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-3.5 border border-gray-200 rounded bg-gray-50/50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="مثال: دارای پاسخنامه تشریحی"
                    />
                    <button
                        type="button"
                        onClick={addFeature}
                        className="bg-emerald-100 text-emerald-700 px-4 rounded hover:bg-emerald-200 transition-colors font-medium"
                    >
                        افزودن
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] items-start">
                    {features.map((f, index) => (
                        <div
                            key={`${f}-${index}`}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded text-sm"
                        >
                            <span>{f}</span>
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-emerald-400 hover:text-red-500 bg-white rounded p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
