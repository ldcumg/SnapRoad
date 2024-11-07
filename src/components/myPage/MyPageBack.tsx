'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const MyPageBack = () => {
  const router = useRouter();

  return (
    <img
      src='/svgs/Arrow_Back_LG.svg'
      alt='뒤로가기'
      className='absolute left-0 cursor-pointer'
      onClick={() => router.back()}
    />
  );
};

export default MyPageBack;
