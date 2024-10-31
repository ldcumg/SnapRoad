'use client';

import browserClient from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

type ImageData = {
  post_image_name: string;
  post_lat: number; // 위도
  post_lng: number; // 경도
  upload_session_id: string; // 업로드 세션 ID
};

type PostFormProps = {
  groupId: string;
  userId: string;
  ImageData: ImageData[];
};

const PostForm = ({ groupId, userId }: PostFormProps) => {
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState<ImageData[]>([]); // 이미지 데이터를 저장할 상태

  // Supabase에서 이미지를 가져오는 useEffect
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await browserClient
        .from('images')
        .select('post_image_name, post_lat, post_lng, upload_session_id') // 필요한 필드 선택
        .eq('user_id', userId); // userId로 필터링

      if (error) {
        console.error('이미지 데이터 가져오기 오류:', error.message);
      } else {
        console.log('가져온 이미지 데이터:', data); // 콘솔로 데이터 확인
        setImagesData(data || []); // 가져온 데이터 저장
      }
    };

    fetchImages();
  }, [userId]);

  return (
    <div className='PostForm'>
      <h1>그룹 {groupId} 포스트 작성</h1>
      <form className='w-full border border-black flex flex-col'>
        <label htmlFor='description'>대표</label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          placeholder='이행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        <span>{description.length} / 1000</span>

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
      </form>

      <div className='mt-4'>
        <h2>업로드된 이미지</h2>
        <ul>
          {imagesData.map((image) => (
            <li key={`${image.post_image_name}-${image.upload_session_id}`}>
              <img
                src={image.post_image_name}
                alt={image.post_image_name}
                className='w-32 h-32 object-cover'
              />
              <p>
                위도: {image.latitude}, 경도: {image.longitude}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostForm;
