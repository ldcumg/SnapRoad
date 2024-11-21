'use client';

import URLS from '@/constants/urls';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SignUpHeader = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  return (
    <>
      {desktop ? (
        <div className='flex flex-row justify-between'>
          <Link
            href={URLS.home}
            className='flex items-center justify-center'
          >
            <img
              src='/svgs/Logo.svg'
              alt='로고'
            />
          </Link>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4 pb-5 pt-10'>
          <IconLogo />
        </div>
      )}
      <div className='flex flex-col items-center gap-4 pb-5'>
        <span className='text-title_xl text-gray-900'>회원가입</span>
      </div>
    </>
  );
};

export default SignUpHeader;
