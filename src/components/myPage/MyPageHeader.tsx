'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

const MyPageHeader = ({ url }: { url: string }) => {
  const router = useRouter();
  return (
    <Link href={'./'} className='absolute left-0'>
    <img
      src='/svgs/Logo.svg'
      alt='Image'
      onClick={() => router.push(url)}
      />
      </Link>
  );
};

export default MyPageHeader;
