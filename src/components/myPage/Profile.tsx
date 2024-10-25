'use client';

import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { useUploadImage } from '@/hooks/queries/byUse/useStorageMutation';
import { useGetProfileImageUrl } from '@/hooks/queries/byUse/useStorageQueries';
import { uploadProfileImage } from '@/services/client-action/storageAction';
import { updateProfile } from '@/services/server-action/profilesAction';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const [isEditMode, setIdEditMode] = useState<boolean>(false);
  const [newNickname, setNewNickname] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>(''); // 미리보기 이미지
  const [newImage, setNewImage] = useState<File>(); // 첨부한 이미지

  // 1. 프로필 정보 조회(user_image_url) 사진명이 들어가있음
  const { data: profileData, isLoading: profileLoading, isError } = useProfilesQuery(userId);

  // 2. 디비의 user_image_url (사진명) 으로 이미지 url 얻기
  const { data: profileImageUrl, isLoading: imageLoading, error: imageError } = useGetProfileImageUrl(profileData);

  console.log('Profile profileImageUrl :>> ', profileImageUrl);

  /** 미리보기 */
  const createPreviewImage = (file: File) => {
    console.log('createPreviewImage');
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setNewImage(file);
  };

  //   const { mutate: uploadProfileImage } = useUploadImage();

  /** 프로필 수정 */
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    console.log('previewImage :>> ', previewImage);
    console.log('newImage :>> ', newImage);
    e.preventDefault();

    let imageName = crypto.randomUUID();

    console.log('newImage :>> ', newImage);
    // 스토리지 업데이트
    await uploadProfileImage(imageName, newImage, 'avatars');

    // 유저 정보 업데이트
    newNickname
      ? await updateProfile(userId, imageName, newNickname)
      : await updateProfile(userId, imageName, profileData?.[0].user_nickname);

    setIdEditMode(false);
  };

  if (profileLoading || imageLoading) return <>loading...</>;
  //   if (profileImageUrl === undefined) return <>이미지 불러오는중</>;

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
              src={profileImageUrl}
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
              type='file'
              onChange={(e) => createPreviewImage(e.target.files?.[0])}
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
            <Image
              alt='프로필 이미지'
              src={profileImageUrl}
              height={100}
              width={100}
            />
          </div>
          <span>{profileData?.[0].user_nickname || '닉네임 없음'}</span>
          <button onClick={() => setIdEditMode(true)}>프로필 수정</button>
          <Link href={'/mypage/account-setting'}>계정설정</Link>
        </>
      )}
    </div>
  );
};

export default Profile;
