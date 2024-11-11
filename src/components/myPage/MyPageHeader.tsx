'use client';

import Link from 'next/link';
import React from 'react';

const MyPageHeader = ({ url }: { url: string }) => {
  return (
    <Link
      href={url}
      className='absolute left-0'
    >
      <img
        src='/svgs/Logo.svg'
        alt='Image'
      />
    </Link>
  );
};

export default MyPageHeader;
