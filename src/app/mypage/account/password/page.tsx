import PasswordChangeForm from '@/components/myPage/PasswordChangeForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '비밀번호 변경 페이지',
  description: '비밀번호 변경 페이지',
};

const PasswordChange = () => {
  return <PasswordChangeForm />;
};

export default PasswordChange;
