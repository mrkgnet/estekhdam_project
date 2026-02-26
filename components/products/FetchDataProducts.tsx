import { getProducts } from "@/actions/get_products";
import React from "react";
import InitialDataProducts from "./InitialDataProducts";

export default async function FetchDataProducts() {
  const result = await getProducts();
  return <InitialDataProducts products={result} />;
}
