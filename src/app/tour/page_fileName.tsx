'use client';

import FileUpload from '@/components/tour/FileUpload';
import { uploadImage } from '@/services/client-action/uploadImage';
import { useState } from 'react';

const TourPage = () => {
  const [imageData, setImageData] = useState<{ url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const uploadedFiles = await uploadImage(files);
      uploadedFiles.length > 0 ? setImageData(uploadedFiles) : setError('이미지 업로드에 실패했습니다.');
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
        <p>Tour_Images</p>
        <div className='flex flex-row gap-2 p-3'>
          {imageData.length > 0 && (
            <div className='flex flex-row border border-black'>
              {imageData.map((image, index) => (
                <div
                  key={index}
                  style={{ maxWidth: '300px', margin: '10px' }}
                >
                  <img
                    src={image.url}
                    alt={`업로드 이미지 ${index}`}
                  />
                  <p>{image.filename}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <hr />
      </article>
      <FileUpload />
    </section>
  );
};
export default TourPage;
