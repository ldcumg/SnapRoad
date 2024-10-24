'use client';

import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber } from '@/utils/dateUtils';
import browserClient from '@/utils/supabase/client';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';

const TourPage = () => {
  const [imageData, setImageData] = useState<{ url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formattedDate = formatDateToNumber(new Date().toString());


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

  // 개별 이미지 다운로드
  const handleDownloadSingle = async (filename: string) => {
    try {
      const { data, error } = await browserClient.storage.from('tour_images').download(`group_name/${filename}`);
      if (error || !data) throw new Error('파일 다운로드 실패');

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    } catch (err) {
      console.error('이미지 다운로드 오류:', err);
    }
  };

  // 모든 이미지를 ZIP으로 다운로드
  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    for (const image of imageData) {
      try {
        const { data, error } = await browserClient.storage
          .from('tour_images')
          .download(`group_name/${image.filename}`);
        if (error || !data) {
          console.error('파일 다운로드 실패:', error);
          continue;
        }

        zip.file(image.filename, data);
      } catch (err) {
        console.error('파일 추가 중 오류 발생:', err);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    // saveAs(zipBlob, 'images.zip');
    saveAs(zipBlob, `images_${formattedDate}.zip`);
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
                  <button onClick={() => handleDownloadSingle(image.filename)}>개별 다운로드</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {imageData.length > 0 && (
          <>
            <button onClick={handleDownloadAllAsZip}>ZIP 파일로 다운로드</button>
          </>
        )}
        <hr />
      </article>
    </section>
  );
};

export default TourPage;
