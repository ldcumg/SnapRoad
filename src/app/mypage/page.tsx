import MyPageOptions from '@/components/myPage/MyPageOptions';
import Profile from '@/components/myPage/Profile';
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
      {/* TODO 수정페이지랑 공통 레이아웃 */}
      <div className='flex flex-col px-4'>
        <div className='flex items-center py-4 relative'>
          <img
            src='/svgs/Logo.svg'
            alt='Image'
            className='absolute left-0'
          />
          <span className='text-gray-900 text-label_md mx-auto'>마이페이지</span>
        </div>
        <Profile userId={user?.id!} />
      </div>
      <MyPageOptions />
    </>
  );
};

export default MyPage;
