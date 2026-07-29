import React from 'react'
import TabHomeFetchData from './TabHomeFetchData'

type Props = {
  searchParams?: Promise<{ category?: string }>
}

export default async function TabHomeComponent({ searchParams }: Props) {
  // اگر searchParams فرستاده نشده باشد، یک آبجکت خالی در نظر می‌گیرد تا undefined نشود
  const resolvedParams = searchParams ? await searchParams : {}
  const category = resolvedParams.category || 'BuyDeposit'

  return <TabHomeFetchData category={category} />
}