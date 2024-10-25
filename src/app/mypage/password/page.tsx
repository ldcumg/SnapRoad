import PasswordResetInfo from '@/components/myPage/PasswordResetInfo';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '비밀번호 변경 안내 페이지',
  description: '비밀번호 변경 안내 페이지',
};

const PasswordResetInfoPage = () => {
  return <PasswordResetInfo />;
};

export default PasswordResetInfoPage;
