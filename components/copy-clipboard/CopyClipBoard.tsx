"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyClipBoardProps {
  text: string;
  label?: string;
  className?: string;
  copiedLabel?: string;
  onCopied?: (text: string) => void;
}

export function CopyClipBoard({
  text,
  label,
  className = "",
  copiedLabel = "کپی شد",
  onCopied,
}: CopyClipBoardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.(text);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`bg-slate-100/80 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-200 transition ${className}`}
      title="کپی"
    >
      {/* تغییر آیکون به صورت داینامیک بر اساس وضعیت کپی */}
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Copy className="w-4 h-4 text-slate-500" />
      )}

      {label && <span>{label}</span>}
      <span className="font-mono text-slate-800 tracking-wider">{text}</span>
      {copied && <span className="text-emerald-600 text-xs">{copiedLabel}</span>}
    </button>
  );
}
