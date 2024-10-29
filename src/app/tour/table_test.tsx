'use client';

import { downloadSingleFile, downloadAllAsZip } from '@/services/client-action/downloadAction';
import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber, formatDateToPostgres } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface ImageData {
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
}

const TourPage = () => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const formattedDate = formatDateToNumber(new Date().toString()) || '';

  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE - 세션에서 user_id 가져오기
  const fetchUserId = async () => {
    const {
      data: { session },
    } = await browserClient.auth.getSession();
    return session?.user.id;
  };

  // NOTE - Supabase에서 서명된 URL 가져오기
  const fetchSignedUrl = async (filename: string) => {
    const { data, error } = await browserClient.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${filename}`, 60 * 60); // 60분 유효

    if (error) throw new Error('Signed URL 생성 실패');
    return data.signedUrl;
  };

  // NOTE - 이미지 데이터의 Blob URL 갱신
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

  // NOTE - 일정 간격마다 Blob URL 갱신
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshBlobUrls();
      },
      60 * 60 * 1000, // 60분 유효
    );
    return () => clearInterval(interval);
  }, [imageData]);

  // NOTE - 파일 업로드
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
          const blobUrl = URL.createObjectURL(blob); // Blob URL 생성
          const exifData = exifDataArray[index];
          const fileNameWithoutExtension = removeFileExtension(uploadedFile[0].filename);

          const { data: dbData, error: dbError } = await browserClient
            .from('images_test')
            .insert({
              post_image_name: fileNameWithoutExtension,
              post_image_url: signedUrl,
              post_lat: exifData.latitude,
              post_lng: exifData.longitude,
              origin_created_at: formatDateToPostgres(exifData.dateTaken),
              created_at: new Date().toISOString(),
              is_cover: false,
            })
            .select('*');

          if (dbError) console.error('데이터베이스에 저장하는 동안 오류 발생:', dbError.message);
          else console.log('데이터 저장 성공:', dbData);
          return { blobUrl, filename: uniqueFileName, ...exifData, isCover: false };
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

  const fetchImageData = async () => {
    try {
      const { data, error } = await browserClient
        .from('images_test') // 'images' 테이블을 조회
        .select('*'); // 모든 필드를 선택

      if (error) throw new Error(`데이터 조회 중 오류 발생: ${error.message}`);

      // 데이터 조회 성공 시 콘솔에 출력
      console.log('테이블 데이터:', data);
    } catch (err) {
      console.error('데이터 조회 오류:', err);
    }
  };

  // 페이지가 로드될 때 자동으로 데이터 조회
  useEffect(() => {
    fetchImageData();
  }, []);

  // 대표 이미지 설정
  const handleCoverImage = async (filename: string) => {
    const user_id = await fetchUserId();
    console.log(user_id);
    if (!user_id) {
      setError('사용자 인증 오류.');
      return;
    }

    try {
      // 해당 사용자의 기존 대표 이미지 해제
      const { error: updateError } = await browserClient
        .from('images_test')
        .update({ is_cover: false })
        .eq('user_id', user_id);

      if (updateError) throw new Error(`대표 이미지 해제 중 오류 발생: ${updateError.message}`);

      // 선택한 이미지를 대표 이미지로 설정
      const { error: coverError } = await browserClient
        .from('images_test')
        .update({ is_cover: true })
        .eq('user_id', user_id)
        .eq('post_image_url', `${folderName}/${filename}`);

      if (coverError) throw new Error(`대표 이미지 설정 중 오류 발생: ${coverError.message}`);

      const updatedImages = imageData.map((image) => ({
        ...image,
        isCover: image.filename === filename,
      }));

      setImageData(updatedImages);
    } catch (error) {
      console.error('대표 이미지 설정 중 오류 발생:', error);
      setError('대표 이미지 설정 중 오류가 발생했습니다.');
    }
  };

  // 이미지 삭제
  const deleteImage = async (filename: string) => {
    const user_id = await fetchUserId();
    if (!user_id) {
      setError('사용자 인증 오류.');
      return false;
    }

    try {
      // 스토리지에서 파일 삭제
      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);

      if (storageError) throw new Error(`스토리지에서 파일 삭제 중 오류 발생: ${storageError.message}`);

      // 데이터베이스에서 이미지 삭제
      const { error: dbError } = await browserClient
        .from('images_test')
        .delete()
        .eq('user_id', user_id)
        .eq('post_image_url', `${folderName}/${filename}`);
      console.log('Full Path:', `${folderName}/${filename}`);

      if (dbError) throw new Error(`데이터베이스에서 이미지 삭제 중 오류 발생: ${dbError.message}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // NOTE - 파일 삭제 UI
  const handleDeleteImage = async (filename: string) => {
    setLoading(true);
    const isDeleted = await deleteImage(filename);
    console.log(isDeleted);
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
                <button
                  onClick={() => handleCoverImage(image.filename)}
                  disabled={image.isCover}
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
