import MyPageBack from '@/components/myPage/MyPageBack';
import PasswordResetInfo from '@/components/myPage/PasswordResetInfo';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '비밀번호 변경 안내',
  description: '비밀번호 변경 안내 페이지',
};

const PasswordResetInfoPage = () => {
  return (
    <div className='px-4'>
      <div className='flex items-center py-4 relative'>
        <MyPageBack />
        <span className='text-gray-900 text-label_md mx-auto'>비밀번호 찾기 · 변경</span>
      </div>
      <div className='flex flex-col items-center mt-24 mb-10'>
        <span className='text-gray-900 text-label_md'>가입시 사용했던 이메일 주소를 입력해주세요!</span>
        <span className='text-gray-900 text-label_md'>비밀번호 재설정 링크를 전송해 드립니다.</span>
      </div>
      <PasswordResetInfo />
    </div>
  );
};

export default PasswordResetInfoPage;
