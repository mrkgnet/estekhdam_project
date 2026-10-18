
import React, { Suspense } from "react";

import ExamQuestionsPage from "./ShowData";
import DotsLoader from "@/components/ui/Loading/DotsLoader";

import {
  fetchDataQuestion,
  fetchQuestionReferencesAction,
} from "@/actions/admin/questions/Actions";

import { fetchDataChapterAction } from "@/actions/admin/chapter/Actionst";
import { fetchCategoryChapter } from "@/actions/admin/category_chapter/fetch/Action";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    reference?: string;
  }>;
}

interface LoaderProps {
  id: string;
  page: number;
  search?: string;
  referenceId?: string;
}

async function QuestionsDataLoader({
  id,
  page,
  search,
  referenceId,
}: LoaderProps) {
  const [
    questionsData,
    chapters,
    categoryChaptersResult,
    referencesResult,
  ] = await Promise.all([
    fetchDataQuestion(id, page, 10, search, referenceId),
    fetchDataChapterAction(id),
    fetchCategoryChapter(),
    fetchQuestionReferencesAction(),
  ]);

  const categoryChapters = categoryChaptersResult.success
    ? categoryChaptersResult.data
    : [];

  const references = referencesResult.success
    ? referencesResult.data
    : [];

  return (
    <ExamQuestionsPage
      productId={id}
      questionsData={questionsData}
      chapters={chapters}
      categoryChapters={categoryChapters}
      references={references}
    />
  );
}

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, { page, search, reference }] =
    await Promise.all([params, searchParams]);

  const parsedPage = Number(page);

  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  return (
    <main className="min-h-screen">
      <Suspense
        key={`${id}-${currentPage}-${search ?? ""}-${reference ?? ""}`}
        fallback={<DotsLoader />}
      >
        <QuestionsDataLoader
          id={id}
          page={currentPage}
          search={search}
          referenceId={reference}
        />
      </Suspense>
    </main>
  );
}
