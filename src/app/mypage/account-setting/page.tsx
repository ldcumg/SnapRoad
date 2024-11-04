import AccountSetting from '@/components/myPage/AccountSetting';
import MyPageBack from '@/components/myPage/MyPageBack';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '계정 설정',
  description: '계정 설정페이지 입니다.',
};

const AccountSettingPage = () => {
  return (
    <div className='px-4'>
      <div className='flex items-center py-4 relative'>
        <MyPageBack />
        <span className='text-gray-900 text-label_md mx-auto'>계정설정</span>
      </div>
      <AccountSetting />
    </div>
  );
};

export default AccountSettingPage;
