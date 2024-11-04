import ProfileUpdate from '@/components/myPage/ProfileUpdate';
import { getSession } from '@/services/server-action/authActions';
import { Button } from '@/stories/Button';
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
      <div className='flex items-center py-4 relative'>
        <img
          src='/svgs/Logo.svg'
          alt='Image'
          className='absolute left-0'
        />
        <span className='text-gray-900 text-label_md mx-auto'>마이페이지</span>
      </div>
      <ProfileUpdate userId={user?.id!} />
    </div>
  );
};

export default MyPageEditPage;
