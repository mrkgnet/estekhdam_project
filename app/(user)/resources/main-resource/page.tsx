import React from 'react';

import FetchDataMainResource from './FetchDataMainResource';

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;

  return (
    <FetchDataMainResource searchParams={resolvedParams} />
  );
}
