
import { fetchSignedUrl, saveImageMetadata, uploadFileToStorage } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { ImagesAllWithoutPostId } from '@/types/projectType';
import { generateUniqueFileName } from '@/utils/fileNameUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

async function getBlobUrl(signedUrl: string): Promise<string> {
  const response = await fetch(signedUrl);
  if (!response.ok) throw new Error('Blob URL 생성 실패');
  return URL.createObjectURL(await response.blob());
}

export function useUploadImage(bucketName: string, folderName: string, userId: string, groupId: string) {
  const queryClient = useQueryClient();
  const { setImages } = useImageUploadStore();
  const currentDate = new Date().toISOString();
  const uploadSessionId = uuidv4();

  return useMutation({
    mutationFn: async (files: File[]): Promise<ImagesAllWithoutPostId[]> => {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          try {
            const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
            await uploadFileToStorage(bucketName, folderName, uniqueFileName, file);

            const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);
            const blobUrl = await getBlobUrl(signedUrl);
            const exifData = exifDataArray[index];

            const savedData = await saveImageMetadata(
              uniqueFileName,
              signedUrl,
              exifData,
              userId,
              groupId,
              currentDate,
              uploadSessionId,
            );

            return {
              blobUrl,
              id: savedData.id,
              user_id: savedData.user_id,
              is_cover: savedData.is_cover,
              post_image_name: uniqueFileName,
              isUploaded: true,
              created_at: currentDate,
              deleted_at: null,
              updated_at: currentDate,
              origin_created_at: exifData.dateTaken,
              post_image_url: signedUrl,
              post_lat: exifData.latitude,
              post_lng: exifData.longitude,
              upload_session_id: uploadSessionId,
              group_id: groupId,
            } as ImagesAllWithoutPostId;
          } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            throw error;
          }
        }),
      );

      setImages(uploadedImages);
      return uploadedImages;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
  });
}


// import { fetchSignedUrl, saveImageMetadata, uploadFileToStorage } from '@/services/client-action/postImageActions';
// import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
// import { ImagesAllWithoutPostId } from '@/types/projectType';
// import { generateUniqueFileName } from '@/utils/fileNameUtils';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import imageCompression from 'browser-image-compression';
// import { v4 as uuidv4 } from 'uuid';

// async function compressImage(file: File): Promise<File> {
//   const options = {
//     maxSizeMB: 1, // 최대 파일 크기 (MB 단위)
//     maxWidthOrHeight: 1920, // 최대 너비 또는 높이
//     useWebWorker: true, // 웹 워커를 사용하여 성능 향상
//   };
//   try {
//     return await imageCompression(file, options);
//   } catch (error) {
//     console.error('이미지 압축 중 오류 발생:', error);
//     throw new Error('이미지 압축 실패');
//   }
// }

// export function useUploadImage(bucketName: string, folderName: string, userId: string, groupId: string) {
//   const queryClient = useQueryClient();
//   const { setImages } = useImageUploadStore();
//   const currentDate = new Date().toISOString();
//   const uploadSessionId = uuidv4();

//   return useMutation({
//     mutationFn: async (files: File[]): Promise<ImagesAllWithoutPostId[]> => {
//       const formData = new FormData();
//       files.forEach((file) => formData.append('photos', file));

//       // EXIF 데이터 가져오기
//       const exifResponse = await fetch('/api/upload', { method: 'POST', body: formData });
//       if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
//       const exifDataArray = await exifResponse.json();

//       // 이미지 압축 및 업로드
//       const uploadedImages = await Promise.all(
//         files.map(async (file, index) => {
//           try {
//             // 이미지 압축
//             const compressedFile = await compressImage(file);

//             // 유니크 파일 이름 생성 및 업로드
//             const uniqueFileName = await generateUniqueFileName(compressedFile.name, folderName, bucketName);
//             await uploadFileToStorage(bucketName, folderName, uniqueFileName, compressedFile);

//             // 서명 URL 가져오기
//             const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);
//             const exifData = exifDataArray[index];

//             // 메타데이터 저장
//             const savedData = await saveImageMetadata(
//               uniqueFileName,
//               signedUrl,
//               exifData,
//               userId,
//               groupId,
//               currentDate,
//               uploadSessionId,
//             );

//             return {
//               id: savedData.id,
//               user_id: savedData.user_id,
//               is_cover: savedData.is_cover,
//               post_image_name: uniqueFileName,
//               isUploaded: true,
//               created_at: currentDate,
//               deleted_at: null,
//               updated_at: currentDate,
//               origin_created_at: exifData.dateTaken,
//               post_image_url: signedUrl,
//               post_lat: exifData.latitude,
//               post_lng: exifData.longitude,
//               upload_session_id: uploadSessionId,
//               group_id: groupId,
//             } as ImagesAllWithoutPostId;
//           } catch (error) {
//             console.error('이미지 업로드 중 오류 발생:', error);
//             throw error;
//           }
//         }),
//       );

//       // 업로드된 이미지 상태 설정
//       setImages(uploadedImages);
//       return uploadedImages;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
//   });
// }
