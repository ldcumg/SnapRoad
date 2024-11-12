'use client';

import PostDraggableImageList from './PostDraggable';
import PostThumbnailImageList from './PostThumbnail';
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
          <PostDraggableImageList />
          <PostThumbnailImageList />
        </>
      )}
    </article>
  );
};

export default PostImage;
