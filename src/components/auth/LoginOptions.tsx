'use client';

import Link from 'next/link';
import React from 'react';

const LoginOptions = () => {
  return (
    <div className='flex justify-center gap-6'>
      <Link
        className='text-gray-700 text-body_md'
        href={'/mypage/password-reset'}
      >
        비밀번호 찾기
      </Link>
      <Link
        className='text-gray-700 text-label_md'
        href={'/signup'}
      >
        회원가입
      </Link>
    </div>
  );
};

export default LoginOptions;
