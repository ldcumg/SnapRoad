'use client';

import { useProfileForm } from '@/hooks/byUse/useProfileForm';
import { useUpdateProfile } from '@/hooks/queries/byUse/useProfileMutation';
import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { useUploadImage } from '@/hooks/queries/byUse/useStorageMutation';
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
        imageName: profileData?.profiles?.[0]?.user_image_url!,
        newNickname: value.nickname,
      });
    }
    router.push('/mypage');
  };

  if (isProfileError) return <>오류...</>;
  if (isProfileLoading) return <>로딩중...</>;

  // TODO 분리
  return (
    <div className='flex flex-col mt-12'>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className='flex flex-col items-center'>
          <div className='relative w-[184px] h-[184px]'>
            <div className='w-full h-full overflow-hidden rounded-full '>
              <img
                alt={'프로필 이미지'}
                src={previewImage || profileData?.profileImageUrl || '/svgs/Profile.svg'}
                className='object-cover w-full h-full'
              />
            </div>
            <div className='flex justify-center items-center w-[48px] h-[48px] bg-white rounded-full shadow-md absolute bottom-0 right-0 '>
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
        {/* TODO 작업중 */}
        <div className='mt-14 flex flex-col'>
          <div className='relative'>
            <input
              {...register('nickname', {
                onChange: (e) => {
                  setCount(e.target.value.length);
                },
              })}
              className='border-b border-gray-100 w-full text-body_lg text-gray-900'
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
              <span className='text-gray-900 text-body_sm'>{count}/10</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col py-4 mt-60'>
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
