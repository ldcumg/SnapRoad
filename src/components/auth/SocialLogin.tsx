'use client';

import { signInWithOAuth } from '@/services/client-action/socialAuthAction';
import React from 'react';

const SocialLogin = () => {
  return (
    <div className='flex justify-center gap-6'>
      <button
        type='button'
        onClick={() => signInWithOAuth('kakao')}
      >
        <img
          src='/svgs/Kakao_login.svg'
          alt='카카오 로그인'
        />
      </button>
      <button
        onClick={() => signInWithOAuth('google')}
        type='button'
      >
        <img
          src='/svgs/Google_login.svg'
          alt='구글 로그인'
        />
      </button>
      <button
        onClick={() => signInWithOAuth('github')}
        type='button'
      >
        <img
          src='/svgs/Github_login.svg'
          alt='깃허브 로그인'
        />
      </button>
    </div>
  );
};

export default SocialLogin;
