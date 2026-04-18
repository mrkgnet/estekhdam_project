
import React from 'react'
import ShowDataChapter from './ShowDataChapter'
import { fetchDataChapterAction } from '@/actions/admin/chapter/Actionst'

export default async  function FetchDataChapter({ id }: { id: string }) {

  const chapters = await fetchDataChapterAction(id)
 


  return (
    <div>
      <ShowDataChapter chapters = {chapters}  productId={id} />
    </div>
  )
}
