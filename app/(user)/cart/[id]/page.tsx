import React, { Suspense } from "react";
import FetchDataCart from "./FetchDataCart";
import LoadingDots from "@/components/LoadingIphone";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<LoadingDots />}>
        <FetchDataCart pid={id} />
      </Suspense>
    </div>
  );
}
