'use client';

import URLS from '@/constants/urls';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { IconLogoBig } from '@/lib/icon/Icon_Logo_Big';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const LoginHeader = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  return (
    <>
      {desktop ? (
        <>
          <div className='flex flex-row justify-between py-2'>
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
          <span className='mb-8 flex justify-center text-title_xl text-gray-900'>로그인</span>
        </>
      ) : (
        <div className='mb-8 mt-10 flex justify-center'>
          <IconLogoBig />
        </div>
      )}
    </>
  );
};

export default LoginHeader;
