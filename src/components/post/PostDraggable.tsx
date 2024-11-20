'use client';

import PostSortableImage from './PostSortable';
import buckets from '@/constants/buckets';
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
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, buckets.tourImages, groupId);
  const { handleSetCover } = useSetCoverLogic(userId, uploadSessionId);

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: 'free-snap',
    slides: {
      perView: 'auto',
    },
    drag: true,
  });

  useEffect(() => {
    if (images.length > 0 && images[0].id !== selectedCover) {
      const firstImageId = images[0].id;
      setSelectedCover(firstImageId);
      handleSetCover(firstImageId);
    }
  }, [images, selectedCover, setSelectedCover, handleSetCover]);

  return (
    <div className='w-full pb-4'>
      <div
        ref={sliderRef}
        className='keen-slider w-full !overflow-auto'
      >
        <div className='flex gap-4 overflow-x-auto'>
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

export default PostDraggableImageList;
