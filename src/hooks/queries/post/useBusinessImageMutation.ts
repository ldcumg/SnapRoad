import queryKeys from '../queryKeys';
import {
  fetchSignedUrl,
  saveImageMetadata,
  uploadFileToStorage,
  getImageFileNameById,
  deleteFileFromStorage,
  deleteImageFromDatabase,
  updateCoverImage,
} from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { ImagesAllWithoutPostId } from '@/types/projectType';
import { generateUniqueFileName } from '@/utils/fileNameUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

/** 이미지를 업로드하는 훅 */
export function useUploadBusinessImage(bucketName: string, folderName: string, userId: string, groupId: string) {
  const queryClient = useQueryClient();
  const { setImages } = useImageUploadStore();
  const currentDate = new Date().toISOString();
  const uploadSessionId = uuidv4();

  // URL에서 기본 위도와 경도 값 추출
  const url = new URL(window.location.href);
  const defaultLat = url.searchParams.get('lat');
  const defaultLng = url.searchParams.get('lng');
  const defaultPlace = url.searchParams.get('place');

  return useMutation({
    mutationFn: async (files: File[]): Promise<ImagesAllWithoutPostId[]> => {
      // Step 1: EXIF 데이터 추출
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!exifResponse.ok) throw new Error('서버로 전송하는 중 오류 발생');
      const serverExifDataArray = await exifResponse.json();

      // Step 2: 병렬 제한 및 조건부 압축
      const limit = 3;
      const compressedFiles = [];

      for (let i = 0; i < files.length; i += limit) {
        const chunk = files.slice(i, i + limit);

        const chunkCompressedFiles = await Promise.all(
          chunk.map(async (file) => {
            if (file.size / 1024 / 1024 <= 1) {
              return file; // 1MB 이하 파일은 압축하지 않음
            } else {
              const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
              });
              return compressedFile;
            }
          }),
        );

        compressedFiles.push(...chunkCompressedFiles);
      }

      // Step 3: 메타데이터 저장
      const uploadedImages = await Promise.all(
        compressedFiles.map(async (file, index) => {
          try {
            const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
            await uploadFileToStorage(bucketName, folderName, uniqueFileName, file);
            const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);
            const blobUrl = await getBlobUrl(signedUrl);
            const exifData = serverExifDataArray[index];

            // EXIF 데이터가 없을 경우 기본 위도, 경도, 장소를 사용
            const latitude = exifData?.latitude || defaultLat;
            const longitude = exifData?.longitude || defaultLng;
            // const place = exifData?.place || defaultPlace;

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
              origin_created_at: exifData?.dateTaken,
              post_image_url: signedUrl,
              post_lat: latitude,
              post_lng: longitude,
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.image.image(userId) }),
  });
}

// export function useUploadBusinessImage(bucketName: string, folderName: string, userId: string, groupId: string) {
//   const queryClient = useQueryClient();
//   const { setImages } = useImageUploadStore();
//   const currentDate = new Date().toISOString();
//   const uploadSessionId = uuidv4();

//   return useMutation({
//     mutationFn: async (files: File[]): Promise<ImagesAllWithoutPostId[]> => {
//       // Step 1: EXIF 데이터 추출
//       const formData = new FormData();
//       files.forEach((file) => formData.append('photos', file));

//       const exifResponse = await fetch('/api/upload', { method: 'POST', body: formData });
//       if (!exifResponse.ok) throw new Error('서버로 전송하는 중 오류 발생');
//       const serverExifDataArray = await exifResponse.json();

//       // Step 2: 병렬 제한 및 조건부 압축
//       const limit = 3;
//       const compressedFiles = [];

//       for (let i = 0; i < files.length; i += limit) {
//         const chunk = files.slice(i, i + limit);

//         const chunkCompressedFiles = await Promise.all(
//           chunk.map(async (file, index) => {
//             if (file.size / 1024 / 1024 <= 1) {
//               return file; // 1MB 이하 파일은 압축하지 않음
//             } else {
//               const compressedFile = await imageCompression(file, {
//                 maxSizeMB: 1, // 1MB 이하로 압축
//                 maxWidthOrHeight: 1024, // 최대 해상도 제한
//                 useWebWorker: true,
//               });
//               return compressedFile;
//             }
//           }),
//         );

//         compressedFiles.push(...chunkCompressedFiles);
//       }

//       // Step 3: 메타데이터 저장
//       const uploadedImages = await Promise.all(
//         compressedFiles.map(async (file, index) => {
//           try {
//             const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
//             await uploadFileToStorage(bucketName, folderName, uniqueFileName, file);
//             const signedUrl = await fetchSignedUrl(bucketName, folderName, uniqueFileName);
//             const blobUrl = await getBlobUrl(signedUrl);
//             const exifData = serverExifDataArray[index];

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
//               blobUrl,
//               id: savedData.id,
//               user_id: savedData.user_id,
//               is_cover: savedData.is_cover,
//               post_image_name: uniqueFileName,
//               isUploaded: true,
//               created_at: currentDate,
//               deleted_at: null,
//               updated_at: currentDate,
//               origin_created_at: exifData?.dateTaken,
//               post_image_url: signedUrl,
//               post_lat: exifData?.latitude,
//               post_lng: exifData?.longitude,
//               upload_session_id: uploadSessionId,
//               group_id: groupId,
//             } as ImagesAllWithoutPostId;
//           } catch (error) {
//             console.error('이미지 업로드 중 오류 발생:', error);
//             throw error;
//           }
//         }),
//       );

//       setImages(uploadedImages);
//       return uploadedImages;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.image.image(userId) }),
//   });
// }

/** Supabase에서 이미지를 삭제하는 훅 */

export function useDeleteBusinessImage(bucketName: string, folderName: string) {
  return useMutation({
    mutationFn: async (id: number) => {
      const filename = await getImageFileNameById(id);
      await deleteFileFromStorage(bucketName, folderName, filename);
      await deleteImageFromDatabase(id);
      return id;
    },
    onMutate: async (id) => {
      useImageUploadStore.getState().deleteImage(id);
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
    },
    // onSuccess: (deletedId) => {
    //   console.log(`이미지 ${deletedId} 삭제 성공`);
    // },
  });
}

/** 특정 이미지를 대표 이미지로 설정하는 훅 */

export function useCoverBusinessImage(userId: string, uploadSessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number) => {
      await updateCoverImage(imageId, userId, uploadSessionId);
    },
    onMutate: async (imageId) => {
      const { updateImage, images } = useImageUploadStore.getState();
      updateImage(imageId, { is_cover: true });
      images.forEach((image) => {
        if (image.id !== imageId) updateImage(image.id!, { is_cover: false });
      });

      return { previousImages: images };
    },
    onError: (error, _, context) => {
      console.error('대표 이미지 설정 오류:', error);
      if (context?.previousImages) {
        const { setImages } = useImageUploadStore.getState();
        setImages(context.previousImages);
      }
    },
    // onSuccess: () => {
    //   console.log('대표 이미지 설정 성공');
    //   queryClient.invalidateQueries({ queryKey: queryKeys.image.image(userId) });
    // },
  });
}

/** Blob URL을 생성하는 함수 */
async function getBlobUrl(signedUrl: string): Promise<string> {
  const response = await fetch(signedUrl);
  if (!response.ok) throw new Error('Blob URL 생성 실패');
  return URL.createObjectURL(await response.blob());
}
