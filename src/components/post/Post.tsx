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
  const [description, setDescription] = useState('');
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

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
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .insert(postData)
        .select('post_id')
        .single();
      if (postError || !post) throw new Error(postError?.message || '포스트 저장 오류');
      console.log('포스트가 성공적으로 제출되었습니다. post_id:', post.post_id);
      await updateImagePostId(post.post_id);
      await saveTags(data.hashtag, post.post_id);

      const place = decodedAddressName;
      const postId = post.post_id;
      console.log('Place:', place);
      console.log('post_id:', postId);

      // router.push(`/group/${groupId}`);
      // router.push(`/grouplist`);
      router.push(`/group/${groupId}/post/${postId}`);
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
    <div className='PostForm p-4'>
      <form
        className='w-full flex flex-col space-y-2'
        onSubmit={handleSubmit(onHandlePostSubmit)}
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
          {errors.description?.message && <p className='text-danger text-sm'>{String(errors.description.message)}</p>}
        </div>
        <Input
          type='text'
          {...register('hashtag')}
          placeholder='# 해시태그를 추가해 보세요'
        />
        {errors.hashtag?.message && <p className='text-danger text-sm'>{String(errors.hashtag.message)}</p>}

        <input
          type='date'
          className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 '
          {...register('date')}
        />
        {errors.date?.message && <p className='text-danger text-sm'>{String(errors.date.message)}</p>}

        <input
          type='time'
          className='w-full py-3 px-3 focus:outline-none focus:ring-2 focus:border-gray-300 '
          {...register('time')}
        />
        {errors.time?.message && <p className='text-danger text-sm'>{String(errors.time.message)}</p>}
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
