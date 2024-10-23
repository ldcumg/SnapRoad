'use client';

import browserClient from '@/utils/supabase/client';
import { useState } from 'react';

// 이미지 업로드 함수
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const supabase = browserClient;

    // 파일 업로드
    const { data, error } = await supabase.storage.from('tour_images').upload(`group_name/${file.name}`, file);

    if (error) throw error;

    // 업로드된 파일의 퍼블릭 URL 생성
    const { data: publicUrlData } = supabase.storage.from('tour_images').getPublicUrl(`group_name/${file.name}`);

    if (!publicUrlData) throw new Error('퍼블릭 URL을 가져올 수 없습니다.');

    console.log('이미지 업로드 성공:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl; // 퍼블릭 URL 반환
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

const TourPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const uploadedImageUrl = await uploadImage(file);

      if (uploadedImageUrl) {
        setImageUrl(uploadedImageUrl);
      } else {
        setError('이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='Tour'>
      {/* 이미지 업로드 */}
      <article>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageUpload}
        />
        {loading && <p>이미지 업로드 중...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {imageUrl && (
          <div>
            <p>업로드된 이미지</p>
            <img
              src={imageUrl}
              alt='Uploaded'
              style={{ maxWidth: '300px' }}
            />
          </div>
        )}
        <hr />
      </article>
    </section>
  );
};

export default TourPage;
