'use client';

import { usePostForm } from '@/hooks/byUse/usePostForm';
import { useForm } from '@/hooks/queries/post/useFormMutations';
import { formSchema } from '@/schemas/formSchemas';
import { saveTags, updateImagePostId } from '@/services/server-action/formActions';
import DateInputWithIcon from '../ui/DateInputWithIcon';
import TimeInputWithIcon from '../ui/TimeInputWithIcon';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import TextAreaWithCounter from '@/stories/TextAreas';
import { useRouter, useParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';

const EditForms = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = usePostForm();

  const { userId = '', groupId = '', addressName, lat, lng } = usePostDataStore();
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();
  const place = addressName ? decodeURIComponent(addressName) : '';
  const { images, setImages } = useImageUploadStore();
  const { mutateAsync: postForm } = useForm();
  const router = useRouter();
  const { postId } = useParams();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // 서버에서 게시물 데이터 가져오기
        const postData = await fetch(`/api/posts/${postId}`).then((res) => res.json());

        // 가져온 데이터를 폼에 설정
        setValue('desc', postData.desc);
        setValue('hashtags', postData.hashtags.join(', '));
        setValue('date', postData.date);
        setValue('time', postData.time);
        setImages(postData.images || []);
      } catch (error) {
        console.error('게시물 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, setValue, setImages]);

  const handlePostForm = async (value: FieldValues) => {
    if (!userId || !groupId) return;

    let hashtags: string[] = [];

    if (typeof value.hashtags === 'string') {
      hashtags = value.hashtags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter((tag) => tag.length > 0);
    } else if (Array.isArray(value.hashtags)) {
      hashtags = value.hashtags.map((tag) => (typeof tag === 'string' ? tag.trim().replace(/^#/, '') : tag.toString()));
    }

    hashtags = hashtags.filter((tag) => tag.length > 0);

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
      const res = await postForm(parsedFormData);
      const uploadSessionId = images[0]?.upload_session_id;
      await updateImagePostId(res.postId, uploadSessionId);
      await saveTags(hashtags, res.postId, groupId);
      router.push(`/group/${groupId}/post/${res.postId}`);
    } catch (error) {
      console.error('폼 제출 에러:', error);
      alert('폼 제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const text = watch('desc');
  const hashtags = watch('hashtags');
  const date = watch('date');
  const time = watch('time');

  const isFormValueFilled = useMemo(() => {
    return text && hashtags && date && time;
  }, [text, hashtags, date, time]);

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

        <Input
          type={'text'}
          placeholder='# 해시태그를 추가해 보세요'
          errorText={errors.hashtags && String(errors.hashtags.message)}
          {...register('hashtags')}
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
