import SortableImage from './SortableImage';
import { useDeleteImage } from '@/hooks/queries/byUse/useDeleteImageMutation';
import { useSetCoverImage } from '@/hooks/queries/byUse/useSetCoverImageMutation';
import { useUploadImage } from '@/hooks/queries/byUse/useUploadImageMutation';
import { fetchSignedUrl } from '@/services/client-action/imageActions';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

interface ImageListProps {
  userId: string;
  groupId: string;
  uploadSessionId: string;
}

const ImageSlide = ({ userId, groupId, uploadSessionId }: ImageListProps) => {
  const { images, addImages, deleteImage, setImages } = useImageUploadStore();
  const [selectedCover, setSelectedCover] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const bucketName = 'tour_images';
  const folderName = groupId;

  const uploadMutation = useUploadImage(bucketName, folderName, userId);
  const deleteMutation = useDeleteImage(bucketName, folderName);
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId);

  const fetchImageUrls = async () => {
    const urls = await Promise.all(
      images.map(async (image) => {
        const url = await fetchSignedUrl(bucketName, folderName, image.filename);
        return url;
      }),
    );
    setImageUrls(urls);
  };

  useEffect(() => {
    fetchImageUrls();
  }, [images, bucketName, folderName]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length + images.length > 10) {
        alert('최대 10장의 이미지만 업로드할 수 있습니다.');
        return;
      }
      uploadMutation.mutate(fileArray, {
        onSuccess: (uploadedImages) => {
          const newImages = uploadedImages.filter((newImage) => !images.some((img) => img.id === newImage.id));
          addImages(newImages);
          console.log('업로드된 이미지:', newImages);
          if (newImages.length > 0) {
            handleSetCover(newImages[0].id);
          }
        },
      });
    }
  };

  const handleSetCover = (id: number) => {
    setCoverMutation.mutate(id, {
      onSuccess: () => {
        setSelectedCover(id);
        const { updateImage } = useImageUploadStore.getState();
        updateImage(id, { isCover: true });
        images.forEach((image) => {
          if (image.id !== id) updateImage(image.id, { isCover: false });
        });
        alert('대표 이미지가 설정되었습니다.');
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
        alert('대표 이미지 설정에 실패했습니다.');
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        deleteImage(id);
        fetchImageUrls(); // 삭제 후 imageUrls 업데이트
        alert('이미지가 삭제되었습니다.');
      },
      onError: (error) => {
        console.error('이미지 삭제 오류:', error);
        alert('이미지 삭제에 실패했습니다.');
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);
      setImages(sortedImages);

      if (sortedImages.length > 0) {
        const firstImageId = sortedImages[0].id;
        handleSetCover(firstImageId);
      }
    }
  };

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      <div className='text-center text-gray-600 mb-2'>
        <span className='text-sm'>이미지 업로드: {images.length} / 10</span>
      </div>

      <div className='w-full m-auto overflow-auto'>
        <h2 className='text-center text-sm text-gray-500 mb-2'>대표 이미지 선택</h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((image) => image.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className='flex gap-4'>
              {images.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={{ ...image, blobUrl: imageUrls[index] }}
                  onSetCover={() => handleSetCover(image.id)}
                  selectedCover={selectedCover}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((image, index) => (
          <div
            key={image.id}
            className='relative w-24 h-24 border overflow-hidden'
          >
            <img
              src={imageUrls[index]}
              alt='미리보기 이미지'
              className='w-full h-full object-cover'
            />
            <button
              onClick={() => handleDelete(image.id)}
              className='absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full'
            >
              ×
            </button>
          </div>
        ))}
        {images.length < 10 && (
          <label className='flex items-center justify-center w-24 h-24 border cursor-pointer'>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <span className='text-2xl font-bold text-gray-400'>+</span>
          </label>
        )}
      </div>
    </section>
  );
};

export default ImageSlide;
