'use client';

import { useUpdateProfile } from '@/hooks/queries/byUse/useProfileMutation';
import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { useUploadImage } from '@/hooks/queries/byUse/useStorageMutation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const [isEditMode, setIdEditMode] = useState<boolean>(false);
  const [newNickname, setNewNickname] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);

  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useProfilesQuery(userId);

  useEffect(() => {
    if (profileData && profileData.profiles[0]?.user_nickname) {
      setNewNickname(profileData.profiles[0].user_nickname);
    }
  }, [profileData]);

  /** 미리보기 */
  const createPreviewImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setNewImage(file);
  };

  const { mutate: uploadProfileImage } = useUploadImage();
  const { mutate: updateProfile } = useUpdateProfile();

  /** 프로필 수정 */
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let imageName = crypto.randomUUID();
    const storage = 'avatars';

    if (newImage) {
      uploadProfileImage({ imageName, newImage: newImage!, storage });

      updateProfile({
        userId,
        imageName,
        newNickname,
      });
    } else {
      updateProfile({
        userId,
        imageName: profileData?.profiles?.[0]?.user_image_url!,
        newNickname,
      });
    }

    setIdEditMode(false);
  };

  if (isProfileError) return <>오류...</>;
  if (isProfileLoading) return <>로딩중...</>;

  return (
    <div className='flex flex-col items-center gap-5'>
      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          {previewImage ? (
            <div>
              <Image
                alt='미리보기 이미지'
                src={previewImage}
                height={100}
                width={100}
              />
            </div>
          ) : (
            <Image
              alt='프로필 이미지'
              src={profileData?.profileImageUrl!}
              height={100}
              width={100}
            />
          )}

          {/* 사진 첨부 */}
          <div>
            <label
              htmlFor='file'
              className='cursor-pointer	'
            >
              <div>파일첨부</div>
            </label>
            <input
              id='file'
              className='hidden'
              accept='image/*'
              type='file'
              onChange={(e) => createPreviewImage(e.target.files?.[0]!)}
            />
          </div>
          {/* 닉네임 */}
          <input
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
          <button type='submit'>완료</button>
        </form>
      ) : (
        <>
          {/* 읽기모드 */}
          <div>
            {profileData?.profileImageUrl ? (
              <Image
                alt='프로필 이미지'
                src={profileData?.profileImageUrl!}
                height={100}
                width={100}
              />
            ) : null}
          </div>
          <span>{profileData?.profiles[0].user_nickname || '닉네임 없음'}</span>
          <button onClick={() => setIdEditMode(true)}>프로필 수정</button>
          <Link href={'/mypage/account-setting'}>계정설정</Link>
        </>
      )}
    </div>
  );
};

export default Profile;
