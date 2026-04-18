import React from 'react'
import ShowData from './ShowData'
import { fetchDataUnicJobNews } from '@/actions/user/jobnews/government/unicJobNews/fetch/Actions'






export default async function FetchData({ slug }: { slug: string }) {
 
  const getUnicNews = await fetchDataUnicJobNews(slug)


  return (

    <>
      <ShowData initialNews={getUnicNews} />
    </>
  )
}
