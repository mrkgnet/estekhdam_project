import React from 'react'
import TabHomePage from './hi'
import { GetCategoriDataAction } from '@/actions/category/Actions'

type Props = {
  category: string
}

export default async function DataFetcher({ category }: Props) {
  const result = await GetCategoriDataAction(category)
  return <TabHomePage initialData={result?.data || []} />
}