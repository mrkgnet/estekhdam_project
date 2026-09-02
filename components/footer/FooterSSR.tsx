// components/footer/FooterSSR.tsx
import React from "react";
import Footer from "./Footer";
import { dataFooter } from "@/actions/footer/Actions";
import { CategoryParentItem } from "./Footer";

export default async function FooterSSR() {
  // واکشی اولیه در سرور
  const response = await dataFooter();
  const categories = (response.success ? response.data : []) as unknown as CategoryParentItem[];

  return <Footer initialCategories={categories} />;
}