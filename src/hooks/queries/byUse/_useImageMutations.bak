import {
  deleteImageFromDatabase,
  fetchSignedUrl,
  setCoverImage,
  deleteFileFromStorage,
  saveImageMetadata,
} from '@/services/client-action/imageActions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ExifData {
  latitude: number;
  longitude: number;
  dateTaken: string;
}
interface UploadedImageData {
  id: number;
  post_image_name: string;
  post_image_url: string;
  created_at: string;
  is_cover: boolean;
  post_lat: number;
  post_lng: number;
  origin_created_at: string;
  user_id: string | undefined;
  blobUrl: string;
  filename: string;
}
interface UploadImageVariables {
  files: File[];
  exifDataArray: ExifData[];
}
export const useImageMutations = (userId: string | undefined, currentDate: string) => {
  const queryClient = useQueryClient();
  const bucketName = 'tour_images';
  const folderName = 'group_name';

  // 이미지 업로드 Mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ files, exifDataArray }: UploadImageVariables) => {
      return Promise.all(
        files.map(async (file, index) => {
          // fetchSignedUrl 호출 시 개별 인수 전달
          const signedUrl = await fetchSignedUrl(bucketName, folderName, file.name);
          const response = await fetch(signedUrl);
          const blobUrl = URL.createObjectURL(await response.blob());
          const exifData = exifDataArray[index];
          const imageData = {
            post_image_name: file.name,
            post_image_url: signedUrl,
            created_at: currentDate,
            is_cover: false,
            post_lat: exifData.latitude,
            post_lng: exifData.longitude,
            origin_created_at: exifData.dateTaken,
            user_id: userId,
            upload_session_id: 'your-session-id', // 세션 ID 설정 필요
          };
          // saveImageMetadata 호출 시 imageData 객체 전달
          return {
            ...(await saveImageMetadata({
              uniqueFileName: file.name,
              signedUrl,
              exifData,
              userId: userId!,
              currentDate,
              uploadSessionId: 'your-session-id',
            })),
            blobUrl,
            filename: file.name,
          };
        }),
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['imageData'], data);
    },
    onError: (error) => {
      console.error(`이미지 업로드 중 오류가 발생했습니다: ${error.message}`);
    },
  });

  // 대표 이미지 설정 Mutation
  const setCoverImageMutation = useMutation({
    mutationFn: async ({ id, createdAt }: { id: number; createdAt: string }) => setCoverImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageData'] });
    },
    onError: (error) => {
      console.error(`대표 이미지 설정 중 오류가 발생했습니다: ${error.message}`);
    },
  });

  // 이미지 삭제 Mutation
  const deleteImageMutation = useMutation({
    mutationFn: async ({ id, filename }: { id: number; filename: string }) => {
      // deleteFileFromStorage 호출 시 bucketName, folderName 및 filename을 개별 인수로 전달
      await deleteFileFromStorage(bucketName, folderName, filename);
      await deleteImageFromDatabase(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageData'] });
    },
    onError: (error) => {
      console.error(`이미지 삭제 중 오류가 발생했습니다: ${error.message}`);
    },
  });
  return {
    uploadImageMutation,
    setCoverImageMutation,
    deleteImageMutation,
    uploadImage: uploadImageMutation.mutateAsync,
    setCoverImage: setCoverImageMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
  };
};

// import { useImageUploadStore } from '@/stores/imageUploadStore';
// import { removeFileExtension } from '@/utils/fileNameUtils';
// import {
//   createUniqueFileName,
//   fetchExifData,
//   getSignedUrl,
//   saveImageDataToDB,
//   uploadImageFile,
// } from '@/utils/uploadHelpers';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// // 주스탄드 스토어 가져오기

// export const useImageMutations = (userId: string | undefined, currentDate: string) => {
//   const queryClient = useQueryClient();
//   const addImages = useImageUploadStore((state) => state.addImages); // 주스탄드의 addImages 사용

//   const uploadMutation = useMutation({
//     mutationFn: async (files: File[]) => {
//       const exifDataArray = await fetchExifData(files);
//       const bucketName = 'tour_images';
//       const folderName = 'group_name';

//       const uploadedFiles = await Promise.all(
//         files.map(async (file, index) => {
//           const uniqueFileName = await createUniqueFileName(file.name, folderName, bucketName);
//           const uploadedFile = await uploadImageFile(file, folderName, bucketName);
//           const signedUrl = await getSignedUrl(uniqueFileName);
//           const response = await fetch(signedUrl);
//           const blob = await response.blob();
//           const blobUrl = URL.createObjectURL(blob);
//           const exifData = exifDataArray[index];
//           const fileNameWithoutExtension = removeFileExtension(uploadedFile[0].filename);

//           const savedData = await saveImageDataToDB({
//             fileNameWithoutExtension,
//             signedUrl,
//             latitude: exifData.latitude,
//             longitude: exifData.longitude,
//             dateTaken: exifData.dateTaken,
//             userId,
//             currentDate,
//           });

//           return {
//             blobUrl,
//             id: savedData[0].id,
//             userId: savedData[0].user_id,
//             isCover: savedData[0].is_cover,
//             createdAt: currentDate,
//             filename: uniqueFileName,
//             latitude: exifData.latitude,
//             longitude: exifData.longitude,
//             dateTaken: exifData.dateTaken,
//           };
//         }),
//       );

//       return uploadedFiles;
//     },
//     onSuccess: (uploadedFiles) => {
//       const filteredData = uploadedFiles.filter((image) => image.userId === userId);
//       addImages(filteredData); // 주스탄드 상태에 추가
//       queryClient.invalidateQueries(['imageData']);
//       console.log('이미지 업로드에 성공했습니다.');
//     },
//     onError: (err) => {
//       console.error('이미지 업로드 에러:', err);
//       setError('이미지 업로드 중 문제가 발생했습니다.');
//     },
//   });

//   return { uploadMutation };
// };
