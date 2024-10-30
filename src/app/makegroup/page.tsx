'use client';

import { useMakeGroupForm } from '@/hooks/byUse/useGroupForm';
import {
  useInsertGroupMutation,
  useInsertUserGroupMutation,
  useUpdateGroupMutation,
} from '@/hooks/queries/byUse/useGroupMutations';
import { useGroupDetailQueryForUpdate } from '@/hooks/queries/byUse/useGroupQueries';
import { makeGroupDataForUpdate, makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import browserClient from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

type Props = {
  searchParams: { update_for?: string };
};

const MakeGroupPage = ({ searchParams: { update_for } }: Props) => {
  const { register, handleSubmit, formState, watch, reset } = useMakeGroupForm();
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const { isError: insertGroupDataError, mutateAsync: insertGroupDataMutate } = useInsertGroupMutation();
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();

  const { isError: updateGroupDataError, mutateAsync: updateGroupDataMutate } = useUpdateGroupMutation(update_for);

  const onSubmit = async (value: FieldValues) => {
    //TODO - 파일 확장자 관련 유효성 검사 필요
    const imageFile: File | null = value.groupImg && value?.groupImg[0];
    if (update_for) {
      const groupObj = makeGroupDataForUpdate(value, update_for);
      await updateGroupDataMutate({ groupObj, groupImg: imageFile });
    } else {
      const groupObj = makeGroupDataToObj(value);
      await insertGroupDataMutate({ groupObj, groupImg: imageFile });
      //TODO - user관련 store생성 후 userId 수정 필요
      const { data } = await browserClient.auth.getUser();
      if (data.user?.id) {
        const userGroupObj = makeUserGroupDataToObj(data.user?.id, true, groupObj.group_id);
        insertUserGroupMutate(userGroupObj);
      }
    }
  };

  const urlToFileList = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'group_image.jpg', { type: blob.type });

    // FileList 객체 생성
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const { data: groupDetailData, isPending } = useGroupDetailQueryForUpdate(update_for);

  useEffect(() => {
    const fillGroupData = async () => {
      if (groupDetailData && groupDetailData.group_image_url) {
        const fileList = await urlToFileList(groupDetailData.group_image_url);
        reset({
          groupTitle: groupDetailData.group_title,
          groupDesc: groupDetailData.group_desc,
          groupImg: fileList as unknown as null,
        });
      }
    };
    fillGroupData();
  }, [groupDetailData]);

  const groupTitleLen = watch('groupTitle').length;
  const groupDescLen = watch('groupDesc').length;
  const groupThumbnail = watch('groupImg') as FileList | null;
  useEffect(() => {
    if (groupThumbnail && groupThumbnail.length) {
      setImgPreview(URL.createObjectURL(groupThumbnail['0']));
    }
  }, [groupThumbnail]);

  if (insertGroupDataError || insertUserGroupError || updateGroupDataError) throw new Error('에러 발생!');
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col justify-center items-center gap-[30px]'
    >
      <div>
        <label htmlFor='group_image'>
          {imgPreview ? (
            <div className='relative flex justify-center items-center w-[182px] h-[182px]'>
              <img
                src={imgPreview}
                alt='업로드 그룹 썸네일 이미지'
                className='flex justify-center items-center w-[130px] h-[130px] border-[2px] border-black border-solid'
              />
              <div className='absolute bottom-0 right-0 w-[52px] h-[52px] flex justify-center items-center border border-solid border-black rounded-[26px] bg-white'>
                <img
                  src='/svgs/cameraIcon.svg'
                  alt=''
                />
              </div>
            </div>
          ) : (
            <div className='relative flex justify-center items-center w-[182px] h-[182px]'>
              <img
                className='w-[130px] h-[130px]'
                src='/images/group_default_thumbnail.png'
                alt=''
              />
              <div className='absolute bottom-0 right-0 w-[52px] h-[52px] flex justify-center items-center border border-solid border-black rounded-[26px] bg-white'>
                <img
                  src='/svgs/cameraIcon.svg'
                  alt=''
                />
              </div>
            </div>
          )}
        </label>
        <input
          type='file'
          id='group_image'
          accept='image/*'
          className='hidden'
          {...register('groupImg')}
        />
      </div>
      <div className='p-[10px] flex flex-col justify-center gap-[3px]'>
        <div className='h-[44px] flex flex-row items-center px-[5px] border-b border-solid border-black'>
          <input
            id='group_title'
            className='w-[323px] text-[20px]'
            {...register('groupTitle')}
            type='text'
            placeholder='그룹 이름을 입력해주세요.'
            maxLength={8}
          />
          <p className='right-[6px] text-[#bdbdbd]'>{groupTitleLen}/8</p>
        </div>
        <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupTitle && formState.errors.groupTitle.message}
        </p>
        <div className='relative flex justify-center'>
          <textarea
            id='group_desc'
            className='w-[343px] h-[169px] bg-[#bdbdbd] text-black text-[14px] py-[16px] px-[20px] placeholder:text-white resize-none'
            {...register('groupDesc')}
            placeholder='이 그룹에 대해서 설명해주세요.'
            maxLength={40}
          />
          <p className='absolute bottom-[9px] right-[16px] text-white'>{groupDescLen}/40</p>
        </div>
        <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupDesc && formState.errors.groupDesc.message}
        </p>
      </div>
      <button
        className='cursor-pointer bg-black text-white w-[343px] h-[56px] text-[20px]'
        type='submit'
      >
        {update_for ? '수정 완료' : '그룹 만들기'}
      </button>
    </form>
  );
};

export default MakeGroupPage;
