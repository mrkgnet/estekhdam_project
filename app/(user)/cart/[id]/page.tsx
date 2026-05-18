import React, { Suspense } from "react";
import FetchDataCart from "./FetchDataCart";
import LoadingIphone from "@/components/LoadingIphone";
import DotsLoader from "@/components/ui/Loading/DotsLoader";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<DotsLoader />}>
        <FetchDataCart pid={id} />
      </Suspense>
    </div>
  );
}
