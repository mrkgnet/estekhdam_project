import React from 'react'
import TabHomeFetchData from './TabHomeFetchData'

type Props = {
  searchParams?: Promise<{ category?: string }>
}

export default async function TabHomeComponent({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {}
  const category = resolvedParams.category

  return <TabHomeFetchData category={category} />
}