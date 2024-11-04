import {
  useUploadBusinessImage,
  useDeleteBusinessImage,
  useCoverBusinessImage,
} from '@/hooks/queries/byUse/useBusinessImageMutation';
import { useImageUploadStore } from '@/stores/useImageUploadStore';

// 이미지 업로드 처리
export const useImageUploadLogic = (bucketName: string, folderName: string, userId: string, groupId: string) => {
  const { addImages, setImages } = useImageUploadStore();
  const uploadBusinessImage = useUploadBusinessImage(bucketName, folderName, userId, groupId);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    if (fileArray.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.');
      return;
    }

    uploadBusinessImage.mutate(fileArray, {
      onSuccess: (uploadedImages) => {
        addImages(uploadedImages);
      },
    });
  };

  return { handleImageUpload };
};

// 이미지 삭제 처리
export const useImageDeleteLogic = (bucketName: string, folderName: string) => {
  const { deleteImage } = useImageUploadStore();
  const deleteBusinessImage = useDeleteBusinessImage(bucketName, folderName);

  const handleDelete = (id: number) => {
    deleteBusinessImage.mutate(id, {
      onSuccess: () => {
        deleteImage(id);
        alert('이미지가 삭제되었습니다.');
      },
    });
  };

  return { handleDelete };
};

// 커버 이미지 설정 처리
export const useSetCoverLogic = (userId: string, uploadSessionId: string) => {
  const { updateImage, images } = useImageUploadStore();
  const coverBusinessImage = useCoverBusinessImage(userId, uploadSessionId);

  const handleSetCover = (id: number) => {
    coverBusinessImage.mutate(id, {
      onSuccess: () => {
        images.forEach((image) => {
          updateImage(image.id, { is_cover: image.id === id });
        });
        alert('대표 이미지가 설정되었습니다.');
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
      },
    });
  };

  return { handleSetCover };
};
