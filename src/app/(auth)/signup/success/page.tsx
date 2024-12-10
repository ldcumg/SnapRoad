import SignUpSuccessHeader from '@/components/auth/SignUpSuccessHeader';
import URLS from '@/constants/urls';
import { IconSuccess } from '@/lib/icon/Icon_ Success';
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
    <div className='py-2'>
      <SignUpSuccessHeader />
      <div className='m-auto flex h-screen w-full max-w-[23rem] flex-col items-center justify-center gap-7 px-4'>
        <div>
          <IconSuccess />
        </div>
        <p className='text-head_sm text-gray-900'>회원가입이 완료되었어요!</p>
        <div className='mb-8 flex w-full gap-4 py-5'>
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
    </div>
  );
};

export default SignUpSuccessPage;
