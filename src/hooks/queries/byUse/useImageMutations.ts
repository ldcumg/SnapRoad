import {
  fetchSignedUrl,
  uploadImageToDatabase,
  setCoverImage,
  deleteImageFromStorage,
  deleteImageFromDatabase,
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

  // 이미지 업로드 Mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ files, exifDataArray }: UploadImageVariables) => {
      return Promise.all(
        files.map(async (file, index) => {
          const signedUrl = await fetchSignedUrl(file.name); // 직접 함수 호출
          const blobUrl = URL.createObjectURL(await (await fetch(signedUrl)).blob());

          const imageData = {
            post_image_name: file.name,
            post_image_url: signedUrl,
            created_at: currentDate,
            is_cover: false,
            post_lat: exifDataArray[index]?.latitude,
            post_lng: exifDataArray[index]?.longitude,
            origin_created_at: exifDataArray[index]?.dateTaken,
            user_id: userId,
          };

          return {
            ...(await uploadImageToDatabase(imageData)),
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
    mutationFn: async ({ id, createdAt }: { id: number; createdAt: string }) => setCoverImage(userId!, createdAt, id),
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
      await deleteImageFromStorage(filename);
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
