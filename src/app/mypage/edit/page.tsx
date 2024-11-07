import MyPageHeader from '@/components/myPage/MyPageHeader';
import ProfileUpdate from '@/components/myPage/ProfileUpdate';
import URLS from '@/constants/urls';
import { getSession } from '@/services/server-action/authActions';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '마이페이지 수정',
  description: '마이페이지 수정페이지 입니다.',
};

const MyPageEditPage = async () => {
  const user = await getSession();

  return (
    <div className='px-4'>
      <div className='relative flex items-center py-4'>
        <MyPageHeader url={URLS.groupList} />
        <span className='mx-auto text-label_md text-gray-900'>마이페이지</span>
      </div>
      <ProfileUpdate userId={user?.id!} />
    </div>
  );
};

export default MyPageEditPage;
