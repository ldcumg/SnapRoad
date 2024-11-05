'use client';

import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { Button } from '@/stories/Button';
import Link from 'next/link';
import React from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useProfilesQuery(userId);

  if (isProfileError) return <>오류...</>;
  if (isProfileLoading) return <>로딩중...</>;

  return (
    <div className='flex flex-col items-center mt-12 mb-16'>
      <div className='w-[184px] h-[184px] overflow-hidden rounded-full'>
        <img
          alt='프로필 이미지'
          src={profileData?.profileImageUrl || '/svgs/Profile.svg'}
          className='object-cover w-full h-full'
        />
      </div>
      <span className='mt-6 text-black text-title_xl'>{profileData?.profiles[0].user_nickname || '닉네임 없음'}</span>
      <span className='mt-2 text-black text-body_lg'>{profileData?.profiles[0].user_email}</span>
      <div className='mt-8'>
        <Link href={'/mypage/edit'}>
          <Button
            type='button'
            variant='outlineGray'
            label='프로필 수정'
            size='small'
          >
            <img
              alt='프로필 수정'
              src={'/svgs/Setting.svg'}
              className='object-cover w-full h-full'
            />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
