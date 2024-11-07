'use client';

import { signInWithOAuth } from '@/services/client-action/socialAuthAction';
import React from 'react';

const SocialLogin = () => {
  return (
    <div className='flex justify-center gap-6'>
      <img
        src='/svgs/Kakao_login.svg'
        alt='카카오 로그인'
        onClick={() => signInWithOAuth('kakao')}
        width={42}
        height={42}
        className='cursor-pointer'
      />
      <img
        src='/svgs/Google_login.svg'
        alt='구글 로그인'
        onClick={() => signInWithOAuth('google')}
        width={42}
        height={42}
        className='cursor-pointer'
      />
      <img
        src='/svgs/Github_login.svg'
        alt='깃허브 로그인'
        onClick={() => signInWithOAuth('github')}
        width={42}
        height={42}
        className='cursor-pointer'
      />
    </div>
  );
};

export default SocialLogin;
