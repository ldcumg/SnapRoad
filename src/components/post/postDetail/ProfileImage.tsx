import React from 'react';

interface ProfileImageProps {
  profileImageUrl: string | null;
  width: string;
  height: string;
}

const ProfileImage = ({ profileImageUrl, width, height }: ProfileImageProps) => {
  return (
    <div className={`h-[${height}] w-[${width}] overflow-hidden rounded-full`}>
      <img
        alt='프로필 이미지'
        src={profileImageUrl || '/svgs/Profile.svg'} // 이 글을 쓴 사람
        className='h-full w-full object-cover'
      />
    </div>
  );
};

export default ProfileImage;
