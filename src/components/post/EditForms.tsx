'use client';

import DateInputWithIcon from '../ui/DateInputWithIcon';
import HashtagInput from '../ui/HashtagInput';
import TimeInputWithIcon from '../ui/TimeInputWithIcon';
import { usePostForm } from '@/hooks/byUse/usePostForm';
import { useSubmitForm } from '@/hooks/queries/post/useFormMutations';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { formSchema } from '@/schemas/formSchemas';
import { saveTags, updateImagePostId } from '@/services/server-action/formActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { FieldValues, Controller } from 'react-hook-form';

const EditForms = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = usePostForm();

  const { userId = '', groupId = '', addressName, lat, lng } = usePostDataStore();
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();
  const place = addressName ? decodeURIComponent(addressName) : '';
  const { images } = useImageUploadStore();
  const { mutateAsync: submitForm } = useSubmitForm(groupId);
  const router = useRouter();

  useEffect(() => {
    if (!isFullHeightOpen) console.log('현재 이미지:', images);
  }, [isFullHeightOpen, images]);

  const handlePostForm = async (value: FieldValues) => {
    if (!userId || !groupId) return;
    const hashtags: string[] = value.hashtags || [];

    const parsedFormData = {
      ...formSchema.parse(value),
      userId,
      groupId,
      lat,
      lng,
      place,
      postThumbnailImage: images.find((img) => img.is_cover)?.post_image_name || '',
      imageArray: images.map((img) => img.post_image_name || ''),
    };

    try {
      const res = await submitForm(parsedFormData);
      const uploadSessionId = images[0]?.upload_session_id;
      await updateImagePostId(res.postId, uploadSessionId);
      if (hashtags.length > 0) {
        await saveTags(hashtags, res.postId, groupId);
      }
      router.push(`/group/${groupId}/post/${res.postId}`);
    } catch (error) {
      console.error('폼 제출 에러:', error);
      alert('폼 제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 필드 값 감시
  const text = watch('desc');
  // const hashtags = watch('hashtags');
  const date = watch('date');
  const time = watch('time');

  // 필드 빈값 확인
  const isFormValueFilled = useMemo(() => {
    return text && date && time;
  }, [text, date, time]);

  return (
    <>
      <form
        className='flex flex-col space-y-2 px-4'
        onSubmit={handleSubmit(handlePostForm)}
      >
        <div className='mb-4 flex w-full content-center items-start gap-4 overflow-x-auto pb-4'>
          {images.length > 0
            ? images.map((image, index) => (
                <div
                  key={index}
                  className='relative h-[240px] min-w-[240px] max-w-[240px] flex-1 overflow-hidden border border-gray-200'
                >
                  <img
                    src={image.post_image_url || '/path/to/placeholder.png'}
                    alt={`업로드된 이미지 ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                </div>
              ))
            : null}

          <button
            onClick={handleFullOpen}
            className={`flex h-[240px] min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50`}
          >
            <div className='flex flex-col items-center'>
              <IconPluslg />
              <p className='text-md mt-2'>사진 선택</p>
            </div>
          </button>
        </div>

        <TextAreaWithCounter
          id='formValue'
          variant='default'
          maxLength={1000}
          placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
          errorText={errors.desc && String(errors.desc.message)}
          {...register('desc')}
        />

        <Controller
          name='hashtags'
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div>
              <HashtagInput
                hashtags={field.value || []}
                setHashtags={field.onChange}
              />
              {errors.hashtags && <p className='mt-1 text-sm text-danger'>{String(errors.hashtags.message)}</p>}
            </div>
          )}
        />

        <DateInputWithIcon {...register('date')} />
        <TimeInputWithIcon {...register('time')} />

        <Button
          type='submit'
          label='게시물 업로드'
          variant='primary'
          className='font-bold'
        />
      </form>
    </>
  );
};
export default EditForms;
