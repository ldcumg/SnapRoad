import { ImagesWithBlobUrl } from '@/types/postTypes';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableImageProps {
  image: ImagesWithBlobUrl;
  onSetCover: (id: number) => void;
  selectedCover: number | null;
}

const SortableImage = ({ image, onSetCover, selectedCover }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id! });
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
      className='keen-slider__slide min-w-[300px] max-w-[300px] h-[300px] cursor-pointer flex flex-col items-center relative'
      onClick={() => image.id && onSetCover(image.id)}
    >
      <div className='absolute top-2 right-2 z-10'>
        {selectedCover === image.id && <span className='bg-white text-black px-2 py-1 rounded-md text-xs'>대표</span>}
      </div>
      <div className='h-full w-full'>
        <img
          src={image.blobUrl}
          alt='업로드 이미지'
          className='w-full h-[260px] object-cover rounded-md'
        />
        <span className='mt-2 text-sm text-gray-700'>{image.post_image_name || 'default_filename'}</span>
      </div>
    </div>
  );
};

export default SortableImage;
