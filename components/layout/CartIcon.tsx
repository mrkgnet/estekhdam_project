// components/layout/CartIcon.tsx
"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // npm install lucide-react

export default function CartIcon() {
  const { totalItems } = useCart();
  const count = totalItems();

  return (
    <Link href="/cart" className="relative">
      <ShoppingBag className="h-6 w-6 text-zinc-700" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#fa7342] text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
