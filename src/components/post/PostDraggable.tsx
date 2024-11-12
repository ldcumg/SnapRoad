'use client';

import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useSetCoverLogic } from '@/hooks/queries/post/useImageHandlersHooks';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect } from 'react';

const PostDraggableImageList = () => {
  const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, setSelectedCover, selectedCover } = useImageUploadStore();
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);
  const { handleSetCover } = useSetCoverLogic(userId, uploadSessionId);

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: 'free-snap',
    slides: {
      perView: 'auto',
    },
    drag: false,
  });

  useEffect(() => {
    if (images.length > 0 && images[0].id !== selectedCover) {
      const firstImageId = images[0].id;
      setSelectedCover(firstImageId);
      handleSetCover(firstImageId);
    }
  }, [images, selectedCover, setSelectedCover, handleSetCover]);

  return (
    <div className='w-full overflow-y-hidden pb-4'>
      <div
        ref={sliderRef}
        className='keen-slider'
      >
        <div className='flex gap-4'>
          {images.length > 0 &&
            images.map((image, index) => {
              if (image.id === undefined || !imageUrls[index]) return null;

              return (
                <PostSortableImage
                  key={image.id}
                  image={image}
                  imageUrl={imageUrls[index]}
                  selectedCover={selectedCover}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

interface SortableImageProps {
  image: {
    id: number;
    [key: string]: any;
  };
  imageUrl: string;
  selectedCover: number | null;
}

const PostSortableImage = ({ image, imageUrl, selectedCover }: SortableImageProps) => {
  return (
    <div className='keen-slider__slide !h-[240px] !min-h-[240px] !min-w-[240px] !max-w-[240px] flex-1'>
      <div className='absolute bottom-2 right-2 z-10'>
        {selectedCover === image.id ? (
          <span className='rounded-xl bg-primary-400 px-2 py-1 text-xs text-white'>대표</span>
        ) : (
          <span
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className='rounded-xl px-2 py-1 text-xs text-white'
          >
            대표
          </span>
        )}
      </div>
      <img
        src={imageUrl}
        alt='업로드 이미지'
        className='h-full w-full object-cover'
      />
    </div>
  );
};

export default PostDraggableImageList;
