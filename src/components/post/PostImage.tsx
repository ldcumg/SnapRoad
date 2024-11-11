'use client';

import DraggableImageList from './DraggableImage';
import ThumbnailImageList from './ThumbnailImageList';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useEffect } from 'react';

const PostImage = ({ showImages }: { showImages: boolean }) => {
  const { userId = '' } = usePostDataStore();
  const { resetImages } = useImageUploadStore();

  useEffect(() => {
    resetImages();
  }, [userId]);

  return (
    <article className='flex flex-col items-start pb-7'>
      {showImages && (
        <>
          <DraggableImageList />
          <ThumbnailImageList />
        </>
      )}
    </article>
  );
};

export default PostImage;
