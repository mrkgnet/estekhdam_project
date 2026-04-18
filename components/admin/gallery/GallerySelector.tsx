"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getGovernmentGalleryImages } from "@/actions/gallery/admin/jobnews/government/Actions";

interface GallerySelectorProps {
  onSelect: (imageUrl: string) => void;
  selectedImageUrl?: string | null; // برای اینکه دور عکسِ انتخاب‌شده خط بکشیم
}

export default function GallerySelector({ onSelect, selectedImageUrl }: GallerySelectorProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      const res = await getGovernmentGalleryImages();
      if (res?.success) {
        setGalleryImages(res.images);
      }
      setIsLoading(false);
    };

    fetchGallery();
  }, []);

  // حالت لودینگ
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // حالت خالی بودن پوشه
  if (galleryImages.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 text-sm border-2 border-dashed border-gray-100 rounded-xl">
        هیچ عکسی در پوشه سرور (گالری) یافت نشد.
      </div>
    );
  }

  // نمایش گالری
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-72 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
      {galleryImages.map((imgUrl, index) => {
        const isSelected = selectedImageUrl === imgUrl;
        
        return (
          <div
            key={index}
            onClick={() => onSelect(imgUrl)}
            className={`relative group cursor-pointer aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              isSelected ? "border-blue-500 shadow-md scale-95" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* استفاده از تگ img ساده یا next/image بستگی به تنظیمات next.config.js شما دارد */}
            <img
              src={imgUrl}
              alt={`gallery-${index}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* افکت هاور و آیکون تیک برای عکس انتخاب شده */}
            <div className={`absolute inset-0 transition-colors ${isSelected ? "bg-blue-500/20" : "bg-black/0 group-hover:bg-black/10"}`}>
               {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
