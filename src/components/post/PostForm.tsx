'use client';

import { UploadedImageData } from './type';
import { fetchSignedUrl } from '@/services/client-action/imageActions';
import { useEffect, useState } from 'react';

type PostFormProps = {
  groupId: string;
  userId: string;
  // path: string;
  imagesData: UploadedImageData[];
};

const PostForm = ({ groupId, userId, imagesData }: PostFormProps) => {
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  useEffect(() => {
    console.log('업로드된 이미지 데이터:', imagesData);
  }, [imagesData]);

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
          placeholder='여행을 떠나고 싶은 마음으로.'
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

        <label htmlFor='hashtag'>해시태그</label>
        <input
          type='text'
          id='hashtag'
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          className='hashtag-input'
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
    </div>
  );
};

export default PostForm;
