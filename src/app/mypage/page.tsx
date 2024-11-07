import MyPageHeader from '@/components/myPage/MyPageHeader';
import MyPageOptions from '@/components/myPage/MyPageOptions';
import Profile from '@/components/myPage/Profile';
import URLS from '@/constants/urls';
import { getSession } from '@/services/server-action/authActions';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '마이페이지 입니다.',
};

const MyPage = async () => {
  const user = await getSession();

  return (
    <>
      <div className='flex flex-col px-4'>
        <div className='relative flex items-center py-4'>
          <MyPageHeader url={URLS.groupList} />
          <span className='mx-auto text-label_md text-gray-900'>마이페이지</span>
        </div>
        <Profile userId={user?.id!} />
      </div>
      <MyPageOptions />
    </>
  );
};

export default MyPage;
