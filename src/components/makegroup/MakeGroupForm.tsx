'use client';

import ImageCropper from '../_common/ImageCropper';
import InputSection from '@/components/makegroup/InputSection';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import {
  useInsertGroupMutation,
  useInsertUserGroupMutation,
  useUpdateGroupMutation,
} from '@/hooks/queries/group/useGroupMutations';
import { useGroupDetailQueryForUpdate } from '@/hooks/queries/group/useGroupQueries';
import { useMakeGroupForm } from '@/hooks/useCustomForm/useGroupForm';
import { makeGroupDataForUpdate, makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import { Button } from '@/stories/Button';
import Spinner from '@/stories/Spinner';
import { AreaPixedType, unCroppedImg } from '@/types/CropTypes';
import getCroppedImg from '@/utils/getCroppedImage';
import browserClient from '@/utils/supabase/client';
import { useIsFetching } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

type Props = {
  update_for?: string;
  handleUpdateModal?: () => void;
};
export type GroupFormType = {
  groupTitle: string;
  groupDesc: string;
  groupImg: File[];
};

const MakeGroupForm = ({ update_for, handleUpdateModal }: Props) => {
  const { register, handleSubmit, formState, watch, reset, setValue, clearErrors } = useMakeGroupForm();
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  //NOTE - 업데이트 상태일 시 데이터 가져오기
  const { data: groupDetailData, isPending: isPendingBeforeData } = useGroupDetailQueryForUpdate(update_for as string);
  //NOTE - 그룹 테이블 insert mutation
  const {
    isError: insertGroupDataError,
    mutateAsync: insertGroupDataMutate,
    isPending: isPendingInsertGroup,
  } = useInsertGroupMutation(handleUpdateModal, handleUpdateModal && reset);
  //NOTE - 유저_그룹테이블 insert mutation
  const {
    isError: insertUserGroupError,
    mutate: insertUserGroupMutate,
    isPending: isPendingInsertUserGroup,
  } = useInsertUserGroupMutation();
  //NOTE - 그룹 테이블 update mutation
  const {
    isError: updateGroupDataError,
    mutateAsync: updateGroupDataMutate,
    isPending: isPendingUpdate,
  } = useUpdateGroupMutation(update_for as string, handleUpdateModal);

  const isFetchingBeforeData = isPendingBeforeData && update_for;
  const isInserting = isPendingInsertGroup || isPendingInsertUserGroup;
  const isUpdating = isPendingUpdate && update_for;

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
    return [file];
  };

  useEffect(() => {
    const fillGroupData = async () => {
      if (groupDetailData && groupDetailData.group_image_url) {
        const fileList = await urlToFileList(groupDetailData.group_image_url);
        reset({
          groupTitle: groupDetailData.group_title ?? '',
          groupDesc: groupDetailData.group_desc ?? '',
          groupImg: fileList as unknown as File[],
        });
        setImgPreview(groupDetailData.group_image_url);
      } else if (groupDetailData && !groupDetailData.group_image_url) {
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

  const isFetchingSomething = useIsFetching() > 0;

  const isValidToSubmit =
    (groupTitleLen > 0 && !formState.errors.groupTitle) ||
    isFetchingBeforeData ||
    isInserting ||
    isUpdating ||
    isFetchingSomething;

  const clearInputValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setValue('groupTitle', '');
    clearErrors('groupTitle');
  };

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaPixedType>(null);
  const [unCroppedImage, setUnCroppedImage] = useState<unCroppedImg>(null);
  const [cropperModal, handleCropperModal] = useIsOpen(false);

  // NOTE - 동일 파일을 다시 자르길 원할 때 다시 업로드하면 변화를 체크하지 못함
  const handleInputImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      handleCropperModal();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setUnCroppedImage(reader.result);
      };
    }
  };

  const handleCropImage = async () => {
    if (!croppedAreaPixels || !unCroppedImage) return; // 크롭 영역과 이미지가 있어야 함
    try {
      const cropped = (await getCroppedImg(unCroppedImage as string, croppedAreaPixels)) as File;
      setValue('groupImg', [cropped]);
      setImgPreview(URL.createObjectURL(cropped as Blob));
      handleCropperModal();
      setUnCroppedImage(null); // 크롭한 이미지 리셋
    } catch (e) {
      throw new Error('이미지 자르기 실패');
    }
  };
  if (insertGroupDataError || insertUserGroupError || updateGroupDataError) throw new Error('에러 발생!');
  return (
    <div className='relative'>
      {(isFetchingBeforeData || isInserting || isUpdating || isFetchingSomething) && (
        <div className='absolute z-[3000] flex h-full w-full items-center justify-center bg-black bg-opacity-10'>
          <Spinner color='primary-400' />
        </div>
      )}
      <ImageCropper
        unCroppedImage={unCroppedImage}
        setCroppedAreaPixels={setCroppedAreaPixels}
        cropperModal={cropperModal}
        handleCropImage={handleCropImage}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col items-center justify-center gap-6 px-4 pt-4'
      >
        <InputSection
          register={register}
          formState={formState}
          imgPreview={imgPreview}
          groupTitleLen={groupTitleLen}
          groupDescLen={groupDescLen}
          clearInputValue={clearInputValue}
          handleInputImageChange={handleInputImageChange}
        />
        <Button
          variant='primary'
          disabled={!isValidToSubmit}
          size='full'
          type='submit'
          loading={isFetchingSomething}
          label={update_for ? '수정 완료' : '그룹 만들기'}
        />
      </form>
    </div>
  );
};

export default MakeGroupForm;
