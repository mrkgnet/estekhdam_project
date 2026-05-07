"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Edit, Trash2, X, UploadCloud } from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";
import { generatePersianSlug } from "@/lib/generateSlug";
import Image from "next/image";
import { deleteItemMenuAction } from "@/actions/admin/manage-menu/delete-menu-client/Actions";
import addMenuClientAction from "@/actions/admin/manage-menu/add-menu-client/Actions";
import editMenuClientAction from "@/actions/admin/manage-menu/edit-menu-client/Actions";

type Menu = {
  id: string;
  name: string;
  slug: string;
  customUrl?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  order?: number;
};

type MenuNode = Menu & { children: MenuNode[] };

const MenuTreeNode = ({
  node,
  selectedId,
  onSelect,
}: {
  node: MenuNode;
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <li className="mt-1">
      <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors group">
        <input
          type="checkbox"
          checked={selectedId === node.id}
          onChange={() => onSelect(selectedId === node.id ? "" : node.id)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span
          className={`text-sm transition-colors ${
            selectedId === node.id
              ? "font-bold text-blue-600"
              : "text-gray-700 group-hover:text-black"
          }`}
        >
          {node.name}
        </span>
      </label>
      {node.children && node.children.length > 0 && (
        <ul className="pr-6 border-r-2 border-gray-100 ml-2 mt-1 space-y-1 relative">
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gray-100"></div>
          {node.children.map((child) => (
            <MenuTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function MenuClientManager({ getDataCat }: { getDataCat: any }) {
  const rawMenus: Menu[] = Array.isArray(getDataCat)
    ? getDataCat
    : getDataCat?.data || [];
  const menus = [...rawMenus].sort((a, b) => (a.order || 0) - (b.order || 0));

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addState, addFormAction, isAddPending] = useActionState(
    addMenuClientAction,
    null
  );
  const addFormRef = useRef<HTMLFormElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [addName, setAddName] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addParentId, setAddParentId] = useState("");
  const [addPreviewImage, setAddPreviewImage] = useState<string | null>(null);
  const [addCustomUrl, setAddCustomUrl] = useState("");
  const [addOrder, setAddOrder] = useState<number>(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editState, editFormAction, isEditPending] = useActionState(
    editMenuClientAction,
    null
  );
  const editFormRef = useRef<HTMLFormElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
  const [editCustomUrl, setEditCustomUrl] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);

  const menuTree = useMemo(() => {
    const buildTree = (parentId: string | null = null): MenuNode[] => {
      return menus
        .filter((m) => (m.parentId || null) === parentId)
        .map((m) => ({ ...m, children: buildTree(m.id) }));
    };
    return buildTree();
  }, [menus]);

  const editMenuTree = useMemo(() => {
    const buildTree = (parentId: string | null = null): MenuNode[] => {
      return menus
        .filter((m) => (m.parentId || null) === parentId && m.id !== editId)
        .map((m) => ({ ...m, children: buildTree(m.id) }));
    };
    return buildTree();
  }, [menus, editId]);

  useEffect(() => {
    if (addState?.success) {
      setIsAddModalOpen(false);
      addFormRef.current?.reset();
      setAddName("");
      setAddSlug("");
      setAddParentId("");
      setAddCustomUrl("");
      setAddOrder(0);
      clearAddImage();
      toast.success(addState?.message || "با موفقیت ثبت شد");
    }
  }, [addState]);

  useEffect(() => {
    if (editState?.success) {
      setIsEditModalOpen(false);
      editFormRef.current?.reset();
      toast.success(editState?.message || "با موفقیت ویرایش شد");
    }
  }, [editState]);

  const handleAddNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddName(val);
    setAddSlug(generatePersianSlug(val));
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditName(val);
    setEditSlug(generatePersianSlug(val));
  };

  const handleOpenEdit = (menu: Menu) => {
    setEditId(menu.id);
    setEditName(menu.name);
    setEditSlug(menu.slug);
    setEditParentId(menu.parentId || "");
    setEditPreviewImage(menu.imageUrl || null);
    setEditCustomUrl(menu.customUrl || "");
    setEditOrder(menu.order || 0);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const clearAddImage = () => {
    setAddPreviewImage(null);
    if (addFileInputRef.current) addFileInputRef.current.value = "";
  };

  const clearEditImage = () => {
    setEditPreviewImage(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-xs md:text-sm" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-base font-bold text-gray-800">
          مدیریت منوهای سمت کاربر
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm flex items-center gap-1"
        >
          <span>+</span> افزودن منو جدید
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 border-b w-16 text-center">ترتیب</th>
              <th className="p-4 border-b w-24 text-center">ایکون</th>
              <th className="p-4 border-b">نام منو</th>
              <th className="p-4 border-b">والد (مادر)</th>
              <th className="p-4 border-b">اسلاگ / لینک</th>
              <th className="p-4 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.length > 0 ? (
              menus.map((menu) => (
                <tr
                  key={menu.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4 text-gray-600 font-bold text-center bg-gray-50/30">
                    {menu.order}
                  </td>
                  <td className="p-4 text-center">
                    <div className="w-10 h-10 relative mx-auto bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      {menu.imageUrl ? (
                        <Image
                          src={menu.imageUrl}
                          alt={menu.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                          بدون عکس
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {menu.parentId && (
                        <span className="text-gray-300 font-light">↳</span>
                      )}
                      <span className="font-medium text-gray-800">
                        {menu.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {menu.parentId ? (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-[11px]">
                        {menus.find((m) => m.id === menu.parentId)?.name ||
                          "نامشخص"}
                      </span>
                    ) : (
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-[11px] font-semibold">
                        منوی اصلی
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-[11px]" dir="ltr">
                    {menu.customUrl ? (
                      <span className="text-green-600" title="لینک سفارشی">
                        {menu.customUrl}
                      </span>
                    ) : (
                      <span>{menu.slug}</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2 items-center">
                    <button
                      onClick={() => handleOpenEdit(menu)}
                      className="p-1.5 text-blue-600 flex items-center gap-1 bg-blue-50 rounded-md"
                    >
                      <Edit size={16} /> ویرایش
                    </button>
                    <DeleteButton
                      id={menu.id}
                      action={deleteItemMenuAction}
                      itemName={menu.name}
                      className="p-1.5 text-red-600 flex items-center gap-1 bg-red-50 rounded"
                    >
                      <Trash2 size={16} /> حذف
                    </DeleteButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  لیست منوها خالی است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* مودال افزودن */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/40  flex justify-center items-center z-50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="بستن"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold mb-5 border-b pb-3">
              افزودن منو جدید
            </h2>
            <form ref={addFormRef} action={addFormAction} className="space-y-4">
              <input type="hidden" name="parentId" value={addParentId} />

              {addState?.success === false && (
                <p className="text-red-500 text-xs bg-red-50 p-3 rounded">
                  {addState.message || addState.error}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  نام منو
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={addName}
                  onChange={handleAddNameChange}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors"
                  placeholder="مثال: محصولات"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  اسلاگ (Slug)
                </label>
                <input
                  type="text"
                  required
                  name="slug"
                  value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg bg-gray-50 transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  لینک دلخواه (اختیاری)
                </label>
                <input
                  type="text"
                  name="customUrl"
                  value={addCustomUrl}
                  onChange={(e) => setAddCustomUrl(e.target.value)}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors text-left"
                  dir="ltr"
                  placeholder="/about-us یا https://domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  ترتیب نمایش (اولویت)
                </label>
                <input
                  type="number"
                  name="order"
                  value={addOrder}
                  onChange={(e) => setAddOrder(Number(e.target.value))}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors text-left"
                  dir="ltr"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  اعداد کوچکتر بالاتر نمایش داده می‌شوند (مثال: 0، 1، 2).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  انتخاب والد (اختیاری)
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <label className="flex items-center gap-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
                    <input
                      type="checkbox"
                      checked={addParentId === ""}
                      onChange={() => setAddParentId("")}
                      className="w-4 h-4 cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span
                      className={`text-sm ${
                        addParentId === ""
                          ? "font-bold text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      -- بدون والد (اصلی) --
                    </span>
                  </label>
                  <ul>
                    {menuTree.map((node) => (
                      <MenuTreeNode
                        key={node.id}
                        node={node}
                        selectedId={addParentId}
                        onSelect={setAddParentId}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  تصویر (آیکون)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[11px] text-gray-500">
                      انتخاب تصویر
                    </span>
                    <input
                      ref={addFileInputRef}
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setAddPreviewImage)}
                      className="hidden"
                    />
                  </label>
                  {addPreviewImage && (
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={addPreviewImage}
                        alt="پیش‌نمایش"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearAddImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isAddPending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isAddPending ? "در حال ثبت..." : "ثبت نهایی"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال ویرایش */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/40  flex justify-center items-center z-50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="بستن"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold mb-5 border-b pb-3 flex items-center gap-2 text-gray-800">
              <Edit size={20} className="text-blue-600" /> ویرایش منو
            </h2>
            <form ref={editFormRef} action={editFormAction} className="space-y-4">
              <input type="hidden" name="id" value={editId} />
              <input type="hidden" name="parentId" value={editParentId} />

              {editState?.success === false && (
                <p className="text-red-500 text-xs bg-red-50 p-3 rounded">
                  {editState.message || editState.error}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  نام منو
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={editName}
                  onChange={handleEditNameChange}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  اسلاگ (Slug)
                </label>
                <input
                  type="text"
                  required
                  name="slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg bg-gray-50 transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  لینک دلخواه (اختیاری)
                </label>
                <input
                  type="text"
                  name="customUrl"
                  value={editCustomUrl}
                  onChange={(e) => setEditCustomUrl(e.target.value)}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  ترتیب نمایش (اولویت)
                </label>
                <input
                  type="number"
                  name="order"
                  value={editOrder}
                  onChange={(e) => setEditOrder(Number(e.target.value))}
                  className="w-full border border-gray-200 outline-none focus:border-blue-500 p-2.5 rounded-lg transition-colors text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  انتخاب والد (مادر)
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <label className="flex items-center gap-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
                    <input
                      type="checkbox"
                      checked={editParentId === ""}
                      onChange={() => setEditParentId("")}
                      className="w-4 h-4 cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span
                      className={`text-sm ${
                        editParentId === ""
                          ? "font-bold text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      -- بدون والد (اصلی) --
                    </span>
                  </label>
                  <ul>
                    {editMenuTree.map((node) => (
                      <MenuTreeNode
                        key={node.id}
                        node={node}
                        selectedId={editParentId}
                        onSelect={setEditParentId}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  تصویر (آیکون)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[11px] text-gray-500">
                      تغییر تصویر
                    </span>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setEditPreviewImage)}
                      className="hidden"
                    />
                  </label>
                  {editPreviewImage && (
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={editPreviewImage}
                        alt="پیش‌نمایش"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearEditImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isEditPending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isEditPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
