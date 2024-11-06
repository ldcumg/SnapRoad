import {
  useUploadBusinessImage,
  useDeleteBusinessImage,
  useCoverBusinessImage,
} from '@/hooks/queries/post/useBusinessImageMutation';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { toast } from 'garlic-toast';

// 이미지 업로드 처리
export const useImageUploadLogic = (bucketName: string, folderName: string, userId: string, groupId: string) => {
  const { addImages, setImages } = useImageUploadStore();
  const uploadBusinessImage = useUploadBusinessImage(bucketName, folderName, userId, groupId);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    if (fileArray.length > 10) {
      toast.alert('최대 10장의 이미지만 업로드할 수 있습니다.');
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
        console.log('이미지가 삭제되었습니다.');
      },
    });
  };

  return { handleDelete };
};

// // 커버 이미지 설정 처리
// export const useSetCoverLogic = (userId: string, uploadSessionId: string) => {
//   const { setImages, images } = useImageUploadStore();
//   const coverBusinessImage = useCoverBusinessImage(userId, uploadSessionId);

//   const handleSetCover = (id: number) => {
//     coverBusinessImage.mutate(id, {
//       onSuccess: () => {
//         const updatedImages = images.map((image) => ({
//           ...image,
//           is_cover: image.id === id,
//         }));

//         setImages(updatedImages);
//         console.log('대표 이미지가 설정되었습니다.');
//       },
//       onError: (error) => {
//         console.error('대표 이미지 설정 오류:', error);
//       },
//     });
//   };

//   return { handleSetCover };
// };

export const useSetCoverLogic = (userId: string, uploadSessionId: string) => {
  const { setImages, images } = useImageUploadStore();
  const coverBusinessImage = useCoverBusinessImage(userId, uploadSessionId);

  const handleSetCover = (id: number) => {
    coverBusinessImage.mutate(id, {
      onSuccess: () => {
        // 최신 상태의 images를 가져와서 업데이트
        const currentImages = useImageUploadStore.getState().images;
        const updatedImages = currentImages.map((image) => ({
          ...image,
          is_cover: image.id === id, // 선택한 이미지만 is_cover를 true로 설정
        }));

        setImages([...updatedImages]); // 새로운 배열로 업데이트하여 불변성 유지
        console.log('대표 이미지가 설정되었습니다.', id);
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
      },
    });
  };

  return { handleSetCover };
};
