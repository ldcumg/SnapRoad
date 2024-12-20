'use client';

import DateInputWithIcon from '../ui/DateInputWithIcon';
import HashtagInput from '../ui/HashtagInput';
import TimeInputWithIcon from '../ui/TimeInputWithIcon';
import PostAddress from './PostAddress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { useUpdateForm } from '@/hooks/queries/post/useFormMutations';
import { useEditForm } from '@/hooks/useCustomForm/usePostForm';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { formSchema } from '@/schemas/formSchemas';
import { saveTags, deleteTags, updateImagePostId } from '@/services/server-action/formActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { PostDetail as postDetailType } from '@/types/postDetailTypes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, Controller } from 'react-hook-form';

export type PostAndProfileProps = {
  groupId: string;
  postDetail: postDetailType;
};

const EditForms = ({ postDetail, groupId }: PostAndProfileProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useEditForm();

  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);
  const { userId = '', addressName, lat, lng } = usePostDataStore();
  const { handleFullOpen } = useBottomSheetStore();
  const { images: uploadedImages } = useImageUploadStore();
  const { mutateAsync: updateForm } = useUpdateForm(groupId);
  const [existingImages, setExistingImages] = useState(postDetail.images || []);
  const [hashtags, setHashtags] = useState<string[]>(postDetail.tags?.map((tag) => tag.tag_title) || []);
  const router = useRouter();

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (postDetail) {
      setValue('desc', postDetail.post_desc || '');
      setValue('hashtags', hashtags);
      setValue('date', postDetail.post_date || '');
      setValue('time', postDetail.post_time || '');
      setExistingImages(postDetail.images || []);
    }
  }, [postDetail, setValue, hashtags]);

  const handlePostForm = async (value: FieldValues) => {
    if (!userId || !groupId || !postDetail.post_id) return;

    const finalImages = [...existingImages, ...uploadedImages];

    if (finalImages.length === 0) {
      alert('이미지가 없어 게시물을 수정할 수 없습니다.');
      return;
    }

    const parsedFormData = {
      ...formSchema.parse(value),
      postId: postDetail.post_id,
      userId,
      groupId,
      lat,
      lng,
      place: addressName || '',
      postThumbnailImage: finalImages.find((img) => img.is_cover)?.post_image_name || '',
      imageArray: finalImages.map((img) => img.post_image_name),
    };

    try {
      await updateForm(parsedFormData);

      if (uploadedImages.length > 0) {
        const uploadSessionId = uploadedImages[0]?.upload_session_id;
        await updateImagePostId(postDetail.post_id, uploadSessionId);
      }

      if (hashtags.length > 0) {
        await deleteTags(postDetail.post_id, groupId);
        await saveTags(hashtags, postDetail.post_id, groupId);
      }

      router.push(`/group/${groupId}/post/${postDetail.post_id}`);
    } catch (error) {
      console.error('폼 제출 에러:', error);
      alert('폼 제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <form
      className='mb-8 flex flex-col space-y-4 !px-4'
      onSubmit={handleSubmit(handlePostForm)}
    >
      {desktop ? (
        <>
          <div className='relative mx-auto mb-4'>
            {uploadedImages.length > 0 || existingImages.length > 0 ? (
              <div className='relative -ml-8 flex w-full flex-row-reverse gap-4 pb-4'>
                <Carousel
                  className='relative w-full overflow-visible'
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent className='flex w-[588px] gap-4'>
                    {(uploadedImages.length > 0 ? uploadedImages : existingImages).map((image, index) => {
                      if (!image.signed_image_url && !image.post_image_url) return null;

                      return (
                        <CarouselItem
                          key={image.post_image_name || image.signed_image_url || index}
                          className='relative h-[588px] min-w-[588px] flex-1 overflow-hidden md:border md:border-gray-200'
                        >
                          <img
                            src={image.signed_image_url || image.post_image_url || '/path/to/placeholder.png'}
                            alt={`업로드된 이미지 ${index + 1}`}
                            className='h-full w-full object-cover'
                          />
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>

                  <CarouselPrevious
                    className='absolute -left-8 top-1/2 z-[2] flex !h-10 !w-10 -translate-y-1/2 transform items-center justify-center rounded-full !border-0 bg-white text-gray-800 shadow-md hover:bg-gray-300'
                    type='button'
                  />
                  <CarouselNext
                    className='absolute -right-8 top-1/2 z-[2] flex !h-10 !w-10 -translate-y-1/2 transform items-center justify-center rounded-full !border-0 bg-white text-gray-800 shadow-md hover:bg-gray-300'
                    type='button'
                  />
                </Carousel>

                <button
                  onClick={handleFullOpen}
                  className='flex h-[72px] min-w-[72px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'
                >
                  <div className='flex flex-col items-center'>
                    <p className='text-md mt-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M9.14286 12.9524L11.0476 14.8571M9.61905 7.71429L6.28571 6.28571M16.7619 7.2381L19.619 4.38095M16.2857 14.381L17.7143 17.7143M22 12.4762L18.6667 11.0476M11.5238 2L12.9524 5.33333M12.4762 9.61905L14.381 11.5238L3.90476 22L2 20.0952L12.4762 9.61905Z'
                          stroke='black'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </p>
                  </div>
                </button>
              </div>
            ) : null}
          </div>

          <div className='flex flex-col space-y-4 md:mx-auto md:w-[620px]'>
            <PostAddress groupId={groupId} />
          </div>
        </>
      ) : (
        <>
          <PostAddress groupId={groupId} />

          <div className='mb-4 flex w-full content-center items-start gap-4 overflow-x-auto'>
            {(uploadedImages.length > 0 ? uploadedImages : existingImages).map((image, index) => (
              <div
                key={image.post_image_name || image.signed_image_url || index}
                className='relative h-[240px] min-w-[240px] max-w-[240px] flex-1 overflow-hidden border border-gray-200'
              >
                <img
                  src={image.signed_image_url || image.post_image_url || '/path/to/placeholder.png'}
                  alt={`이미지 ${index + 1}`}
                  className='h-full w-full object-cover'
                />
              </div>
            ))}

            <button
              type='button'
              onClick={handleFullOpen}
              className='flex h-[240px] min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'
            >
              <div className='flex flex-col items-center'>
                <IconPluslg />
                <p className='text-md mt-2'>사진 선택</p>
              </div>
            </button>
          </div>
        </>
      )}

      <div className='flex flex-col space-y-4 md:mx-auto md:w-[620px]'>
        <Controller
          name='desc'
          control={control}
          defaultValue={postDetail.post_desc || ''}
          render={({ field }) => (
            <TextAreaWithCounter
              id='formValue'
              variant='default'
              maxLength={1000}
              placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
              errorText={errors.desc && String(errors.desc.message)}
              {...field}
            />
          )}
        />
        <Controller
          name='hashtags'
          control={control}
          defaultValue={hashtags}
          render={() => (
            <HashtagInput
              hashtags={hashtags}
              setHashtags={setHashtags}
            />
          )}
        />

        <Controller
          name='date'
          control={control}
          defaultValue={postDetail.post_date ? new Date(postDetail.post_date) : null}
          render={({ field }) => (
            <DateInputWithIcon
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Controller
          name='time'
          control={control}
          defaultValue={postDetail.post_time || ''}
          render={({ field }) => (
            <TimeInputWithIcon
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Button
          type='submit'
          label='게시물 수정'
          variant='primary'
          className='mx-auto mt-6 inline-flex w-full items-center justify-center rounded-[12px] bg-primary-400 px-6 py-3 text-white hover:bg-primary-600 focus:outline-none lg:!mt-24 lg:w-1/2'
        />
      </div>
    </form>
  );
};

export default EditForms;
