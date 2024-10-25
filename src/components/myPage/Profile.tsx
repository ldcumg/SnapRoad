'use client';

import { useUpdateProfile } from '@/hooks/queries/byUse/useProfileMutation';
import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { useUploadImage } from '@/hooks/queries/byUse/useStorageMutation';
import { useGetProfileImageUrl } from '@/hooks/queries/byUse/useStorageQueries';
// import { uploadProfileImage } from '@/services/client-action/storageAction';
// import { updateProfile } from '@/services/server-action/profilesAction';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/**
 * 유저의 프로필 이미지는 보안을 위해 supabase 의 private bucket 에 저장
 * private 에 있는 이미지는 유효기간이 있어서 매 요청마다 url 을 새로 생성해야함(signed url)
 *
 */
const Profile = ({ userId }: { userId: string }) => {
  const [isEditMode, setIdEditMode] = useState<boolean>(false);
  const [newNickname, setNewNickname] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File>();

  // 1. 프로필 정보 조회(user_image_url) 사진명이 들어가있음
  const { data: profileData, isLoading: profileLoading, isError } = useProfilesQuery(userId);

  /**
   * 2. 디비의 user_image_url (사진명) 으로 이미지 url 얻기
   * 1번에서 사용자 정보를 불러왔으면, profiles 의 user_image_url 이 null 인지 아닌지에 따라 분기처리됨
   * null : public 버킷에 있는 default 이미지를 불러옴
   * null 아님 : 해당 이미지명으로 private 에 있는 사진을 찾아서 signed url 로 만들어서 줌
   */
  const { data: profileImageUrl, isLoading: imageLoading, error: imageError } = useGetProfileImageUrl(profileData);

  useEffect(() => {
    if (profileData && profileData[0]?.user_nickname) {
      setNewNickname(profileData[0].user_nickname);
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

    // 버킷에 업로드
    uploadProfileImage({ imageName, newImage, storage });

    // 유저 정보 업데이트
    updateProfile({
      userId,
      imageName,
      newNickname,
    });

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
