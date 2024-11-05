import {
  getImageFileNameById,
  deleteFileFromStorage,
  deleteImageFromDatabase,
} from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/write/useImageUploadStore';
import { useMutation } from '@tanstack/react-query';

/**
 * Supabase에서 이미지를 삭제
 * @param bucketName 버킷 이름
 * @param folderName 폴더 이름
 * @returns 이미지 삭제를 위한 mutation 함수
 */

export function useDeleteImage(bucketName: string, folderName: string) {
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
    onSuccess: (deletedId) => {
      console.log(`이미지 ${deletedId} 삭제 성공`);
    },
  });
}
