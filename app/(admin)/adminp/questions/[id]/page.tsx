
import React, { Suspense } from "react";

import ExamQuestionsPage from "./ShowData";
import DotsLoader from "@/components/ui/Loading/DotsLoader";

import { fetchDataQuestion } from "@/actions/admin/questions/Actions";
import { fetchDataChapterAction } from "@/actions/admin/chapter/Actionst";
import { fetchCategoryChapter } from "@/actions/admin/category_chapter/fetch/Action";

// ============================================
// Types
// ============================================

interface PageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

interface QuestionsDataLoaderProps {
  id: string;
  page: number;
  search?: string;
}

// ============================================
// Server Data Loader
// ============================================

async function QuestionsDataLoader({
  id,
  page,
  search,
}: QuestionsDataLoaderProps) {
  // دریافت هم‌زمان اطلاعات برای کاهش زمان بارگذاری
  const [
    questionsData,
    chapters,
    categoryChaptersResult,
  ] = await Promise.all([
    fetchDataQuestion(id, page, 10, search),
    fetchDataChapterAction(id),
    fetchCategoryChapter(),
  ]);

  const categoryChapters = categoryChaptersResult.success
    ? categoryChaptersResult.data
    : [];

  return (
    <ExamQuestionsPage
      productId={id}
      questionsData={questionsData}
      chapters={chapters}
      categoryChapters={categoryChapters}
    />
  );
}

// ============================================
// Main Page
// ============================================

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, { page, search }] = await Promise.all([
    params,
    searchParams,
  ]);

  // اعتبارسنجی شماره صفحه
  const parsedPage = Number(page);

  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  return (
    <main className="min-h-screen">
      <Suspense
        key={`${id}-${currentPage}-${search ?? ""}`}
        fallback={<DotsLoader />}
      >
        <QuestionsDataLoader
          id={id}
          page={currentPage}
          search={search}
        />
      </Suspense>
    </main>
  );
}
