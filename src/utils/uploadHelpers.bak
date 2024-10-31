import { formatDateToNumber } from './dateUtils';
import browserClient from './supabase/client';
import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { fetchSignedUrl } from '@/services/client-action/imageActions';
import { uploadImage } from '@/services/client-action/uploadImage';

// EXIF 데이터 가져오기
export const fetchExifData = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');

  return response.json();
};

// 고유 파일 이름 생성
export const createUniqueFileName = async (fileName: string, folderName: string, bucketName: string) => {
  // 파일명 생성 로직 (예: UUID 사용)
  return generateUniqueFileName(fileName, folderName, bucketName);
};

// 이미지 업로드
export const uploadImageFile = async (file: File, folderName: string, bucketName: string) => {
  return uploadImage([file], folderName, bucketName);
};

// 사인된 URL 가져오기
export const getSignedUrl = async (uniqueFileName: string) => {
  return fetchSignedUrl(uniqueFileName);
};

// 데이터베이스에 이미지 정보 저장
export const saveImageDataToDB = async (imageData: {
  fileNameWithoutExtension: string;
  signedUrl: string;
  latitude: number;
  longitude: number;
  dateTaken: string;
  userId: string;
  currentDate: string;
}) => {
  const { data, error } = await browserClient
    .from('images')
    .insert({
      post_image_name: imageData.fileNameWithoutExtension,
      post_image_url: imageData.signedUrl,
      created_at: imageData.currentDate,
      is_cover: false,
      post_lat: imageData.latitude,
      post_lng: imageData.longitude,
      origin_created_at: formatDateToNumber(imageData.dateTaken),
      user_id: imageData.userId,
    })
    .select();

  if (error) throw new Error(error.message);

  return data;
};
