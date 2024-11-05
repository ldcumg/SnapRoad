import { usePostForm } from '@/hooks/byUse/usePostForm';
import { PostFormData, postSchema } from '@/schemas/postSchema';
import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = usePostForm();

  const { userId, groupId, lat, lng, addressName } = usePostDataStore();
  const { images: imagesData } = useImageUploadStore();
  const router = useRouter();
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  if (!groupId || !userId) {
    return <div>로딩 중...</div>;
  }

  const onHandlePostSubmit = async (data: FieldValues /*PostFormData*/) => {
    // const parsedData: PostFormData = postSchema.parse(data);

    const coverImage = imagesData.find((image) => image.is_cover);
    const postLat = lat || null;
    const postLng = lng || null;
    const imageArray = imagesData.map((image) => image.post_image_name || '');

    const postData = {
      user_id: userId,
      group_id: groupId,
      post_desc: data.description,
      post_date: data.date,
      post_time: data.time,
      post_lat: postLat,
      post_lng: postLng,
      post_thumbnail_image: coverImage?.post_image_name!,
      image_array: imageArray,
      post_address: decodedAddressName!,
    };

    try {
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .insert(postData)
        .select('post_id')
        .single();

      if (postError || !post) {
        console.error('포스트 제출에 실패했습니다:', postError?.message);
        return;
      }

      console.log('포스트가 성공적으로 제출되었습니다. post_id:', post);

      const postId = post.post_id;
      const { error: imageError } = await browserClient
        .from('images')
        .update({ post_id: postId })
        .eq('upload_session_id', imagesData[0].upload_session_id!);

      if (imageError) {
        console.error('이미지에 post_id 업데이트에 실패했습니다:', imageError.message);
      }

      const tagData = data.hashtag.map((tag: any) => ({
        tag_title: tag,
        post_id: postId,
        group_id: groupId,
      }));

      if (tagData.length > 0) {
        const { error: tagError } = await browserClient.from('tags').insert(tagData);
        if (tagError) {
          console.error('태그 저장에 실패했습니다:', tagError.message);
        }
      }

      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error('포스트 제출 중 오류 발생:', error);
    }
  };

  return (
    <div className='PostForm'>
      <form
        className='w-full border border-black flex flex-col'
        onSubmit={handleSubmit(onHandlePostSubmit)}
      >
        <label htmlFor='description'>대표</label>
        <textarea
          id='글쓰기'
          {...register('description')}
          maxLength={1000}
          placeholder='여행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        {errors.description && <p className='text-danger text-sm'>{String(errors.description.message)}</p>}

        <Input
          label={'해시태그'}
          placeholder={'해시태그는 다섯 개까지 작성 가능 합니다.'}
          errorText={errors.hashtag ? String(errors.hashtag.message) : undefined}
          {...register('hashtag')}
        />
        {errors.hashtag && <p className='text-danger text-sm'>{String(errors.hashtag.message)}</p>}

        <Input
          type='date'
          label={'날짜'}
          errorText={errors.date ? String(errors.date.message) : undefined}
          {...register('date')}
        />
        {errors.date && <p className='text-danger text-sm'>{String(errors.date.message)}</p>}

        <Input
          type={'time'}
          label={'시간'}
          errorText={errors.time ? String(errors.time.message) : undefined}
          {...register('time')}
        />
        {errors.time && <p className='text-danger text-sm'>{String(errors.time.message)}</p>}

        <Button
          type='submit'
          label='제출하기'
          variant='primary'
        />
      </form>
    </div>
  );
};

export default PostForm;
