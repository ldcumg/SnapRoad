import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginOptions from '@/components/auth/LoginOptions';
import SocialLogin from '@/components/auth/SocialLogin';
import { IconLine } from '@/lib/icon/Icon_line';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인 페이지',
  description: '로그인 페이지 입니다.',
};

const LoginPage = () => {
  return (
    <div className='px-4'>
      <LoginHeader />
      <div className='mb-16 flex flex-col gap-8'>
        <LoginForm />
        <div className='flex items-center justify-center'>
          <IconLine />
          <span className='mx-3 text-label_sm text-gray-900'>소셜 계정으로 로그인</span>
          <IconLine />
        </div>
        <SocialLogin />
        <LoginOptions />
      </div>
    </div>
  );
};

export default LoginPage;
