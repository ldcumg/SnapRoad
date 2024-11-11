'use client';

import { formSchema } from './query/formSchemas';
import { useForm } from './query/useFormMutations';
import { usePostForm } from './query/usePostForm';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { useMemo, useState, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';

const FixPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = usePostForm();

  const { userId, groupId, addressName, lat, lng } = usePostDataStore();
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();
  const place = addressName ? decodeURIComponent(addressName) : '';
  const { images } = useImageUploadStore();
  const title = `${images.length} / 10`;

  const { mutate: postForm } = useForm();

  // useEffect(() => {
  //   if (!groupId || !userId) return;
  // }, [groupId, userId]);
  console.log(`유저:${userId}, 그룹: ${groupId}, 경도: ${lat}, 위도: ${lng}, 주소: ${addressName}`);

  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedInSheet, setIsCheckedInSheet] = useState(false);

  const handlePostForm = async (value: FieldValues) => {
    // console.log('폼 데이터 제출', value, userId, groupId);

    if (!userId || !groupId) return; //!lat || !lng || !addressName

    const parsedFormData = {
      ...formSchema.parse(value), // Zod로 파싱된 기존 데이터
      userId,
      groupId,
      lat,
      lng,
      place,
    };

    try {
      await postForm(parsedFormData);
      console.log('폼 데이터 제출 성공!');
    } catch (error) {
      console.error('폼 제출 에러:', error);
      alert('폼 제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 필드 값 감시
  const text = watch('desc');
  const hashtags = watch('hashtags');
  const date = watch('date');
  const time = watch('time');

  // 필드 빈값 확인
  const isFormValueFilled = useMemo(() => {
    return text && hashtags && date && time;
  }, [text, hashtags, date, time]);

  return (
    <>
      <form
        className='flex flex-col'
        onSubmit={handleSubmit(handlePostForm)}
      >
        <div className='flex content-center items-start'>
          <button
            onClick={handleFullClose}
            className={`flex h-[240px] min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50 ${images.length > 0 ? 'ml-4' : ''}`}
          >
            <span className='text-2xl font-bold text-gray-400'>+</span>
          </button>
        </div>

        <TextAreaWithCounter
          id='formValue'
          {...register('desc')}
          placeholder='내용 입력항목입니다.'
          maxLength={1000}
          errorText={errors.text && String(errors.text.message)}
          variant='default'
        />

        {/* <textarea
          {...register('text')}
          maxLength={1000}
          placeholder='내용 입력'
        />
        {errors.text && <span>{errors.text.message && String(errors.text.message)}</span>} */}

        <input
          {...register('hashtags')}
          placeholder='#해시태그'
        />
        {errors.hashtags && <span>{errors.hashtags.message && String(errors.hashtags.message)}</span>}

        <input
          type='date'
          {...register('date')}
        />
        {errors.date && <span>{errors.date.message && String(errors.date.message)}</span>}

        <input
          type='time'
          {...register('time')}
        />
        {errors.time && <span>{errors.time.message && String(errors.time.message)}</span>}

        <Button
          type='submit'
          label='게시물 업로드'
          variant='primary'
          // disabled={!isFormValueFilled || Object.keys(errors).length > 0}
        />

        <BottomSheet
          isOpen={isFullHeightOpen}
          onClose={handleFullClose}
          // title={title}
          confirmLabel='확인'
          onconfirmButtonClick={handleFullClose}
          singleButton={true}
          height='full'
        >
          <div></div>
        </BottomSheet>
      </form>
    </>
  );
};
export default FixPostForm;
