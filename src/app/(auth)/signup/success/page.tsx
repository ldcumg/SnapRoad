import { Button } from '@/stories/Button';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: '회원가입 완료 페이지',
  description: '회원가입  완료 페이지 입니다.',
};

const SignUpSuccessPage = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-7 px-4 h-screen'>
      <div>
        <img src='/svgs/Success.svg' />
      </div>
      <p className='text-gray-900 text-head_sm'>회원가입이 완료되었어요!</p>
      <div className='flex gap-4 py-5 w-full'>
        <Link
          href={'/'}
          className='w-full'
        >
          <Button
            type='button'
            label='홈으로'
            variant='outlineGray'
            size='medium'
            className='w-full'
          />
        </Link>
        <Link
          href={'/login'}
          className='w-full '
        >
          <Button
            type='button'
            label='로그인'
            variant='primary'
            size='medium'
            className='w-full'
          />
        </Link>
      </div>
    </div>
  );
};

export default SignUpSuccessPage;
