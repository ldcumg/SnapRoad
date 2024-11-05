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

  const submitPost = (e: FieldValues) => {
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
      onSuccess: async (data: { data: { post_id: string } }) => {
        const postId = data.data.post_id;
        const uploadSessionId = imagesData[0].upload_session_id!;

        updateImagesPostIdMutation.mutate({ postId, uploadSessionId });

        const tags = hashtag
          .split('#')
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        tags.forEach((tag) => {
          saveTagsMutation.mutate({ tag, postId, groupId });
        });

        router.push(`/group/${groupId}`);
      },
    });
  };

  return (
    <div className='PostForm'>
      <form
        className='w-full border border-black flex flex-col'
        onSubmit={handleSubmit(submitPost)}
      >
        <label htmlFor='description'>대표</label>
        <textarea
          id='description'
          {...register('description')}
          maxLength={1000}
          placeholder='여행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        {errors.description && <p className='text-danger text-sm'>{errors.description.message}</p>}

        <Input
          type='text'
          label='해시태그'
          {...register('hashtag')}
          placeholder='예: 여행 친구랑'
        />
        {errors.hashtag && <p className='text-danger text-sm'>{errors.hashtag.message}</p>}

        <Input
          type='date'
          label='날짜'
          {...register('date')}
        />
        {errors.date && <p className='text-danger text-sm'>{errors.date.message}</p>}

        <Input
          type='time'
          label='시간'
          {...register('time')}
        />
        {errors.time && <p className='text-danger text-sm'>{errors.time.message}</p>}

        <Button
          type='submit'
          label='제출하기'
        />
      </form>
    </div>
  );
};
export default PostForm;
