export type Category = {
  id: string;
  catName: string;
  catSlug: string;
  imageUrl?: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  downloadUrl?: string | null;
  downloadCount?: number;
  categories: { id: string; catName: string; catSlug: string }[];
};
