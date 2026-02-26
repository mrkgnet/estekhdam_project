import FetchDataProducts from "@/components/products/FetchDataProducts";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      }
    >
      <FetchDataProducts />
    </Suspense>
  );
}
