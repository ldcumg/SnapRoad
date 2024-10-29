'use client';

import { downloadSingleFile, downloadAllAsZip } from '@/services/client-action/downloadAction';
import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface ImageData {
  id: number;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
  userId?: string;
  createdAt: string;
}

// 사용자 세션
const fetchUserSession = async () => {
  const {
    data: { session },
  } = await browserClient.auth.getSession();
  return session;
};

const TourPage = () => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const currentDate = new Date().toISOString();
  const formattedDate = formatDateToNumber(new Date().toString()) || '';

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['userSession'],
    queryFn: fetchUserSession,
  });

  const userId = session?.user?.id;
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sessionError) {
    console.error('세션 가져오기 실패:', sessionError);
    return <p>세션 로드에 실패했습니다.</p>;
  }

  if (sessionLoading) return <div>로딩 중...</div>;

  if (!userId) return <p>로그인이 필요합니다.</p>;

  // Supabase에서 서명된 URL 가져오기
  const fetchSignedUrl = async (filename: string) => {
    const { data, error } = await browserClient.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${filename}`, 60 * 60);

    if (error) throw new Error('Signed URL 생성 실패');
    return data.signedUrl;
  };

  // 이미지 데이터의 Blob URL 갱신
  const refreshBlobUrls = async () => {
    try {
      const updatedImageData = await Promise.all(
        imageData.map(async (image) => {
          const signedUrl = await fetchSignedUrl(image.filename);
          const response = await fetch(signedUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          return { ...image, blobUrl };
        }),
      );
      setImageData(updatedImageData);
    } catch (err) {
      console.error('Blob URL 갱신 중 오류 발생:', err);
      setError('이미지 URL 갱신 중 오류가 발생했습니다.');
    }
  };

  // 파일 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) {
      setError('업로드할 파일을 선택하세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));
      const exifResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();
      console.log('EXIF 데이터:', exifDataArray);

      const uploadedFiles = await Promise.all(
        files.map(async (file, index) => {
          const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
          const uploadedFile = await uploadImage([file], folderName, bucketName);
          const signedUrl = await fetchSignedUrl(uniqueFileName);
          const response = await fetch(signedUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const exifData = exifDataArray[index];
          const fileNameWithoutExtension = removeFileExtension(uploadedFile[0].filename);

          const { data, error } = await browserClient
            .from('images')
            .insert({
              post_image_name: fileNameWithoutExtension,
              post_image_url: signedUrl,
              created_at: currentDate,
              is_cover: false,
              post_lat: exifData.latitude,
              post_lng: exifData.longitude,
              origin_created_at: formatDateToNumber(exifData.dateTaken),
              user_id: userId,
            })
            .select();

          if (error) {
            console.error('데이터베이스에 저장하는 동안 오류 발생:', error.message);
            throw new Error(error.message);
          }

          return {
            blobUrl,
            id: data[0].id,
            userId: data[0].user_id,
            isCover: data[0].is_cover,
            createdAt: currentDate,
            filename: uniqueFileName,
            latitude: exifData.latitude,
            longitude: exifData.longitude,
            dateTaken: exifData.dateTaken,
          };
        }),
      );

      const filteredData = uploadedFiles.filter((image) => image.userId === userId);
      setImageData(filteredData);
      console.log('이미지 업로드에 성공했습니다.');
    } catch (err) {
      console.error('이미지 업로드 에러:', err);
      setError('이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 특정 created_at 기준으로 대표 이미지 설정
  const handleSetCoverImage = async (id: number, createdAt: string) => {
    try {
      await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId).eq('created_at', createdAt);
      await browserClient.from('images').update({ is_cover: true }).eq('id', id);

      const updatedImages = imageData.map((image) =>
        image.id === id && image.createdAt === createdAt ? { ...image, isCover: true } : { ...image, isCover: false },
      );

      setImageData(updatedImages);
    } catch (error) {
      console.error('대표 이미지 상태 업데이트 중 오류 발생:', error);
      setError('대표 이미지 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const deleteImage = async (id: number, filename: string) => {
    try {
      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);

      if (storageError) throw new Error(`스토리지에서 파일 삭제 중 오류 발생: ${storageError.message}`);

      const { error: dbError } = await browserClient.from('images').delete().eq('id', id);

      if (dbError) throw new Error(`데이터베이스에서 이미지 삭제 중 오류 발생: ${dbError.message}`);
      console.log(`이미지 삭제 성공: ${id}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleDeleteImage = async (id: number, filename: string) => {
    setLoading(true);
    const isDeleted = await deleteImage(id, filename);

    if (isDeleted) {
      const updatedImageData = imageData.filter((image) => image.id !== id);
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
                key={image.id}
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
                  onClick={() => handleDeleteImage(image.id, image.filename)}
                  disabled={loading}
                >
                  삭제
                </button>
                <button
                  onClick={() => handleSetCoverImage(image.id, image.createdAt)}
                  disabled={loading}
                >
                  {image.isCover ? '대표 이미지로 설정됨' : '대표 이미지 설정'}
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
