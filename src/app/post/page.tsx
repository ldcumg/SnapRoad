'use client';

import { useDeleteImage } from '@/hooks/queries/byUse/useDeleteImageMutation';
import { useSetCoverImage } from '@/hooks/queries/byUse/useSetCoverImageMutation';
import { useUploadImage } from '@/hooks/queries/byUse/useUploadImageMutation';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';

interface ImageData {
  id: number;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
  userId?: string;
  createdAt: string;
}

interface ImageListProps {
  userId: string;
  uploadSessionId: string;
}

const ImageManager = ({ userId, uploadSessionId }: ImageListProps) => {
  const { images, addImages, deleteImage, setImages } = useImageUploadStore();
  const [selectedCover, setSelectedCover] = useState<number | null>(null);

  const uploadMutation = useUploadImage('tour_images', 'group_name', userId);
  const deleteMutation = useDeleteImage('tour_images', 'group_name');
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId);

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
        },
      });
    }
  };

  const handleSetCover = (id: number) => {
    setCoverMutation.mutate(id, {
      onSuccess: () => {
        setSelectedCover(id);
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
      {/* 이미지 개수 표시 */}
      <div className='text-center text-gray-600 mb-2'>
        <span className='text-sm'>이미지 업로드: {images.length} / 10</span>
      </div>

      <div className='w-full m-auto overflow-auto'>
        <h2 className='text-center text-sm text-gray-500 mb-2'>대표 이미지 선택</h2>
        <div className='w-full overflow-auto'>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((image) => image.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex gap-4'>
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onSetCover={() => handleSetCover(image.id)}
                    selectedCover={selectedCover}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((image) => (
          <div
            key={image.id}
            className='relative w-24 h-24 border overflow-hidden'
          >
            <img
              src={image.blobUrl}
              alt='미리보기 이미지'
              className='w-full h-full object-cover'
            />
            <button
              onClick={() => handleDelete(image.id)}
              className='absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full'
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

// 단일 이미지 항목을 정렬할 수 있도록 설정
const SortableImage = ({
  image,
  onSetCover,
  selectedCover,
}: {
  image: ImageData;
  onSetCover: (id: number) => void;
  selectedCover: number | null;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='keen-slider__slide min-w-[300px] max-w-[300px] h-[300px] cursor-pointer flex flex-col items-center'
      onClick={() => onSetCover(image.id)}
    >
      <div className='relative'>
        {selectedCover === image.id && (
          <span className='absolute top-2 left-2 bg-yellow-300 text-black px-2 py-1 rounded-md text-xs'>대표</span>
        )}
      </div>
      <div className='flex flex-col items-center h-full w-full'>
        <img
          src={image.blobUrl}
          alt='업로드 이미지'
          className='w-full h-[260px] object-cover rounded-md'
        />
        <span className='mt-2 text-sm text-gray-700'>{image.filename}</span>
      </div>
    </div>
  );
};

export default ImageManager;
