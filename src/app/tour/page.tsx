'use client';

import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber, formatDateToPostgres } from '@/utils/dateUtils';
import { downloadSingleFile, downloadAllAsZip } from '@/utils/downloadUtils';
import browserClient from '@/utils/supabase/client';
import { useState } from 'react';

interface ImageData {
  url: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
}

const TourPage = () => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const formattedDate = formatDateToNumber(new Date().toString());

  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) {
      setError('업로드할 파일을 선택하세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 파일 업로드 EXIF 정보를 추출 & 서버에 EXIF 데이터 요청
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!exifResponse.ok) {
        throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      }

      const exifDataArray = await exifResponse.json();
      console.log('EXIF 데이터:', exifDataArray);

      const uploadedFiles = await Promise.all(
        files.map(async (file, index) => {
          const uploadedFile = await uploadImage([file]);

          // 업로드된 파일의 서명된 URL 생성 (Signed URL)
          const { data, error } = await browserClient.storage
            .from(bucketName)
            .createSignedUrl(`${folderName}/${uploadedFile[0].filename}`, 60 * 60);

          if (error || !data) throw new Error('Signed URL 생성 실패');

          const signedUrl = data.signedUrl;
          const exifData = exifDataArray[index];

          const { data: dbData, error: dbError } = await browserClient.from('images').insert({
            post_image_url: signedUrl,
            post_lat: exifData.latitude,
            post_lng: exifData.longitude,
            origin_created_at: formatDateToPostgres(exifData.dateTaken),
            created_at: new Date().toISOString(),
          });

          if (dbError) {
            console.error('데이터베이스에 저장하는 동안 오류 발생:', dbError.message);
          } else {
            console.log('데이터 저장 성공:', dbData);
          }

          return { url: signedUrl, filename: uploadedFile[0].filename, ...exifData };
        }),
      );

      setImageData(uploadedFiles);
      console.log('이미지 업로드에 성공했습니다.');
    } catch (err) {
      console.error('이미지 업로드 에러:', err);
      setError('이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderUploadStatus = () => {
    if (loading) return <p>이미지 업로드 중...</p>;
    if (error) return <p className='text-red-500'>{error}</p>;
    return null;
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

        {renderUploadStatus()}

        {imageData.length > 0 && (
          <>
            {console.log('렌더링된 이미지 데이터:', imageData)}
            <div className='flex flex-row gap-2 p-3'>
              {imageData.map((image, index) => (
                <div
                  key={index}
                  style={{ maxWidth: '300px', margin: '10px' }}
                >
                  <img
                    src={image.url}
                    alt={`업로드 이미지 ${index}`}
                    style={{ width: '100%' }}
                  />
                  <p>파일명: {image.filename}</p>
                  <p>위도: {image.latitude}</p>
                  <p>경도: {image.longitude}</p>
                  <p>촬영 날짜: {formatDateToNumber(image.dateTaken)}</p>
                  <button onClick={() => downloadSingleFile(bucketName, image.filename, folderName)}>
                    개별 다운로드
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => downloadAllAsZip(bucketName, imageData, `images_${formattedDate}.zip`, folderName)}>
              ZIP 파일로 다운로드
            </button>
          </>
        )}
        <hr />
      </article>
    </section>
  );
};

export default TourPage;
