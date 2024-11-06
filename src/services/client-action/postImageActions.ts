import { ImagesAllWithoutPostId, ImagesWithoutPostId } from '@/types/projectType';
import { formatDateToNumber } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';

/**
 * Supabase Storage에서 파일의 Signed URL을 생성
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param filename 파일 이름
 * @returns 생성된 Signed URL
 */

export const fetchSignedUrl = async (bucketName: string, folderName: string, filename: string) => {
  const { data, error } = await browserClient.storage
    .from(bucketName)
    .createSignedUrl(`${folderName}/${filename}`, 24 * 60 * 60 * 1000);
  if (error) {
    console.error('Signed URL 생성 오류:', error);
    throw new Error('Signed URL 생성 실패');
  }
  // console.log('singindUrl 성공', data.signedUrl);
  return data.signedUrl;
};

/**
 * Supabase Storage에 파일을 업로드
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param uniqueFileName 고유 파일 이름
 * @param file 업로드할 파일
 */

export const uploadFileToStorage = async (
  bucketName: string,
  folderName: string,
  uniqueFileName: string,
  file: File,
) => {
  const { data, error } = await browserClient.storage.from(bucketName).upload(`${folderName}/${uniqueFileName}`, file);
  if (error) throw new Error('파일 업로드 실패');
  return data?.path || `${folderName}/${uniqueFileName}`;
};

/**
 * Supabase 데이터베이스에 이미지 메타데이터를 저장
 * @param uniqueFileName 고유 파일 이름
 * @param signedUrl Signed URL
 * @param exifData EXIF 데이터 (위도, 경도, 촬영 날짜)
 * @param userId 사용자 ID
 * @param currentDate 현재 날짜
 */

export const saveImageMetadata = async (
  uniqueFileName: string,
  signedUrl: string,
  exifData: any,
  userId: string,
  groupId: string,
  currentDate: string,
  uploadSessionId: string,
): Promise<ImagesAllWithoutPostId> => {
  const { data, error } = await browserClient
    .from('images')
    .insert({
      post_image_name: removeFileExtension(uniqueFileName),
      post_image_url: signedUrl,
      created_at: currentDate,
      is_cover: false,
      post_lat: exifData.latitude,
      post_lng: exifData.longitude,
      origin_created_at: formatDateToNumber(exifData.dateTaken),
      user_id: userId,
      group_id: groupId,
      upload_session_id: uploadSessionId,
    })
    .select();

  if (error) {
    console.error('이미지 메타데이터 저장 실패:', error.message);
    throw new Error('이미지 메타데이터 저장 실패');
  }

  return {
    blobUrl: signedUrl,
    id: data[0].id,
    post_image_name: uniqueFileName,
    is_cover: false,
    isUploaded: true,
    user_id: userId,
    group_id: groupId,
    upload_session_id: uploadSessionId,
    created_at: currentDate,
    deleted_at: null,
    updated_at: currentDate,
    origin_created_at: formatDateToNumber(exifData.dateTaken),
    post_image_url: signedUrl,
    post_lat: exifData.latitude,
    post_lng: exifData.longitude,
  };
};

/**
 * 특정 사용자와 업로드 세션의 이미지를 초기화한 후, 특정 이미지를 대표 이미지로 설정합니다.
 * @param userId 사용자 ID
 * @param uploadSessionId 업로드 세션 ID
 * @param imageId 대표로 설정할 이미지 ID
 */

async function resetCoverImages(userId: string, uploadSessionId: string) {
  const { error } = await browserClient
    .from('images')
    .update({ is_cover: false })
    .eq('user_id', userId)
    .eq('upload_session_id', uploadSessionId);

  if (error) {
    console.error('대표 이미지 초기화 실패:', error.message);
    throw new Error('대표 이미지 초기화 실패');
  } else {
    console.log('모든 대표 이미지 초기화 성공');
  }
}

async function setCoverImage(imageId: number) {
  const { error } = await browserClient.from('images').update({ is_cover: true }).eq('id', imageId);

  if (error) {
    console.error('대표 이미지 설정 실패:', error.message);
    throw new Error('대표 이미지 설정 실패');
  } else {
    console.log('대표 이미지 설정 성공:', imageId);
  }
}

export async function updateCoverImage(imageId: number, userId: string, uploadSessionId: string) {
  console.log('대표 이미지 업데이트 중:', { userId, imageId, uploadSessionId });
  await resetCoverImages(userId, uploadSessionId); // 모든 이미지를 초기화
  await setCoverImage(imageId); // 특정 이미지에 대해서만 is_cover: true 설정
  console.log('대표 이미지가 설정되었습니다.');
}

/**
 * 이미지 ID로 데이터베이스에서 파일 이름을 가져옴
 * @param id 이미지 ID
 * @returns 파일 이름 (문자열)
 */

export const getImageFileNameById = async (id: number): Promise<string> => {
  const { data, error } = await browserClient.from('images').select('post_image_name').eq('id', id);
  if (error || !data || data.length === 0) throw new Error('이미지 이름을 가져오는 중 오류 발생');
  return data[0].post_image_name;
};

/**
 * Supabase 스토리지에서 파일을 삭제
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param filename 파일 이름
 */

export const deleteFileFromStorage = async (bucketName: string, folderName: string, filename: string) => {
  const { error } = await browserClient.storage.from(bucketName).remove([`${folderName}/${filename}`]);
  if (error) throw new Error(`스토리지에서 파일 삭제 중 오류 발생: ${error.message}`);
};

/**
 * 데이터베이스에서 이미지 정보를 삭제
 * @param id 이미지 ID
 */

export const deleteImageFromDatabase = async (id: number) => {
  const { error } = await browserClient.from('images').delete().eq('id', id);
  if (error) throw new Error('데이터베이스에서 이미지 삭제 중 오류 발생');
};
