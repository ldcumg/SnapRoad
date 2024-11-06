'use client';

import TextAreaWithLimit from '../ui/textareaWithLimit';
import { usePostForm } from '@/hooks/byUse/usePostForm';
import {
  useCreatePostMutation,
  useSaveTagsMutation,
  useUpdateImagesPostIdMutation,
} from '@/hooks/queries/post/usePostFormMutation';
import { postSchema, PostFormData } from '@/schemas/postSchema';
import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });
  const router = useRouter();

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const { userId, groupId, lat, lng, addressName } = usePostDataStore();
  const { images: imagesData } = useImageUploadStore();
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const createPostMutation = useCreatePostMutation();
  const updateImagesPostIdMutation = useUpdateImagesPostIdMutation();
  const saveTagsMutation = useSaveTagsMutation();
  const [description, setDescription] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  useEffect(() => {
    if (!groupId || !userId) return;

    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        imagesData.map(async (image) => {
          const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name || '');
          return url;
        }),
      );
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [imagesData, groupId, userId]);

  const submitPost = (data: PostFormData) => {
    if (!groupId || !userId) {
      console.error('그룹 ID와 사용자 ID가 필요합니다.');
      return;
    }

    const postData = {
      userId,
      groupId,
      postDesc: data.description,
      postDate: data.date,
      postTime: data.time,
      postLat: lat || null,
      postLng: lng || null,
      postThumbnailImage: imagesData.find((image) => image.is_cover)?.post_image_name || '',
      imageArray: imagesData.map((image) => image.post_image_name || ''),
      postAddress: decodedAddressName!,
    };

    createPostMutation.mutate(postData, {
      onSuccess: async (response) => {
        const postId = response.data.post_id;
        const uploadSessionId = imagesData[0].upload_session_id!;
        updateImagesPostIdMutation.mutate({ postId, uploadSessionId });
        const tags = data.hashtag;
        tags.forEach((tag) => {
          saveTagsMutation.mutate({ tag, postId, groupId });
        });

        router.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${decodedAddressName}/post/1`);
      },
    });
  };

  return (
    <div className='PostForm'>
      <form
        className='w-full flex flex-col space-y-4'
        onSubmit={handleSubmit(submitPost)}
      >
        <div>
          <div className='relative border rounded-lg border-gray-300 focus:ring-2 focus:border-gray-300 overflow-hidden'>
            <textarea
              id='description'
              {...register('description')}
              maxLength={1000}
              placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
              className='w-full pt-3 pb-12 px-3 h-36 text-base bg-white text-gray-900'
              onChange={handleChange}
            />
            <div className='w-full text-right text-gray-500 text-sm absolute pb-1 pr-1 left-0 right-0 bottom-0 bg-white'>
              {description.length}/1000
            </div>
            {errors.description && <p className='text-danger text-sm'>{errors.description.message}</p>}
          </div>

          <Input
            type='text'
            {...register('hashtag')}
            placeholder='# 해시태그를 추가해 보세요'
          />
          {errors.hashtag && <p className='text-danger text-sm'>{errors.hashtag.message}</p>}
        </div>
        <div className='relative'>
          <input
            type='date'
            {...register('date')}
            className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 input-no-calendar'
            onClick={() => dateInputRef.current?.showPicker && dateInputRef.current.showPicker()}
            ref={dateInputRef}
          />
          <img
            src='/svgs/Calendar_Nr.svg'
            alt='날짜 선택'
            className='absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 w-6 h-6'
            onClick={() => dateInputRef.current?.showPicker && dateInputRef.current.showPicker()}
          />
          {errors.date && <p className='text-danger text-sm'>{errors.date.message}</p>}
        </div>

        <div className='relative'>
          <input
            type='time'
            {...register('time')}
            className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 input-no-calendar'
            onClick={() => timeInputRef.current?.showPicker && timeInputRef.current.showPicker()}
            ref={timeInputRef}
          />
          <img
            src='/svgs/Clock.svg'
            alt='시간 선택'
            className='absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 w-6 h-6'
            onClick={() => timeInputRef.current?.showPicker && timeInputRef.current.showPicker()}
          />
          {errors.time && <p className='text-danger text-sm'>{errors.time.message}</p>}
        </div>

        <div className='border border-t border-gray-300 p-4'>
          <Button
            type='submit'
            label='제출하기'
            className='w-full'
          />
        </div>
      </form>
    </div>
  );
};

export default PostForm;
