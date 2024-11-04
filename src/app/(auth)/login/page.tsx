import LoginForm from '@/components/auth/LoginForm';
import LoginOptions from '@/components/auth/LoginOptions';
import SocialLogin from '@/components/auth/SocialLogin';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인 페이지',
  description: '로그인 페이지 입니다.',
};

const LoginPage = () => {
  return (
    <div className='flex flex-col gap-8 px-4 mt-10 mb-16'>
      <div className='flex justify-center'>
        <img
          src='/svgs/Logo_Big.svg'
          alt='로고'
        />
      </div>
      <LoginForm />
      <div className='flex justify-center'>
        <span className='text-gray-900 text-label_sm'>소셜 계정으로 로그인</span>
      </div>
      <SocialLogin />
      <LoginOptions />
    </div>
  );
};

export default LoginPage;
