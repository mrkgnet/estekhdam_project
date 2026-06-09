import React from 'react';
import FetchDataFreeResource from './FetchDataFreeResource';

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;

  return (
    <FetchDataFreeResource searchParams={resolvedParams} />
  );
}
