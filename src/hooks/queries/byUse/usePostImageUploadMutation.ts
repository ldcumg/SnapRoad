import { fetchSignedUrl, saveImageMetadata, uploadFileToStorage } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { generateUniqueFileName } from '@/utils/fileNameUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

/**
 * 이미지 자동 업로드를 처리
 * 파일의 메타데이터(EXIF)를 가져와 데이터베이스에 저장하고,
 * 생성된 URL을 통해 이미지의 Blob URL을 반환
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @param userId 사용자 ID
 * @returns 업로드된 이미지 목록을 포함한 React Query Mutation 객체
 */

export function useUploadImage(bucketName: string, folderName: string, userId: string) {
  const queryClient = useQueryClient();
  const { setImages } = useImageUploadStore();
  const currentDate = new Date().toISOString();
  const uploadSessionId = uuidv4();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
          await uploadFileToStorage(bucketName, folderName, uniqueFileName, file);
          const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);

          const response = await fetch(signedUrl);
          const blobUrl = URL.createObjectURL(await response.blob());
          const exifData = exifDataArray[index];

          const savedData = await saveImageMetadata(
            uniqueFileName,
            signedUrl,
            exifData,
            userId,
            currentDate,
            uploadSessionId,
          );

          return {
            blobUrl,
            id: savedData.id,
            userId: savedData.user_id,
            isCover: savedData.is_cover,
            postImageName: uniqueFileName,
            createdAt: currentDate,
            filename: uniqueFileName,
            latitude: exifData.latitude,
            longitude: exifData.longitude,
            dateTaken: exifData.dateTaken,
            uploadSessionId,
          };
        }),
      );

      setImages(uploadedImages);
      return uploadedImages;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
  });
}
