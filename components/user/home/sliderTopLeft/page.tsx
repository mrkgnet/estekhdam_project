import React from "react";
import ShowDataSLTL from "./ShowDataSLTL";
import { fetchPaginatedProductsAction } from "@/actions/user/latestProduct/Actions";

export default async function FetchDataSLTL() {
  // واکشی اولیه صفحه اول
  const response = await fetchPaginatedProductsAction(1);

  if (!response || !response.success || !response.data || response.data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <ShowDataSLTL
        title="محصولات مرتبط با این مورد"
        initialProducts={response.data}
        totalPages={response.totalPages}
      />
    </div>
  );
}