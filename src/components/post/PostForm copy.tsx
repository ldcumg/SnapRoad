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

  // 이미지 URL을 비동기로 가져오기
  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!groupId || !userId) return;

      try {
        const urls = await Promise.all(
          imagesData.map(async (image) => {
            const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name || '');
            return url;
          }),
        );
        setImageUrls(urls);
      } catch (error) {
        console.error('이미지 URL 가져오기 오류:', error);
      }
    };

    fetchImageUrls();
  }, [imagesData, groupId, userId]);

  if (!groupId || !userId) {
    return <div>로딩 중...</div>;
  }

  // 포스트 데이터를 생성하는 함수
  const createPostData = (data: FieldValues) => {
    const coverImage = imagesData.find((image) => image.is_cover);
    return {
      user_id: userId,
      group_id: groupId,
      post_desc: data.description,
      post_date: data.date,
      post_time: data.time,
      post_lat: lat || null,
      post_lng: lng || null,
      post_thumbnail_image: coverImage?.post_image_name!,
      image_array: imagesData.map((image) => image.post_image_name || ''),
      post_address: decodedAddressName!,
    };
  };

  // 포스트 제출 함수
  const onHandlePostSubmit = async (data: FieldValues) => {
    const postData = createPostData(data);

    try {
      // 포스트 데이터 저장
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .insert(postData)
        .select('post_id')
        .single();

      if (postError || !post) throw new Error(postError?.message || '포스트 저장 오류');

      console.log('포스트가 성공적으로 제출되었습니다. post_id:', post.post_id);

      // 이미지 데이터에 post_id 업데이트
      await updateImagePostId(post.post_id);

      // 태그 저장
      await saveTags(data.hashtag, post.post_id);

      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error('포스트 제출 중 오류 발생:', error);
    }
  };

  // 이미지에 post_id 업데이트 함수
  const updateImagePostId = async (postId: string) => {
    const { error } = await browserClient
      .from('images')
      .update({ post_id: postId })
      .eq('upload_session_id', imagesData[0].upload_session_id!);

    if (error) {
      console.error('이미지에 post_id 업데이트에 실패했습니다:', error.message);
      throw new Error('이미지 업데이트 오류');
    }
  };

  // 태그 저장 함수
  const saveTags = async (hashtags: string[], postId: string) => {
    const tagData = hashtags.map((tag) => ({
      tag_title: tag,
      post_id: postId,
      group_id: groupId,
    }));

    if (tagData.length > 0) {
      const { error } = await browserClient.from('tags').insert(tagData);
      if (error) {
        console.error('태그 저장에 실패했습니다:', error.message);
        throw new Error('태그 저장 오류');
      }
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
          label='해시태그'
          placeholder='해시태그는 다섯 개까지 작성 가능 합니다.'
          errorText={errors.hashtag ? String(errors.hashtag.message) : undefined}
          {...register('hashtag')}
        />
        {errors.hashtag && <p className='text-danger text-sm'>{String(errors.hashtag.message)}</p>}

        <Input
          type='date'
          label='날짜'
          errorText={errors.date ? String(errors.date.message) : undefined}
          {...register('date')}
        />
        {errors.date && <p className='text-danger text-sm'>{String(errors.date.message)}</p>}

        <Input
          type='time'
          label='시간'
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
