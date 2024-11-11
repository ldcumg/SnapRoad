'use client';

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

interface PostFormProps {
  initialData?: PostFormData | null;
}

const EditPostForm = ({ initialData }: PostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = usePostForm();

  const { userId, groupId, lat, lng, addressName } = usePostDataStore();
  const { images: imagesData } = useImageUploadStore();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  // 초기 데이터를 불러와 폼에 설정
  useEffect(() => {
    if (initialData) {
      reset(initialData); // 폼을 초기 데이터로 리셋
      setDescription(initialData.description || ''); // 설명 필드 업데이트
    }
  }, [initialData, reset]);

  // 이미지 URL을 비동기로 가져오기
  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!groupId || !userId) return; // groupId나 userId가 없으면 종료
      try {
        const urls = await Promise.all(
          imagesData.map(async (image) => {
            if (!image.post_image_name) {
              return '/path/to/default/image.png'; // 기본 이미지 반환
            }
            const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name); // 이미지 URL 가져오기
            return url;
          }),
        );
        setImageUrls(urls); // 가져온 URL을 상태에 설정
      } catch (error) {
        console.error('이미지 URL 가져오기 오류:', error); // 오류 로그 출력
      }
    };
    fetchImageUrls(); // 함수 호출
  }, [imagesData, groupId, userId]);

  // 포스트 데이터를 생성하는 함수
  const createPostData = (data: FieldValues) => {
    const coverImage = imagesData.find((image) => image.is_cover); // 대표 이미지 찾기
    return {
      user_id: userId,
      group_id: groupId,
      post_desc: data.description,
      post_date: data.date,
      post_time: data.time,
      post_lat: lat || null, // 위도 설정
      post_lng: lng || null, // 경도 설정
      post_thumbnail_image: coverImage?.post_image_name!, // 대표 이미지 설정
      image_array: imagesData.map((image) => image.post_image_name || ''), // 이미지 배열 설정
      post_address: decodedAddressName!,
    };
  };

  // 포스트 제출 함수
  const onHandlePostSubmit = async (data: FieldValues) => {
    const postData = createPostData(data); // 포스트 데이터 생성
    try {
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .upsert(postData, { onConflict: 'post_id' }) // 포스트 데이터 삽입 또는 업데이트
        .select('post_id')
        .single();
      if (postError || !post) throw new Error(postError?.message || '포스트 저장 오류'); // 오류 처리
      await updateImagePostId(post.post_id); // 이미지 post_id 업데이트
      await saveTags(data.hashtag, post.post_id); // 태그 저장

      const postId = post.post_id;
      router.push(`/group/${groupId}/post/${postId}`); // 페이지 이동
    } catch (error) {
      console.error('포스트 제출 중 오류 발생:', error); // 오류 로그 출력
    }
  };

  // 이미지에 post_id 업데이트 함수
  const updateImagePostId = async (postId: string) => {
    const { error } = await browserClient
      .from('images')
      .update({ post_id: postId }) // post_id 업데이트
      .eq('upload_session_id', imagesData[0].upload_session_id!);
    if (error) {
      console.error('이미지에 post_id 업데이트에 실패했습니다:', error.message); // 오류 로그 출력
      throw new Error('이미지 업데이트 오류');
    }
  };

  // 태그 저장 함수
  const saveTags = async (hashtags: string[], postId: string) => {
    if (!groupId) {
      console.error('groupId가 없습니다.'); // 오류 로그 출력
      throw new Error('groupId가 필요합니다.');
    }

    const tagData = hashtags.map((tag) => ({
      tag_title: tag,
      post_id: postId,
      group_id: groupId,
    }));
    if (tagData.length > 0) {
      const { error } = await browserClient.from('tags').insert(tagData); // 태그 데이터 삽입
      if (error) {
        console.error('태그 저장에 실패했습니다:', error.message); // 오류 로그 출력
        throw new Error('태그 저장 오류');
      }
    }
  };

  return (
    <div className='PostForm p-4'>
      <form
        className='flex w-full flex-col space-y-2'
        onSubmit={handleSubmit(onHandlePostSubmit)}
      >
        <div className='relative'>
          <textarea
            id='description'
            {...register('description')}
            maxLength={1000}
            placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
            className='h-36 w-full rounded-lg border border-gray-300 bg-white px-3 pb-12 pt-3 text-base text-gray-900 focus:border-gray-300 focus:ring-2'
            onChange={handleChange}
          />
          <div className='absolute bottom-2 right-2 w-full pb-1 pr-1 text-right text-sm text-gray-500'>
            {description.length}/1000 {/* 글자 수 표시 */}
          </div>
          {errors.description?.message && <p className='text-sm text-danger'>{String(errors.description.message)}</p>}
        </div>
        <Input
          type='text'
          {...register('hashtag')}
          placeholder='# 해시태그를 추가해 보세요'
        />
        {errors.hashtag?.message && <p className='text-sm text-danger'>{String(errors.hashtag.message)}</p>}

        <input
          type='date'
          className='w-full px-3 py-3 focus:border-gray-300 focus:outline-none focus:ring-2'
          {...register('date')}
        />
        {errors.date?.message && <p className='text-sm text-danger'>{String(errors.date.message)}</p>}

        <input
          type='time'
          className='w-full px-3 py-3 focus:border-gray-300 focus:outline-none focus:ring-2'
          {...register('time')}
        />
        {errors.time?.message && <p className='text-sm text-danger'>{String(errors.time.message)}</p>}
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

export default EditPostForm;
