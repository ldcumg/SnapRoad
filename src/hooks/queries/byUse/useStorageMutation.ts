import { uploadProfileImage } from '@/services/client-action/storageAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/** 파일 업로드 */
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageName, newImage, storage }: { imageName: string; newImage: File; storage: string }) =>
      uploadProfileImage(imageName, newImage, storage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
