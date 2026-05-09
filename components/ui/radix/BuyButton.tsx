"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { AppTooltip } from "@/components/ui/radix/Tooltip";

export function BuyButton({ href }: { href: string }) {
  return (
    <AppTooltip content="مشاهده و خرید">
      <Link
        href={href}
        onClick={(e) => e.stopPropagation()}
        className="
          w-11 h-11
          rounded-full
          bg-blue-50 text-blue-600
          flex items-center justify-center
          hover:bg-blue-100
          transition
          z-10
        "
      >
        <ShoppingBasket className="w-5 h-5" />
      </Link>
    </AppTooltip>
  );
}
