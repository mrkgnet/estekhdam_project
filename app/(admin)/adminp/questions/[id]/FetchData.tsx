import React from 'react'
import ExamQuestionsPage from './ShowData'
import { fetchDataQuestion } from '@/actions/admin/questions/Actions'
import { fetchDataChapterAction } from '@/actions/admin/chapter/Actionst';
import { fetchCategoryChapter } from '@/actions/admin/category_chapter/fetch/Action';

export default async function FetchData({id}:{id:string}) {
    
  const [initialQuestions, chapters, categoryChaptersResult] = await Promise.all([
    fetchDataQuestion(id),
    fetchDataChapterAction(id),
    fetchCategoryChapter()
  ]);
  
  const categoryChapters = categoryChaptersResult.success ? categoryChaptersResult.data : [];
  
  return (
    <div>
      <ExamQuestionsPage
        productId={id}
        initialQuestions={initialQuestions}
        chapters={chapters}
        categoryChapters={categoryChapters}
      />
    </div>
  )
}
