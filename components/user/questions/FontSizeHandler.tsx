import React from "react";

interface FontSizeSliderProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

export default function FontSizeHandler({ fontSize, setFontSize }: FontSizeSliderProps) {
  return (
    <div className="flex items-center gap-2 mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit transition-colors duration-100">
      <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">A-</span>
      <input
        type="range"
        min="12"
        max="24"
        step="1"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="w-24 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-600 dark:accent-emerald-500 transition-colors duration-100"
      />
      <span className="text-base font-bold text-slate-700 dark:text-slate-200 transition-colors duration-100">A+</span>
    </div>
  );
}