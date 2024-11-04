import DraggableImageList from './DraggableImageList';
import ImageUploadCounter from './ImageUploadCounter';
import Skeleton from './Skeleton';
import ThumbnailImageList from './ThumbnailImageList';
import { BUCKET_NAME } from '@/constants/constants';
import { useBusinessImageActions } from '@/hooks/queries/byUse/useBusinessImageMutation';
// import { useSetCoverImage } from '@/hooks/queries/byUse/usePostImageCoverMutation';
// import { useDeleteImage } from '@/hooks/queries/byUse/usePostImageDeleteMutation';
// import { useUploadImage } from '@/hooks/queries/byUse/usePostImageUploadMutation';
import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction';
import { updateCoverImage } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface ImageListProps {
  uploadSessionId: string;
}

const PostImage = ({ uploadSessionId }: ImageListProps) => {
  const { userId, groupId } = usePostDataStore();
  if (!groupId || !userId) return <div>로딩 중...</div>;

  const folderName = groupId;
  const bucketName = BUCKET_NAME;

  const { images, addImages, deleteImage, setImages, updateImage, resetImages } = useImageUploadStore();
  const [selectedCover, setSelectedCover] = useState<number | null>(null);

  const { uploadBusinessImage, deleteBusinessImage, coverBusinessImage } = useBusinessImageActions(
    bucketName,
    folderName,
    userId,
    groupId,
  );

  const {
    data: imageUrls,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['imageUrls', images, bucketName, folderName],
    queryFn: () => fetchImageUrls(images, bucketName, folderName),
    enabled: images.length > 0,
  });

  useEffect(() => {
    resetImages();
    console.log('이미지와 URL 초기화됨');

    return () => {
      resetImages();
    };
  }, [groupId]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length + images.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.');
      return;
    }

    uploadBusinessImage.mutate(fileArray, {
      onSuccess: (uploadedImages) => {
        addImages(uploadedImages);
        if (uploadedImages.length > 0) {
          handleSetCover(uploadedImages[0].id);
        }
      },
    });
  };

  const handleSetCover = (id: number) => {
    coverBusinessImage.mutate(id, {
      onSuccess: () => {
        images.forEach((image) => {
          updateImage(image.id, { is_cover: image.id === id });
        });
        setSelectedCover(id);
        alert('대표 이미지가 설정되었습니다.');
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
      },
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);
      setImages(sortedImages);

      const firstImageId = sortedImages[0]?.id;
      if (firstImageId) {
        try {
          await updateCoverImage(firstImageId, userId, uploadSessionId);
          setSelectedCover(firstImageId);
          console.log('첫 번째 이미지를 대표 이미지로 설정했습니다:', firstImageId);
        } catch (error) {
          console.error('대표 이미지 설정 오류:', error);
        }
      }
    }
  };

  const handleDelete = (id: number) => {
    deleteBusinessImage.mutate(id, {
      onSuccess: () => {
        deleteImage(id);
        alert('이미지가 삭제되었습니다.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className='overflow-x-auto overflow-y-hidden w-full flex gap-4'>
        {Array.from({ length: images.length || 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className='min-w-[200px] max-w-[200px] h-[200px] cursor-pointer flex flex-col items-center'
          />
        ))}
      </div>
    );
  }

  if (error) return <p>이미지 URL 로드 중 오류 발생</p>;

  return (
    <article className='flex flex-col items-center gap-4 p-4'>
      <ImageUploadCounter
        imageCount={images.length}
        maxImages={10}
      />
      <DraggableImageList
        imageUrls={imageUrls || []}
        onDragEnd={handleDragEnd}
        onSetCover={handleSetCover}
        selectedCover={selectedCover}
      />

      <ThumbnailImageList
        imageUrls={imageUrls || []}
        handleDelete={handleDelete}
        handleImageUpload={handleImageUpload}
      />
    </article>
  );
};

export default PostImage;
