import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';


/**
 * Supabase Storage에 업로드된 파일의 Signed URL을 가져옵니다.
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param filename 파일 이름
 * @returns 생성된 Signed URL
 * @throws URL 생성 실패 시 에러 메시지를 반환
 */

export const fetchSignedUrl = async (bucketName: string, folderName: string, filename: string) => {
  const { data, error } = await browserClient.storage
    .from(bucketName)
    .createSignedUrl(`${folderName}/${filename}`, 60 * 60);
  if (error) throw new Error('Signed URL 생성 실패');
  return data.signedUrl;
};

/**
 * 이미지 자동 업로드를 처리하는 훅입니다.
 * 파일의 메타데이터(EXIF)를 가져와 데이터베이스에 저장하고, 
 * 생성된 URL을 통해 이미지의 Blob URL을 반환합니다.
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param userId 사용자 ID
 * @returns 업로드된 이미지 목록을 포함한 React Query Mutation 객체
 */

export function useUploadImage(bucketName: string, folderName: string, userId: string) {
  const queryClient = useQueryClient();
  const { addImages } = useImageUploadStore();
  const currentDate = new Date().toISOString();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
          await browserClient.storage.from(bucketName).upload(`${folderName}/${uniqueFileName}`, file);
          const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);
          const response = await fetch(signedUrl);
          const blobUrl = URL.createObjectURL(await response.blob());
          const exifData = exifDataArray[index];

          const { data, error } = await browserClient
            .from('images')
            .insert({
              post_image_name: uniqueFileName,
              post_image_url: signedUrl,
              created_at: currentDate,
              is_cover: false,
              post_lat: exifData.latitude,
              post_lng: exifData.longitude,
              origin_created_at: formatDateToNumber(exifData.dateTaken),
              user_id: userId,
            })
            .select();

          if (error) throw new Error(error.message);
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

      addImages(uploadedImages);
      return uploadedImages;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
  });
}