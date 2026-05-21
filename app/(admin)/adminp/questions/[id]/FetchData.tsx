import React from 'react'
import ExamQuestionsPage from './ShowData'
import { fetchDataQuestion } from '@/actions/admin/questions/Actions'
import { fetchDataChapterAction } from '@/actions/admin/chapter/Actionst';
import { fetchCategoryChapter } from '@/actions/admin/category_chapter/fetch/Action';

export default async function FetchData({
  id,
  page,
  search,
}: {
  id: string;
  page?: string;
  search?: string;
}) {
  const currentPage = page ? parseInt(page) : 1;

  const [questionsData, chapters, categoryChaptersResult] = await Promise.all([
    fetchDataQuestion(id, currentPage, 10, search),
    fetchDataChapterAction(id),
    fetchCategoryChapter(),
  ]);

  const categoryChapters = categoryChaptersResult.success ? categoryChaptersResult.data : [];

  return (
    <div>
      <ExamQuestionsPage
        productId={id}
        questionsData={questionsData}
        chapters={chapters}
        categoryChapters={categoryChapters}
      />
    </div>
  );
}
