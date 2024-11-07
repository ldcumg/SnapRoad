'use client';

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
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const { userId, groupId, lat, lng, addressName } = usePostDataStore();
  const { images: imagesData } = useImageUploadStore();
  const router = useRouter();
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const createPostMutation = useCreatePostMutation();
  const updateImagesPostIdMutation = useUpdateImagesPostIdMutation();
  const saveTagsMutation = useSaveTagsMutation();
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  useEffect(() => {
    if (!groupId || !userId) return;
    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        imagesData.map(async (image) => {
          const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name);
          return url;
        }),
      );
      return setImageUrls(urls);
    };

    fetchImageUrls();
  }, [imagesData, groupId, userId]);

  const submitPost = (e: PostFormData) => {
    // e.preventDefault();
    if (!groupId || !userId) {
      console.error('그룹 ID와 사용자 ID가 필요합니다.');
      return;
    }

    const postData = {
      userId,
      groupId,
      postDesc: description,
      postDate: date,
      postTime: time,
      postLat: lat || null,
      postLng: lng || null,
      postThumbnailImage: imagesData.find((image) => image.is_cover)?.post_image_name || '',
      imageArray: imagesData.map((image) => image.post_image_name || ''),
      postAddress: decodedAddressName!,
    };

    createPostMutation.mutate(postData, {
      onSuccess: async (res: { data: { post_id: string } }) => {
        const postId = res.data.post_id;
        const uploadSessionId = imagesData[0].upload_session_id!;

        updateImagesPostIdMutation.mutate({ postId, uploadSessionId });

        const tags = hashtag
          .split('#')
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        tags.forEach((tag) => {
          saveTagsMutation.mutate({ tag, postId, groupId });
        });
        const place = decodedAddressName; // 예시로 주소 이름을 사용
        const post_id = res.data.post_id; // post_id API 응답
        console.log('Place:', place); // place 값 확인
        console.log('post_id:', post_id); // post_id 값 확인

        // router.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}/${postId}`);
        // router.push(`/grouplist`);
        router.push(`/group/${groupId}/post/${post_id}`);
        // post?lat=${lat}&lng=${lng}&place=${place}/
      },
    });
  };

  return (
    <div className='PostForm p-4'>
      <form
        className='w-full flex flex-col space-y-2'
        onSubmit={handleSubmit(submitPost)}
      >
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

        <input
          type='date'
          className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 '
          {...register('date')}
        />
        {errors.date && <p className='text-danger text-sm'>{errors.date.message}</p>}

        <input
          type='time'
          className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 '
          {...register('time')}
        />
        {errors.time && <p className='text-danger text-sm'>{errors.time.message}</p>}

        <div className='border-t border-gray-300 py-4'>
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
