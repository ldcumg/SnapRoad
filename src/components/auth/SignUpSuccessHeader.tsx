'use client';

import URLS from '@/constants/urls';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SignUpSuccessHeader = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  return (
    <>
      {desktop ? (
        <Link href={URLS.home}>
          <img
            src='/svgs/Logo.svg'
            alt='로고'
          />
        </Link>
      ) : null}
    </>
  );
};

export default SignUpSuccessHeader;
