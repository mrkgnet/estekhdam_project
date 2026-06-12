import { Suspense } from "react";
import FetchDataUser from "./FetchDataUser";
import DotsLoader from "@/components/ui/Loading/DotsLoader";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const categoryQuery = params?.category || "";
  const limit = 10;
  const suspenseKey = `${searchQuery}-${currentPage}-${categoryQuery}`;

  return (
    <main className="w-full min-h-screen py-2 overflow-hidden font-sans bg-gray-50/30" dir="rtl">
      <Suspense key={suspenseKey} fallback={<div className="mt-20"><DotsLoader /></div>}>
        <FetchDataUser
          currentPage={currentPage}
          searchQuery={searchQuery}
          categoryQuery={categoryQuery}
          limit={limit}
        />
      </Suspense>
    </main>
  );
}
