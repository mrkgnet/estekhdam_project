import { Suspense } from 'react'
import LinearLoader from '@/components/LinearLoader'
import FetchDataUser from './FetchData'
import { Loader2 } from 'lucide-react';
import SpinerLoader from '@/components/SpinerLoader';

// 👇 در نکست 15 این بخش Promise است





export default async function page({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; query?: string }> 
}) {

  // 👇 اضافه کردن await برای خواندن پارامترها
  const params = await searchParams;

  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const limit = 10; 

  return (
    
      <FetchDataUser currentPage={currentPage} searchQuery={searchQuery} limit={limit} />
    
  )
}
