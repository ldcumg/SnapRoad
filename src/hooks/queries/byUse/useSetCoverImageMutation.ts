import { resetCoverImage, setCoverImage } from '@/services/client-action/imageActions';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { useMutation } from '@tanstack/react-query';

/**
 * 특정 이미지를 대표 이미지로 설정
 * @param userId 사용자 ID
 * @returns 이미지 대표 설정을 위한 mutation 함수
 */

export function useSetCoverImage(userId: string, uploadSessionId: string) {
  return useMutation({
    mutationFn: async (id: number) => {
      await resetCoverImage(userId, uploadSessionId);
      await setCoverImage(id);
    },
    onMutate: async (id) => {
      const { updateImage, images } = useImageUploadStore.getState();
      updateImage(id, { isCover: true });
      images.forEach((image) => {
        if (image.id !== id) updateImage(image.id, { isCover: false });
      });
    },
    onError: (error) => {
      console.error('대표 이미지 설정 오류:', error);
    },
    onSuccess: () => {
      console.log('대표 이미지 설정 성공');
    },
  });
}
