'use client';

import DateInputWithIcon from '../ui/DateInputWithIcon';
import HashtagInput from '../ui/HashtagInput';
import TimeInputWithIcon from '../ui/TimeInputWithIcon';
import PostAddress from './PostAddress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { useSubmitForm } from '@/hooks/queries/post/useFormMutations';
import { usePostForm } from '@/hooks/useCustomForm/usePostForm';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { formSchema } from '@/schemas/formSchemas';
import { saveTags, updateImagePostId } from '@/services/server-action/formActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FieldValues, Controller } from 'react-hook-form';

const PostForms = ({ groupId }: { groupId: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = usePostForm();

  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);
  const { userId = '', addressName, lat, lng } = usePostDataStore();
  const { handleFullOpen } = useBottomSheetStore();
  const place = addressName ? decodeURIComponent(addressName) : '';
  const { images } = useImageUploadStore();
  const { mutateAsync: submitForm } = useSubmitForm(groupId);
  const router = useRouter();

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  const handlePostForm = async (value: FieldValues) => {
    if (!userId) return;
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
      console.error('폼 데이터 검증 에러:', error);
      alert('폼 데이터가 유효하지 않습니다. 모든 필드를 확인하세요.');
      return;
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
            {images.length === 0 ? (
              <button
                onClick={handleFullOpen}
                className='flex h-[588px] w-[588px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'
              >
                <div className='flex flex-col items-center'>
                  <IconPluslg />
                  <p className='text-md mt-2'>사진 선택</p>
                </div>
              </button>
            ) : (
              <div className='relative -ml-8 flex w-full flex-row-reverse gap-4 pb-4'>
                <Carousel
                  className='relative w-full overflow-visible'
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent className='flex w-[588px] gap-4'>
                    {images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className='relative h-[588px] min-w-[588px] flex-1 overflow-hidden md:border md:border-gray-200'
                      >
                        <img
                          src={image.post_image_url || '/path/to/placeholder.png'}
                          alt={`업로드된 이미지 ${index + 1}`}
                          className='h-full w-full object-cover'
                        />
                      </CarouselItem>
                    ))}
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
            )}
          </div>

          <div className='flex flex-col space-y-4 md:mx-auto md:w-[620px]'>
            <PostAddress groupId={groupId} />
          </div>
        </>
      ) : (
        <>
          <PostAddress groupId={groupId} />
          <div className='mb-4 flex w-full items-start justify-start gap-4 overflow-x-auto'>
            {images.length > 0 &&
              images.map((image, index) => (
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
              ))}

            <button
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
            <HashtagInput
              hashtags={field.value || []}
              setHashtags={field.onChange}
            />
          )}
        />

        <DateInputWithIcon {...register('date')} />
        <TimeInputWithIcon {...register('time')} />

        <Button
          type='submit'
          label='게시물 업로드'
          variant='primary'
          className='mx-auto mt-6 inline-flex w-full items-center justify-center rounded-[12px] bg-primary-400 px-6 py-3 text-white hover:bg-primary-600 focus:outline-none md:!mt-24 md:w-1/2'
          size='large'
        />
      </div>
    </form>
  );
};

export default PostForms;
