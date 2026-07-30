import React, { Suspense } from 'react'
import TabHomePage from './TabHomePage'
import { GetCategoriDataAction } from '@/actions/category/Actions'

type Props = {
  category: string
}



async function DataFetcher({ category }: Props) {
  const result = await GetCategoriDataAction(category)
  return <TabHomePage initialData={result?.data || []} />
}

export default function TabHomeFetchData({ category }: Props) {
  return (
 
      <DataFetcher category={category} />
    
  )
}

