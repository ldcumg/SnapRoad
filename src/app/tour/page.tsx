'use client';

import browserClient from '@/utils/supabase/client';
import { useState } from 'react';

// 이미지 업로드 함수
export const uploadImage = async (files: File[]): Promise<string[]> => {
  try {
    const supabase = browserClient;
    const urls: string[] = [];

    for (const file of files) {
      const { data, error } = await supabase.storage.from('tour_images').upload(`group_name/${file.name}`, file);
      if (error) throw error;

      // 업로드된 파일의 퍼블릭 URL 생성
      const { data: publicUrlData } = supabase.storage.from('tour_images').getPublicUrl(`group_name/${file.name}`);

      if (!publicUrlData) throw new Error('퍼블릭 URL을 가져올 수 없습니다.');

      console.log('이미지 업로드 성공:', publicUrlData.publicUrl);
      urls.push(publicUrlData.publicUrl);
    }
    return urls; // 퍼블릭 URL 배열 반환
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

const TourPage = () => {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const uploadedImageUrl = await uploadImage(files);
      uploadedImageUrl ? setImageUrl(uploadedImageUrl) : setError('이미지 업로드에 실패했습니다.');
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <article>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageUpload}
        />
        {loading && <p>이미지 업로드 중...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {imageUrl.length > 0 && (
          <div>
            <p>업로드된 이미지</p>
            {imageUrl.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`업로드 이미지 ${index}`}
                style={{ maxWidth: '300px', margin: '10px' }}
              />
            ))}
          </div>
        )}
        <hr />
      </article>
    </section>
  );
};

export default TourPage;
