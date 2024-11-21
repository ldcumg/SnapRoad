'use client';

import { useProfilesQuery } from '@/hooks/queries/profiles/useProfilesQueries';
import IconSetting from '@/lib/icon/Icon_Setting';
import { Button } from '@/stories/Button';
import Spinner from '@/stories/Spinner';
import Link from 'next/link';
import React from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useProfilesQuery(userId);

  if (isProfileError) throw new Error('프로필 조회 오류');
  if (isProfileLoading)
    return (
      <div className='absolute z-[3000] flex h-full w-full items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <div className='m-auto mb-16 mt-12 flex w-full max-w-[23rem] flex-col items-center'>
      <div className='h-[184px] w-[184px] overflow-hidden rounded-full'>
        <img
          alt='프로필 이미지'
          src={profileData?.profileImageUrl || '/svgs/Profile.svg'}
          className='h-full w-full object-cover'
        />
      </div>
      <span className='mt-6 text-title_xl text-black'>{profileData?.profiles.user_nickname || '닉네임 없음'}</span>
      <span className='mt-2 text-body_lg text-black'>{profileData?.profiles.user_email}</span>
      <div className='mt-8'>
        <Link href={'/mypage/edit'}>
          <Button
            type='button'
            variant='outlineGray'
            label='프로필 수정'
            size='small'
          >
            <IconSetting />
            {/* <img
              alt='프로필 수정'
              src={'/svgs/Setting.svg'}
              className='h-full w-full object-cover'
            /> */}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
