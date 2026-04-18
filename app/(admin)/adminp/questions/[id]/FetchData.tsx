import React from 'react'
import ExamQuestionsPage from './ShowData'
import { fetchDataQuestion } from '@/actions/admin/questions/Actions'
import { fetchDataChapterAction } from '@/actions/admin/chapter/Actionst';

export default  async function FetchData({id}:{id:string}) {
    
    const [initialQuestions ,chapters]= await Promise.all([
    fetchDataQuestion(id),
    fetchDataChapterAction(id)
  ]);
  
  return (
    <div>
     <ExamQuestionsPage
      productId={id}
      initialQuestions={initialQuestions}
      chapters={chapters} // 👈 سرفصل‌ها را به عنوان prop جدید پاس می‌دهیم
    />
    </div>
  )
}
