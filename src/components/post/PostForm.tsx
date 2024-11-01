'use client';

import { UploadedImageData } from './type';
import { fetchSignedUrl } from '@/services/client-action/imageActions';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PostFormProps = {
  groupId: string;
  userId: string;
  lat?: number;
  lng?: number;
  imagesData: UploadedImageData[];
  addressName?: string;
};

const PostForm = ({ lat, lng, groupId, userId, imagesData, addressName }: PostFormProps) => {
  const router = useRouter();
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (lat && lng) {
      console.log('위도:', lat);
      console.log('경도:', lng);
    }
    if (addressName) {
      console.log('주소:', addressName);
    }
  }, [lat, lng, addressName]);

  // 이미지 URL 생성
  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        imagesData.map(async (image) => {
          const url = await fetchSignedUrl('tour_images', groupId, image.filename);
          return url;
        }),
      );
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [imagesData, groupId]);

  // 폼 제출 핸들러
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // 대표 이미지 설정 및 위치 정보
    const coverImage = imagesData.find((image) => image.isCover);
    const locationImage = imagesData.find((image) => image.latitude && image.longitude);
    const defaultLat = '위도 없음';
    const defaultLng = '경도 없음';
    const postLat = locationImage?.latitude || defaultLat;
    const postLng = locationImage?.longitude || defaultLng;
    const imageArray = imagesData.map((image) => image.filename);

    // 제출 데이터 준비
    const postData = {
      user_id: userId,
      group_id: groupId,
      post_desc: description,
      post_date: date,
      post_time: time,
      post_lat: postLat,
      post_lng: postLng,
      post_thumbnail_image: coverImage?.filename || null,
      image_array: imageArray,
      post_address: decodedAddressName || null,
    };

    try {
      // posts 테이블에 포스트 데이터 삽입 및 post_id 반환
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .insert(postData)
        .select('post_id')
        .single();

      if (postError || !post) {
        console.error('포스트 제출에 실패했습니다:', postError?.message);
        return;
      }

      console.log('포스트가 성공적으로 제출되었습니다. post_id:', post, postData);

      // 생성된 post_id
      const postId = post.post_id;

      // images 테이블에 모든 이미지의 post_id 업데이트
      const { error: imageError } = await browserClient
        .from('images')
        .update({ post_id: postId })
        .eq('upload_session_id', imagesData[0].uploadSessionId); // 업로드 세션 ID를 사용하여 특정 이미지 그룹만 업데이트

      if (imageError) {
        console.error('이미지에 post_id 업데이트에 실패했습니다:', imageError.message);
      } else {
        console.log('이미지의 post_id가 성공적으로 업데이트되었습니다.');
      }

      // 해시태그 데이터를 tags 테이블에 저장
      const tags = hashtag
        .split(' ')
        .map((tag) => tag.trim())
        .filter((tag) => tag); // 공백으로 구분하여 해시태그 배열 생성
      const tagData = tags.map((tag) => ({
        tag_title: tag,
        post_id: post.post_id, // posts 테이블에서 반환된 post_id 사용
        group_id: groupId, // 그룹 ID는 기존 값 사용
      }));

      if (tagData.length > 0) {
        const { error: tagError } = await browserClient.from('tags').insert(tagData);
        if (tagError) {
          console.error('태그 저장에 실패했습니다:', tagError.message);
        } else {
          console.log('태그가 성공적으로 저장되었습니다.');
        }

        // router.push(`/group/${groupId}`);
      }
    } catch (error) {
      console.error('포스트 제출 중 오류 발생:', error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='PostForm'>
      <form
        className='w-full border border-black flex flex-col'
        onSubmit={submitPost}
      >
        <label htmlFor='description'>대표</label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          placeholder='여행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        <span>{description.length} / 1000</span>

        <label htmlFor='hashtag'>해시태그</label>
        <input
          type='text'
          id='hashtag'
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder='예: 여행 친구랑'
          className='hashtag-input'
        />

        <label htmlFor='date'>날짜</label>
        <input
          type='date'
          id='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='date-input'
        />

        <label htmlFor='time'>시간</label>
        <input
          type='time'
          id='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className='time-input'
        />

        <button
          type='submit'
          className='submit-button'
        >
          포스트 제출
        </button>
      </form>
    </div>
  );
};

export default PostForm;
