// components/admin/questions/CategoryChapterSelect.tsx
"use client";

import React from 'react';

interface CategoryChapter {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryChapterSelectProps {
  categories: CategoryChapter[];
  name?: string;
  defaultValue?: number | null;
  required?: boolean;
  className?: string;
}

export default function CategoryChapterSelect({ 
  categories, 
  name = "categoryChapterId",
  defaultValue = null,
  required = false,
  className = ""
}: CategoryChapterSelectProps) {
  // فقط دسته‌بندی‌های فعال را نمایش می‌دهیم
  const activeCategories = categories.filter(cat => cat.isActive);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold">
        انتخاب دسته‌بندی {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue || ""}
        className={`border p-2 rounded focus:outline-blue-500 bg-white ${className}`}
      >
        <option value="">بدون دسته‌بندی</option>
        {activeCategories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
            {category.description && ` - ${category.description}`}
          </option>
        ))}
      </select>
    </div>
  );
}
 