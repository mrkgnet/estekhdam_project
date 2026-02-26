import { getProductBySlug } from "@/actions/get_product_by_slug";
import ProductDetailPageClient from "./ProductDetailPageClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: product.title,
    description: product.description,
  };
}



export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductDetailPageClient product={product} />;
}





