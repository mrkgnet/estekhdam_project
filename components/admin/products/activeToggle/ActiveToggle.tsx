import { Power } from "lucide-react";

interface ActiveToggleProps {
    isActive: boolean;
    onChange: (active: boolean) => void;
}

export default function ActiveToggle({ isActive, onChange }: ActiveToggleProps) {
    return (
        <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Power className={`w-4 h-4 ${isActive ? "text-green-600" : "text-red-500"}`} />
                    <div>
                        <p className="text-sm font-semibold text-gray-700">وضعیت محصول</p>
                        <p className="text-xs text-gray-500">
                            {isActive ? "محصول فعال است و در سایت نمایش داده می‌شود" : "محصول غیرفعال است"}
                        </p>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-6 h-6 rounded-md border-2 border-gray-300 bg-white transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-green-400 peer-checked:to-green-500 peer-checked:border-green-500 peer-focus:ring-2 peer-focus:ring-green-400 peer-focus:ring-offset-2 shadow-sm hover:shadow-md">
                        <svg
                            className={`absolute inset-0 w-full h-full p-1 text-white transition-all duration-300 ${
                                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {isActive ? 'محصول فعال است' : 'محصول غیرفعال است'}
                    </span>
                </label>
            </div>
        </div>
    );
}
