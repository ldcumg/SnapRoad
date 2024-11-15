import {
  useUploadBusinessImage,
  useDeleteBusinessImage,
  useCoverBusinessImage,
} from '@/hooks/queries/post/useBusinessImageMutation';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { QueryObserverResult } from '@tanstack/react-query';

/** 이미지 업로드 처리 */
export const useImageUploadLogic = (
  bucketName: string,
  folderName: string,
  userId: string,
  groupId: string,
  refetch: () => Promise<QueryObserverResult<string[], Error>>,
) => {
  const { addImages } = useImageUploadStore();
  const uploadBusinessImage = useUploadBusinessImage(bucketName, folderName, userId, groupId);

  const handleImageUpload = async (files: FileList) => {
    if (!files) return;

    const fileArray = Array.from(files);

    // 파일명 및 확장자 필터링
    const validFiles = fileArray.filter((file) => {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const isValidExtension = ['png', 'jpg', 'jpeg'].includes(fileExtension || '');
      // 파일 이름 유효성 검사: 영어, 숫자, 밑줄, 하이픈, 점, 괄호, 공백 허용
      const isEnglishName = /^[\w-. ()]+$/.test(fileName);
      // 디버깅: 통과되지 않은 파일 출력
      // console.log(`파일 검사: ${fileName}, 확장자: ${isValidExtension}, 파일명: ${isEnglishName}`);

      if (!isValidExtension) {
        alert(`${fileName}은 허용되지 않는 파일 형식입니다. PNG 또는 JPG만 가능합니다.`);
      }
      if (!isEnglishName) {
        alert(`${fileName}은 허용되지 않는 파일명입니다. 한글 파일명은 지원되지 않습니다.`);
      }

      return isValidExtension && isEnglishName;
    });

    if (validFiles.length === 0) {
      alert('유효한 파일이 없습니다. 다시 시도해 주세요.');
      return; // 유효한 파일이 없으면 업로드 중단
    }

    if (validFiles.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.');
      return;
    }

    try {
      const uploadedImages = await uploadBusinessImage.mutateAsync(validFiles);
      addImages(uploadedImages);
      await refetch();
    } catch (error) {
      console.error('이미지 업로드 중 오류가 발생했습니다:', error);
    }
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
      },
    });
  };

  return { handleDelete };
};

export const useSetCoverLogic = (userId: string, uploadSessionId: string) => {
  const { setImages, images } = useImageUploadStore();
  const coverBusinessImage = useCoverBusinessImage(userId, uploadSessionId);

  const handleSetCover = (id: number) => {
    coverBusinessImage.mutate(id, {
      onSuccess: () => {
        const currentImages = useImageUploadStore.getState().images;
        const updatedImages = currentImages.map((image) => ({
          ...image,
          is_cover: image.id === id,
        }));

        setImages([...updatedImages]);
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
      },
    });
  };

  return { handleSetCover };
};
