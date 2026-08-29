"use client";

import { editDataProductAction } from "@/actions/admin/products/government/editproduct/Actions";
import BasicInfoSection from "@/components/admin/products/basicInfoSection/BasicInfoSection";
import CategorySection from "@/components/admin/products/categorySection/CategorySection";
import DescriptionSection from "@/components/admin/products/descriptionSection/DescriptionSection";
import FeaturesSection from "@/components/admin/products/featuresSection/FeaturesSection";
import FormActions from "@/components/admin/products/formActions/FormActions";
import { generatePersianSlug } from "@/lib/generateSlug";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  catName: string;
  catSlug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  type?: "MAIN" | "FREE_RESOURCE";
  description?: string;
  newPrice: number;
  oldPrice?: number | null;
  imageUrl?: string | null;
  categoryIds?: string[];
  categories?: Category[];
  features?: string[];
  isActive?: boolean;
  downloadUrl?: string | null;
}

interface EditProductProps {
  productData: Product;
  allCategories: Category[];
}

const initialState = { success: false, message: "" };

export default function ShowDataProduct({ productData, allCategories }: EditProductProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(editDataProductAction, initialState);

  const [isActive, setIsActive] = useState<boolean>(productData?.isActive ?? true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(() => {
    if (productData?.categoryIds?.length) {
      return allCategories.filter((cat) => productData.categoryIds!.includes(cat.id));
    }
    return [];
  });
  
  const [features, setFeatures] = useState<string[]>(() => productData?.features || []);
  const [description, setDescription] = useState(productData.description || "");
  const [previewImage, setPreviewImage] = useState<string | null>(productData?.imageUrl || null);
  const [productName, setProductName] = useState(productData.name || "");
  const [productSlug, setProductSlug] = useState(productData.slug || "");
  const [productType, setProductType] = useState<"MAIN" | "FREE_RESOURCE">(productData.type || "MAIN");
  const [downloadUrl, setDownloadUrl] = useState<string>(productData.downloadUrl || "");

  // 🟢 رفع مشکل لینک تصویر: مقدار اولیه از دیتابیس خوانده می‌شود تا اینپوت خالی نباشد
  const [externalImageUrl, setExternalImageUrl] = useState<string>(productData?.imageUrl || "");

  // 🟢 استیت‌های قیمت برای نگهداری مقادیر خام (بدون کاما)
  const [newPrice, setNewPrice] = useState<string>(productData.newPrice ? String(productData.newPrice) : "");
  const [oldPrice, setOldPrice] = useState<string>(productData.oldPrice ? String(productData.oldPrice) : "");

  useEffect(() => {
    if (!state?.message) return;
    if (state.success) {
      toast.success(state.message);
      router.back();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
    setProductName(val);
    setProductSlug(generatePersianSlug(val));
  };

  const handleNewPriceChange = (e: React.ChangeEvent<HTMLInputElement> | string | number) => {
    const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
    const numericValue = String(val).replace(/\D/g, "");
    setNewPrice(numericValue);
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement> | string | number) => {
    const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
    const numericValue = String(val).replace(/\D/g, "");
    setOldPrice(numericValue);
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
    setExternalImageUrl(val);
    if (val) {
      setPreviewImage(val);
    } else {
      setPreviewImage(null);
    }
  };

  const handleUploadSuccess = (url: string) => {
    if(url) {
      setExternalImageUrl(url);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
      setExternalImageUrl("");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6 font-sans" dir="rtl">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ویرایش محصول</h1>
          <p className="text-gray-500 text-sm mt-1.5">تغییرات مورد نیاز را اعمال کرده و ذخیره کنید</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium cursor-pointer"
        >
          <span>بازگشت</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form ref={formRef} action={formAction} className="space-y-8">
        <input type="hidden" name="id" value={productData.id} />
        <input type="hidden" name="existingImageUrl" value={productData.imageUrl || ""} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="isActive" value={String(isActive)} />
        <input type="hidden" name="externalImageUrl" value={externalImageUrl} />

        <input type="hidden" name="newPrice" value={productType === "FREE_RESOURCE" ? "0" : newPrice} />
        <input type="hidden" name="oldPrice" value={productType === "FREE_RESOURCE" ? "0" : oldPrice} />

        {selectedCategories.map((cat) => (
          <input key={cat.id} type="hidden" name="categoryIds" value={cat.id} />
        ))}
        {features.map((feature, index) => (
          <input key={`${feature}-${index}`} type="hidden" name="features" value={feature} />
        ))}

        <BasicInfoSection
          productName={productName}
          productSlug={productSlug}
          productType={productType}
          onTypeChange={setProductType}
          newPrice={newPrice}
          oldPrice={oldPrice}
          onNewPriceChange={handleNewPriceChange}
          onOldPriceChange={handleOldPriceChange}
          downloadUrl={downloadUrl}
          onDownloadUrlChange={setDownloadUrl}
          isActive={isActive}
          previewImage={previewImage}
          externalImageUrl={externalImageUrl}
          onNameChange={handleNameChange}
          onSlugChange={setProductSlug}
          onActiveChange={setIsActive}
          onImageChange={setPreviewImage} 
          onExternalImageUrlChange={handleExternalUrlChange}
          // @ts-ignore
          onUploadSuccess={handleUploadSuccess} 
        />

        <div className="grid md:grid-cols-2 gap-6">
          <CategorySection
            allCategories={allCategories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <FeaturesSection features={features} onFeaturesChange={setFeatures} />
        </div>

        <DescriptionSection description={description} onDescriptionChange={setDescription} />

        <FormActions isPending={isPending} onCancel={() => router.back()} />
      </form>
    </div>
  );
}