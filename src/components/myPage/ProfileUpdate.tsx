'use client';

import { useUploadImage } from '@/hooks/queries/byUse/useStorageMutation';
import { useUpdateProfile } from '@/hooks/queries/profiles/useProfileMutation';
import { useProfilesQuery } from '@/hooks/queries/profiles/useProfilesQueries';
import { useProfileForm } from '@/hooks/useCustomForm/useProfileForm';
import { Button } from '@/stories/Button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

const ProfileUpdate = ({ userId }: { userId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useProfileForm();

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [count, setCount] = useState<number>(0);

  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useProfilesQuery(userId);

  useEffect(() => {
    if (profileData && profileData.profiles?.user_nickname) {
      setValue('nickname', profileData.profiles.user_nickname);
      setCount(profileData.profiles.user_nickname.length);
    }
  }, [profileData]);

  /** 미리보기 */
  const createPreviewImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setNewImage(file);
  };

  const handleDeleteNewNickname = () => {
    setValue('nickname', '');
    setCount(0);
  };

  const { mutate: uploadProfileImage } = useUploadImage();
  const { mutate: updateProfile } = useUpdateProfile();

  /** 프로필 수정 */
  // TODO 더 깔끔하게 개선..
  const handleUpdateProfile = async (value: FieldValues) => {
    let imageName = crypto.randomUUID(); // TODO 변경
    const storage = 'avatars';

    if (newImage) {
      uploadProfileImage({ imageName, newImage: newImage!, storage });

      updateProfile({
        userId,
        imageName,
        newNickname: value.nickname,
      });
    } else {
      updateProfile({
        userId,
        imageName: profileData?.profiles?.user_image_url!,
        newNickname: value.nickname,
      });
    }
    router.push('/mypage');
  };

  if (isProfileError) return <>오류...</>;
  if (isProfileLoading) return <>로딩중...</>;

  // TODO 분리
  return (
    <div className='m-auto mt-12 flex w-full max-w-[23rem] flex-col'>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className='flex flex-col items-center'>
          <div className='relative h-[184px] w-[184px]'>
            <div className='h-full w-full overflow-hidden rounded-full'>
              <img
                alt={'프로필 이미지'}
                src={previewImage || profileData?.profileImageUrl || '/svgs/Profile.svg'}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='absolute bottom-0 right-0 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white shadow-md'>
              <label
                htmlFor='file'
                className='cursor-pointer'
              >
                <img
                  src='/svgs/cameraIcon.svg'
                  alt='파일 첨부 이미지'
                />
              </label>
              <input
                id='file'
                className='hidden'
                accept='image/*'
                type='file'
                onChange={(e) => createPreviewImage(e.target.files?.[0]!)}
              />
            </div>
          </div>
        </div>
        <div className='mt-14 flex flex-col'>
          <div className='relative'>
            <input
              {...register('nickname', {
                onChange: (e) => {
                  setCount(e.target.value.length);
                },
              })}
              className='w-full border-b border-gray-100 text-body_lg text-gray-900'
              maxLength={10}
            />
            <p className='text-red-500'>{errors.nickname && String(errors.nickname.message)}</p>
            <div className='absolute right-3 top-0 flex items-center gap-2'>
              <button
                type='button'
                onClick={handleDeleteNewNickname}
              >
                <img src='/svgs/Close_Circle.svg' />
              </button>
              <span className='text-body_sm text-gray-900'>{count}/10</span>
            </div>
          </div>
        </div>

        <div className='mt-52 flex flex-col py-4'>
          <Button
            type='submit'
            label='수정 완료'
            variant='primary'
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
