import PasswordResetForm from '@/components/myPage/PasswordResetForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '비밀번호 변경',
  description: '비밀번호 변경 페이지',
};

const PasswordResetPage = () => {
  return (
    <div className='flex flex-col px-4 gap-24'>
      <div className='flex items-center py-4 relative'>
        <span className='text-gray-900 text-label_md mx-auto'>비밀번호 재설정</span>
      </div>
      <PasswordResetForm />
    </div>
  );
};

export default PasswordResetPage;
