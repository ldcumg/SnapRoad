'use client';

import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber, formatDateToPostgres } from '@/utils/dateUtils';
import { downloadSingleFile, downloadAllAsZip } from '@/utils/downloadUtils';
import { removeFileExtension, generateUniqueFileName } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface ImageData {
  blobUrl: string;
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
          // 중복된 파일명 처리
          const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
          const uploadedFile = await uploadImage([file], folderName, bucketName);

          // Supabase에서 서명된 URL을 가져와 Blob으로 변환
          const { data, error } = await browserClient.storage
            .from(bucketName)
            .createSignedUrl(`${folderName}/${uniqueFileName}`, 60 * 60 * 1000);

          if (error || !data) throw new Error('Signed URL 생성 실패');

          const response = await fetch(data.signedUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob); // Blob URL 생성

          const exifData = exifDataArray[index];
          const fileNameWithoutExtension = removeFileExtension(uploadedFile[0].filename);

          // 데이터베이스에 파일 정보 저장
          const { data: dbData, error: dbError } = await browserClient.from('images').insert({
            post_image_name: fileNameWithoutExtension,
            post_image_url: data.signedUrl,
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

          return { blobUrl, filename: uniqueFileName, ...exifData };
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

  const deleteImage = async (filename: string) => {
    try {
      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);

      if (storageError) {
        throw new Error(`스토리지에서 파일 삭제 중 오류 발생: ${storageError.message}`);
      }

      const { error: dbError } = await browserClient
        .from('images')
        .delete()
        .eq('post_image_url', `${folderName}/${filename}`);

      if (dbError) {
        throw new Error(`데이터베이스에서 이미지 삭제 중 오류 발생: ${dbError.message}`);
      }

      console.log(`이미지 삭제 성공: ${filename}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleDeleteImage = async (filename: string) => {
    setLoading(true);
    const isDeleted = await deleteImage(filename);

    if (isDeleted) {
      const updatedImageData = imageData.filter((image) => image.filename !== filename);
      setImageData(updatedImageData);
    } else {
      setError('이미지 삭제 중 오류가 발생했습니다.');
    }

    setLoading(false);
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
          <div className='flex flex-row gap-2 p-3'>
            {imageData.map((image, index) => (
              <div
                key={index}
                style={{ maxWidth: '300px', margin: '10px' }}
              >
                <img
                  src={image.blobUrl}
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
                <button
                  onClick={() => handleDeleteImage(image.filename)}
                  disabled={loading}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => downloadAllAsZip(bucketName, imageData, `images_${formattedDate}.zip`, folderName)}>
          ZIP 파일로 다운로드
        </button>
        <hr />
      </article>
    </section>
  );
};

export default TourPage;
