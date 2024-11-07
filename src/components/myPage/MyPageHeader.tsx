'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const MyPageHeader = ({ url }: { url: string }) => {
  const router = useRouter();
  return (
    <img
      src='/svgs/Logo.svg'
      alt='Image'
      className='absolute left-0'
      onClick={() => router.push(url)}
    />
  );
};

export default MyPageHeader;
