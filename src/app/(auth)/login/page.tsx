import LoginForm from '@/components/auth/LoginForm';
import LoginOptions from '@/components/auth/LoginOptions';
import SocialLogin from '@/components/auth/SocialLogin';
import { IconLogoBig } from '@/lib/icon/Icon_Logo_Big';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인 페이지',
  description: '로그인 페이지 입니다.',
};

const LoginPage = () => {
  return (
    <div className='mb-16 mt-10 flex flex-col gap-8 px-4'>
      <div className='flex justify-center'>
        <IconLogoBig />
      </div>
      <LoginForm />
      <div className='flex justify-center'>
        <span className='text-label_sm text-gray-900'>소셜 계정으로 로그인</span>
      </div>
      <SocialLogin />
      <LoginOptions />
    </div>
  );
};

export default LoginPage;
