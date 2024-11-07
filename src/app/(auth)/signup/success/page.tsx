import URLS from '@/constants/urls';
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
    <div className='flex h-screen flex-col items-center justify-center gap-7 px-4'>
      <div>
        <img src='/svgs/Success.svg' />
      </div>
      <p className='text-head_sm text-gray-900'>회원가입이 완료되었어요!</p>
      <div className='flex w-full gap-4 py-5'>
        <Link
          href={URLS.home}
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
          href={URLS.logIn}
          className='w-full'
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
