'use client';

import InputSection from '@/components/makegroup/InputSection';
import { useMakeGroupForm } from '@/hooks/byUse/useGroupForm';
import {
  useInsertGroupMutation,
  useInsertUserGroupMutation,
  useUpdateGroupMutation,
} from '@/hooks/queries/byUse/useGroupMutations';
import { useGroupDetailQueryForUpdate } from '@/hooks/queries/byUse/useGroupQueries';
import { makeGroupDataForUpdate, makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import Spinner from '@/stories/Spinner';
import browserClient from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

type Props = {
  update_for?: string;
};

const MakeGroupForm = ({ update_for }: Props) => {
  const { register, handleSubmit, formState, watch, reset, setValue, clearErrors } = useMakeGroupForm();
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

  const { data: groupDetailData, isPending, isLoading } = useGroupDetailQueryForUpdate(update_for);

  useEffect(() => {
    const fillGroupData = async () => {
      if (groupDetailData && groupDetailData.group_image_url) {
        const fileList = await urlToFileList(groupDetailData.group_image_url);
        reset({
          groupTitle: groupDetailData.group_title ?? '',
          groupDesc: groupDetailData.group_desc ?? '',
          groupImg: fileList as unknown as null,
        });
      } else if (groupDetailData) {
        reset({
          groupTitle: groupDetailData.group_title ?? '',
          groupDesc: groupDetailData.group_desc ?? '',
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
  const clearInputValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setValue('groupTitle', '');
    clearErrors('groupTitle');
  };

  if (insertGroupDataError || insertUserGroupError || updateGroupDataError) throw new Error('에러 발생!');
  return (
    <>
      {update_for && isPending && (
        <div className='w-full h-full absolute z-[3000] bg-black opacity-10 flex justify-center items-center'>
          <Spinner />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col justify-center items-center gap-6 px-4 pt-4'
      >
        <InputSection
          register={register}
          formState={formState}
          imgPreview={imgPreview}
          groupTitleLen={groupTitleLen}
          groupDescLen={groupDescLen}
          clearInputValue={clearInputValue}
        />
        <button
          className='cursor-pointer bg-primary-400 w-full py-4 rounded-xl text-white text-title_lg'
          type='submit'
        >
          {update_for ? '수정 완료' : '그룹 만들기'}
        </button>
      </form>
    </>
  );
};

export default MakeGroupForm;
