import { updateCoverImage } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * 특정 이미지를 대표 이미지로 설정
 * @param userId 사용자 ID
 * @param uploadSessionId 업로드 세션 ID
 * @returns 이미지 대표 설정을 위한 mutation 함수
 */
export function useSetCoverImage(userId: string, uploadSessionId: string) {
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
    onSuccess: () => {
      // console.log('대표 이미지 설정 성공');
      queryClient.invalidateQueries({ queryKey: ['images', userId] });
    },
  });
}
