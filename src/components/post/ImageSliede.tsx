'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeleteImage } from '@/hooks/queries/byUse/useDeleteImageMutation';
import { useSetCoverImage } from '@/hooks/queries/byUse/useSetCoverImageMutation';
import { useUploadImage } from '@/hooks/queries/byUse/useUploadImageMutation';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import React, { useState } from 'react';

interface ImageListProps {
  userId: string;
  uploadSessionId: string;
}

const ImageManager = ({ userId, uploadSessionId }: ImageListProps) => {
  const { images, addImages, deleteImage } = useImageUploadStore();
  const [selectedCover, setSelectedCover] = useState<number | null>(null);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 5,
      spacing: 15,
    },
    loop: false,
    rubberband: true,
  });

  const uploadMutation = useUploadImage('tour_images', 'group_name', userId);
  const deleteMutation = useDeleteImage('tour_images', 'group_name');
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId);

  // 이미지 업로드
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

  // 대표 이미지 설정
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

  // 이미지 삭제
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

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      {/* 슬라이드 */}
      <div className='w-full m-auto overflow-auto'>
        <h2 className='text-center text-sm text-gray-500 mb-2'>대표 이미지 선택</h2>
        <div
          ref={sliderRef}
          className='keen-slider'
        >
          {images.map((image) => (
            <div
              key={image.id}
              className='keen-slider__slide min-w-[300px] max-w-[300px] h-[300px] cursor-pointer'
              onClick={() => handleSetCover(image.id)}
            >
              <div className='relative'>
                {selectedCover === image.id && (
                  <span className='absolute top-2 left-2 bg-yellow-300 text-black px-2 py-1 rounded-md text-xs'>
                    대표
                  </span>
                )}
              </div>
              <div className='flex flex-col items-center h-full w-full'>
                <img
                  src={image.blobUrl}
                  alt='업로드 이미지'
                  className='w-full h-full object-cover rounded-md'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 미리보기 및 이미지 삭제 */}
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

        {/* 플러스 버튼으로 이미지 업로드 */}
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

export default ImageManager;
