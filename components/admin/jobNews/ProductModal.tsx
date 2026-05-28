import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ProductType {
    id: string;
    name?: string;
    title?: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: ProductType[];
    selectedIds: string[];
    toggleSelection: (id: string) => void;
}

export default function ProductModal({ isOpen, onClose, products, selectedIds, toggleSelection }: ProductModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <div>
                                <h3 className="text-gray-800 font-bold">انتخاب محصولات مرتبط</h3>
                                <p className="text-gray-500 mt-1">محصولاتی که می‌خواهید زیر این خبر نمایش داده شوند را تیک بزنید.</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1">
                            {products && products.length > 0 ? (
                                <div className="space-y-3">
                                    {products.map((product) => (
                                        <label key={product.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={selectedIds.includes(product.id)}
                                                onChange={() => toggleSelection(product.id)}
                                            />
                                            <span className="text-gray-700 font-medium">{product.name || product.title}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">هیچ محصولی در سیستم یافت نشد.</div>
                            )}
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                            <button type="button" onClick={onClose} className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
                                تایید انتخاب‌ها ({selectedIds.length} محصول)
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
