"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import addCategoryAction from "@/actions/category/addcategory/Actions";
import editCategoryAction from "@/actions/category/editcategory/Actions";
import toast from "react-hot-toast";
import { Edit, Trash2, UploadCloud, X } from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteItemCategoryAction } from "@/actions/category/deletecategory/Actions";
import { generatePersianSlug } from "@/lib/generateSlug";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query"; // 👈 ۱. ایمپورت ری‌اکت کوئری
import { FOOTER_CATEGORIES_KEY } from "@/hooks/useFooterCategories"; // یا مستقیماً ["footer", "categories"]

type Category = {
    id: string;
    catId: number;
    catName: string;
    catSlug: string;
    imageUrl?: string;
    parentId?: string | null;
    type: "MAIN" | "FREE_RESOURCE" | "BLOG";
};

type CategoryNode = Category & { children: CategoryNode[] };

const CategoryTreeNode = ({ node, selectedId, onSelect }: { node: CategoryNode, selectedId: string, onSelect: (id: string) => void }) => {
    return (
        <li className="mt-1">
            <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors group">
                <input
                    type="checkbox"
                    checked={selectedId === node.id} 
                    onChange={() => onSelect(selectedId === node.id ? "" : node.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${selectedId === node.id ? 'font-bold text-blue-600' : 'text-gray-700 group-hover:text-black'}`}>
                    {node.catName}
                </span>
            </label>
            {node.children && node.children.length > 0 && (
                <ul className="pr-6 border-r-2 border-gray-100 ml-2 mt-1 space-y-1 relative">
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gray-100"></div>
                    {node.children.map(child => (
                        <CategoryTreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default function CategoryManager({ getDataCat }: { getDataCat: any }) {
    const categories: Category[] = Array.isArray(getDataCat) ? getDataCat : (getDataCat?.data || []);

    // 👈 ۲. مقداردهی queryClient
    const queryClient = useQueryClient();

    // ---------------- استیت‌های مودال افزودن ----------------
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addState, addFormAction, isAddPending] = useActionState(addCategoryAction, null);
    const addFormRef = useRef<HTMLFormElement>(null);
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const [addCatName, setAddCatName] = useState("");
    const [addCatSlug, setAddCatSlug] = useState("");
    const [addParentId, setAddParentId] = useState("");
    const [addType, setAddType] = useState<"MAIN" | "FREE_RESOURCE" | "BLOG">("MAIN");
    const [addPreviewImage, setAddPreviewImage] = useState<string | null>(null);
    const [addExternalUrl, setAddExternalUrl] = useState("");

    // ---------------- استیت‌های مودال ویرایش ----------------
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editState, editFormAction, isEditPending] = useActionState(editCategoryAction, null);
    const editFormRef = useRef<HTMLFormElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);
    const [editId, setEditId] = useState("");
    const [editCatName, setEditCatName] = useState("");
    const [editCatSlug, setEditCatSlug] = useState("");
    const [editParentId, setEditParentId] = useState("");
    const [editType, setEditType] = useState<"MAIN" | "FREE_RESOURCE" | "BLOG">("MAIN");
    const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
    const [editExternalUrl, setEditExternalUrl] = useState("");

    const addCategoryTree = useMemo(() => {
        const buildTree = (parentId: string | null = null): CategoryNode[] => {
            return categories
                .filter(c => (c.parentId || null) === parentId)
                .map(c => ({ ...c, children: buildTree(c.id) }));
        };
        return buildTree();
    }, [categories]);

    const editCategoryTree = useMemo(() => {
        const buildTree = (parentId: string | null = null): CategoryNode[] => {
            return categories
                .filter(c => (c.parentId || null) === parentId && c.id !== editId)
                .map(c => ({ ...c, children: buildTree(c.id) }));
        };
        return buildTree();
    }, [categories, editId]);

    // ---------------- Effect افزودن (باطل کردن کش هنگام موفقیت) ----------------
    useEffect(() => {
        if (addState?.success) {
            setIsAddModalOpen(false);
            addFormRef.current?.reset();
            setAddCatName("");
            setAddCatSlug("");
            setAddParentId("");
            setAddType("MAIN");
            setAddExternalUrl("");
            clearAddImage();
            toast.success(addState?.message || "با موفقیت ثبت شد");

            // 👈 ۳. پاک کردن کش فوتر به محض اضافه شدن دسته جدید
            queryClient.invalidateQueries({ queryKey: FOOTER_CATEGORIES_KEY });
        }
    }, [addState, queryClient]);

    // ---------------- Effect ویرایش (باطل کردن کش هنگام موفقیت) ----------------
    useEffect(() => {
        if (editState?.success) {
            setIsEditModalOpen(false);
            editFormRef.current?.reset();
            toast.success(editState?.message || "با موفقیت ویرایش شد");

            // 👈 ۴. پاک کردن کش فوتر به محض ویرایش دسته
            queryClient.invalidateQueries({ queryKey: FOOTER_CATEGORIES_KEY });
        }
    }, [editState, queryClient]);

    // ---------------- هندلرها ----------------
    const handleAddNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAddCatName(val);
        setAddCatSlug(generatePersianSlug(val));
    };

    const handleOpenEdit = (cat: Category) => {
        setEditId(cat.id);
        setEditCatName(cat.catName);
        setEditCatSlug(cat.catSlug);
        setEditParentId(cat.parentId || "");
        setEditType(cat.type || "MAIN");
        setEditPreviewImage(cat.imageUrl || null);
        setEditExternalUrl("");
        setIsEditModalOpen(true);
    };

    const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEditCatName(val);
        setEditCatSlug(generatePersianSlug(val));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const clearAddImage = () => {
        setAddPreviewImage(null);
        if (addFileInputRef.current) addFileInputRef.current.value = "";
    };

    const clearEditImage = () => {
        setEditPreviewImage(null);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "FREE_RESOURCE": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">منابع رایگان</span>;
            case "BLOG": return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold">مقالات وبلاگ</span>;
            default: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">اصلی / پولی</span>;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto text-xs md:text-sm" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-base font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors shadow-sm flex items-center gap-1"
                >
                    <span>+</span> افزودن دسته جدید
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 border-b w-12 text-center">ردیف</th>
                            <th className="p-4 border-b w-20 text-center">تصویر</th>
                            <th className="p-4 border-b">نام دسته</th>
                            <th className="p-4 border-b">نوع</th>
                            <th className="p-4 border-b">والد (مادر)</th>
                            <th className="p-4 border-b">اسلاگ</th>
                            <th className="p-4 border-b">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.length > 0 ? (
                            categories.map((cat, index) => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 text-gray-400 text-center">{index + 1}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-10 h-10 relative mx-auto bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            {cat.imageUrl ? (
                                                <Image src={cat.imageUrl} alt={cat.catName} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">بدون عکس</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            {cat.parentId && <span className="text-gray-300 font-light">↳</span>}
                                            <span className="font-medium text-gray-800">{cat.catName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getTypeBadge(cat.type)}
                                    </td>
                                    <td className="p-4">
                                        {cat.parentId ? (
                                            <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-[11px]">
                                                {categories.find(c => c.id === cat.parentId)?.catName || "نامشخص"}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-[11px]">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-500 font-mono text-[11px]" dir="ltr">{cat.catSlug}</td>
                                    <td className="p-4 flex gap-2 items-center">
                                        <button
                                            onClick={() => handleOpenEdit(cat)}
                                            className="p-1.5 text-blue-600 flex items-center gap-1 bg-blue-50 hover:bg-blue-50 rounded-md transition-colors"
                                            title="ویرایش"
                                        >
                                            <Edit size={16} />
                                            ویرایش 
                                        </button>
                                        <DeleteButton
                                            id={cat.id}
                                            action={async (id: string) => {
                                                const res = await deleteItemCategoryAction(id);
                                                // 👈 ۵. ابطال کش پس از حذف دسته
                                                queryClient.invalidateQueries({ queryKey: FOOTER_CATEGORIES_KEY });
                                                return res;
                                            }}
                                            itemName={cat.catName}
                                            className="p-1.5 text-red-600 flex items-center gap-1 bg-red-50 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            حذف
                                        </DeleteButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-gray-400">لیست دسته‌بندی‌ها خالی است.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* مودال افزودن */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-800 border-b pb-3">
                            <span className="w-2 h-6 bg-blue-600 rounded"></span>
                            افزودن دسته جدید
                        </h2>
                        <form ref={addFormRef} action={addFormAction} className="space-y-4">
                            <input type="hidden" name="parentId" value={addParentId} />

                            {addState?.success === false && <p className="text-red-500 text-xs bg-red-50 p-3 rounded border border-red-100">{addState.message || addState.error}</p>}
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">نام دسته‌بندی</label>
                                <input type="text" required name="catName" value={addCatName} onChange={handleAddNameChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="مثلاً: منابع رایگان بانکی" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">نوع دسته‌بندی</label>
                                <select 
                                    name="type" 
                                    value={addType} 
                                    onChange={(e) => setAddType(e.target.value as any)} 
                                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                                >
                                    <option value="MAIN">اصلی (محصولات پولی و فروشگاهی)</option>
                                    <option value="FREE_RESOURCE">منابع رایگان (دانلود بدون پرداخت)</option>
                                    <option value="BLOG">مقالات وبلاگ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">اسلاگ (Slug)</label>
                                <input type="text" name="catSlug" required value={addCatSlug} onChange={(e) => setAddCatSlug(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono" dir="ltr" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">انتخاب والد (اختیاری)</label>
                                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50 custom-scrollbar">
                                    <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded transition-colors border-b border-gray-200 mb-2 pb-2">
                                        <input
                                            type="checkbox"
                                            checked={addParentId === ""}
                                            onChange={() => setAddParentId("")}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className={`text-sm ${addParentId === "" ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                                            -- بدون والد (دسته اصلی) --
                                        </span>
                                    </label>
                                    <ul>
                                        {addCategoryTree.filter(node => node.type === addType).map(node => (
                                            <CategoryTreeNode key={node.id} node={node} selectedId={addParentId} onSelect={setAddParentId} />
                                        ))}
                                        {addCategoryTree.filter(node => node.type === addType).length === 0 && (
                                            <li className="text-gray-400 text-xs py-2 text-center">هیچ والد مرتبطی در این نوع یافت نشد.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">لینک تصویر خارجی (اختیاری)</label>
                                    <input 
                                        type="url" 
                                        name="externalImageUrl" 
                                        value={addExternalUrl} 
                                        onChange={(e) => setAddExternalUrl(e.target.value)} 
                                        className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-[11px]" 
                                        dir="ltr" 
                                        placeholder="https://example.com/image.jpg" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">اگر لینک وارد کنید، آپلود فایل نادیده گرفته می‌شود.</p>
                                </div>

                                <div className="text-center text-xs text-gray-400 font-bold">--- یا ---</div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">آپلود از سیستم</label>
                                    <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-400 bg-white rounded-xl transition-all overflow-hidden group">
                                        <input ref={addFileInputRef} type="file" name="imageFile" accept="image/*" onChange={(e) => handleImageChange(e, setAddPreviewImage)} disabled={!!addExternalUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" />
                                        {!addPreviewImage ? (
                                            <div className={`py-4 flex flex-col items-center justify-center ${addExternalUrl ? 'text-gray-300' : 'text-gray-400'}`}>
                                                <UploadCloud size={24} className={`mb-1 ${!addExternalUrl && 'group-hover:text-blue-500'}`} />
                                                <span className="text-[10px]">{addExternalUrl ? 'غیرفعال (لینک وارد شده)' : 'کلیک کنید یا تصویر را بکشید'}</span>
                                            </div>
                                        ) : (
                                            <div className="relative h-24 bg-white">
                                                <img src={addPreviewImage} alt="Preview" className="w-full h-full object-contain p-2" />
                                                <button type="button" onClick={clearAddImage} className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors z-20"><X size={12} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded transition-all">انصراف</button>
                                <button type="submit" disabled={isAddPending} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-100 transition-all font-bold">{isAddPending ? "در حال ثبت..." : "ثبت نهایی"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال ویرایش */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-800 border-b pb-3">
                            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                            ویرایش دسته‌بندی
                        </h2>
                        <form ref={editFormRef} action={editFormAction} className="space-y-4">
                            <input type="hidden" name="id" value={editId} />
                            <input type="hidden" name="parentId" value={editParentId} />

                            {editState?.success === false && <p className="text-red-500 text-xs bg-red-50 p-3 rounded">{editState.message || editState.error}</p>}

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">نام دسته‌بندی</label>
                                <input type="text" required name="catName" value={editCatName} onChange={handleEditNameChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">نوع دسته‌بندی</label>
                                <select 
                                    name="type" 
                                    value={editType} 
                                    onChange={(e) => setEditType(e.target.value as any)} 
                                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all bg-white"
                                >
                                    <option value="MAIN">اصلی (محصولات پولی و فروشگاهی)</option>
                                    <option value="FREE_RESOURCE">منابع رایگان (دانلود بدون پرداخت)</option>
                                    <option value="BLOG">مقالات وبلاگ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">اسلاگ (Slug)</label>
                                <input type="text" name="catSlug" required value={editCatSlug} onChange={(e) => setEditCatSlug(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all font-mono" dir="ltr" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">تغییر والد</label>
                                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50 custom-scrollbar">
                                    <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded transition-colors border-b border-gray-200 mb-2 pb-2">
                                        <input
                                            type="checkbox"
                                            checked={editParentId === ""}
                                            onChange={() => setEditParentId("")}
                                            className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                                        />
                                        <span className={`text-sm ${editParentId === "" ? 'font-bold text-amber-600' : 'text-gray-700'}`}>
                                            -- بدون والد (دسته اصلی) --
                                        </span>
                                    </label>
                                    <ul>
                                        {editCategoryTree.filter(node => node.type === editType).map(node => (
                                            <CategoryTreeNode key={node.id} node={node} selectedId={editParentId} onSelect={setEditParentId} />
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">لینک تصویر خارجی جدید</label>
                                    <input 
                                        type="url" 
                                        name="externalImageUrl" 
                                        value={editExternalUrl} 
                                        onChange={(e) => setEditExternalUrl(e.target.value)} 
                                        className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all font-mono text-[11px]" 
                                        dir="ltr" 
                                        placeholder="https://example.com/image.jpg" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">در صورت ورود لینک، جایگزین عکس قبلی می‌شود.</p>
                                </div>

                                <div className="text-center text-xs text-gray-400 font-bold">--- یا ---</div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">آپلود عکس جدید از سیستم</label>
                                    <div className="relative border-2 border-dashed border-gray-200 hover:border-amber-400 bg-white rounded transition-all overflow-hidden group">
                                        <input ref={editFileInputRef} type="file" name="imageFile" accept="image/*" onChange={(e) => handleImageChange(e, setEditPreviewImage)} disabled={!!editExternalUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" />
                                        {!editPreviewImage ? (
                                            <div className={`py-4 flex flex-col items-center justify-center ${editExternalUrl ? 'text-gray-300' : 'text-gray-400'}`}>
                                                <UploadCloud size={24} className="mb-1" />
                                                <span className="text-[10px]">{editExternalUrl ? 'غیرفعال (لینک وارد شده)' : 'انتخاب تصویر جدید'}</span>
                                            </div>
                                        ) : (
                                            <div className="relative h-24 bg-white">
                                                <img src={editPreviewImage} alt="Preview" className="w-full h-full object-contain p-2" />
                                                <button type="button" onClick={clearEditImage} className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full shadow-md z-20"><X size={12} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded">انصراف</button>
                                <button type="submit" disabled={isEditPending} className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 shadow-md shadow-amber-100 transition-all font-bold">{isEditPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}