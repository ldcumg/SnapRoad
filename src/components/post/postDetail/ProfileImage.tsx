import React from 'react';

interface ProfileImageProps {
  profileImageUrl: string | null;
  size: 'small' | 'medium';
}

// 게시글 이미지 40px
// 댓글 이미지 32px
const ProfileImage = ({ profileImageUrl, size }: ProfileImageProps) => {
  const imageSize = {
    small: 'w-8 h-8', // 32px
    medium: 'w-10 h-10', // 40px
  };

  return (
    <div className={`${imageSize[size]} overflow-hidden rounded-full`}>
      <img
        alt='프로필 이미지'
        src={profileImageUrl || '/svgs/Profile.svg'} // 이 글을 쓴 사람
        className='h-full w-full object-cover'
      />
    </div>
  );
};

export default ProfileImage;
