interface FormActionsProps {
    isPending: boolean;
    onCancel: () => void;
}

export default function FormActions({ isPending, onCancel }: FormActionsProps) {
    return (
        <div className="left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-50">
            <div className="w-full max-w-5xl flex justify-end gap-4 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
                >
                    انصراف
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                >
                    {isPending ? "در حال ذخیره..." : "ثبت تغییرات"}
                </button>
            </div>
        </div>
    );
}
