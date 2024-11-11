'use client';

import ImageCropper from '../_common/ImageCropper';
import InputSection from '@/components/makegroup/InputSection';
import { useMakeGroupForm } from '@/hooks/byUse/useGroupForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import {
  useInsertGroupMutation,
  useInsertUserGroupMutation,
  useUpdateGroupMutation,
} from '@/hooks/queries/byUse/useGroupMutations';
import { useGroupDetailQueryForUpdate } from '@/hooks/queries/byUse/useGroupQueries';
import { makeGroupDataForUpdate, makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import { Button } from '@/stories/Button';
import Spinner from '@/stories/Spinner';
import { AreaPixedType, unCroppedImg } from '@/types/CropTypes';
import getCroppedImg from '@/utils/getCroppedImage';
import browserClient from '@/utils/supabase/client';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

type Props = {
  update_for?: string;
};

const MakeGroupForm = ({ update_for }: Props) => {
  const { register, handleSubmit, formState, watch, reset, setValue, clearErrors } = useMakeGroupForm();
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  //NOTE - 업데이트 상태일 시 데이터 가져오기
  const { data: groupDetailData, isPending: isPendingBeforeData } = useGroupDetailQueryForUpdate(update_for as string);
  //NOTE - 그룹 테이블 insert mutation
  const {
    isError: insertGroupDataError,
    mutateAsync: insertGroupDataMutate,
    isPending: isPendingInsertGroup,
  } = useInsertGroupMutation();
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
  } = useUpdateGroupMutation(update_for as string);

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
    // FileList 객체 생성
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
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
  const groupThumbnail = watch('groupImg') as File[] | null;

  const isValidToSubmit =
    (groupTitleLen > 0 && !formState.errors.groupTitle) || isFetchingBeforeData || isInserting || isUpdating;

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

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaPixedType>(null);
  const [unCroppedImage, setUnCroppedImage] = useState<unCroppedImg>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [cropperModal, handleCropperModal] = useIsOpen(false);
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
      console.log('Cropped Image File:', cropped);
      setValue('groupImg', [cropped]);
      setImgFile(cropped as File);
      setImgPreview(URL.createObjectURL(cropped as Blob));
      handleCropperModal();
      setUnCroppedImage(null); // 크롭한 이미지 리셋
    } catch (e) {
      console.error(e);
    }
  };

  if (insertGroupDataError || insertUserGroupError || updateGroupDataError) throw new Error('에러 발생!');
  return (
    <>
      {(isFetchingBeforeData || isInserting || isUpdating) && (
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
          type='submit'
        >
          {update_for ? '수정 완료' : '그룹 만들기'}
        </Button>
      </form>
    </>
  );
};

export default MakeGroupForm;
