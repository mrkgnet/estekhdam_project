"use client"; // حتما باید کلاینت کامپوننت باشد

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

// ایمپورت داینامیک برای جلوگیری از خطای SSR در Next.js
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useRef(null);

  // تنظیمات ویرایشگر (useMemo برای جلوگیری از رندر مجدد غیرضروری تنظیمات)
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'توضیحات تسک را اینجا وارد کنید...',
      height: 300,
      direction: 'rtl', // برای راست‌چین شدن و پشتیبانی از فارسی
    }),
    []
  );

  return (
    <div className="w-full">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        // onBlur بهتر از onChange است تا در هر بار فشردن دکمه، استیت آپدیت نشود و پرفورمنس افت نکند
        onBlur={(newContent) => onChange(newContent)} 
      />
    </div>
  );
}
