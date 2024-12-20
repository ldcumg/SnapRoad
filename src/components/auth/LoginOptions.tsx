'use client';

import Link from 'next/link';
import React from 'react';

const LoginOptions = () => {
  return (
    <div className='flex items-center justify-center gap-3'>
      <Link
        className='text-body_md text-gray-700'
        href={'/mypage/password'}
      >
        비밀번호 찾기
      </Link>
      <span className='text-gray-300'>•</span>
      <Link
        className='text-label_md text-gray-700'
        href={'/signup'}
      >
        회원가입
      </Link>
    </div>
  );
};

export default LoginOptions;
