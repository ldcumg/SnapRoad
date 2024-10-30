import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface ImageData {
  id: number;
  blobUrl: string;
  filename: string;
}

interface SortableImageProps {
  image: ImageData;
  onSetCover: (id: number) => void;
  selectedCover: number | null;
}

const SortableImage = ({ image, onSetCover, selectedCover }: SortableImageProps) => {
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
      onClick={() => onSetCover(image.id)} // 대표 이미지 설정
    >
      <div className='relative'>
        {selectedCover === image.id && (
          <span className='absolute top-1 left-1 bg-yellow-300 text-black px-2 py-1 rounded-md text-xs'>대표</span>
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

export default SortableImage;
