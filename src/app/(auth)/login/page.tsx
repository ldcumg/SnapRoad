import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인 페이지',
  description: '로그인 페이지',
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
