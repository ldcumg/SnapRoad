import DraggableImageList from './DraggableImageList';
import ImageUploadCounter from './ImageUploadCounter';
import Skeleton from './Skeleton';
import ThumbnailImageList from './ThumbnailImageList';
import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useEffect } from 'react';

const PostImage = ({ showImages }: { showImages: boolean }) => {
  const { groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, resetImages } = useImageUploadStore();
  const { data: imageUrls = [], isLoading, error } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);

  useEffect(() => {
    resetImages();
    console.log('그룹이 변경될 때만 이미지와 URL 초기화됨');
  }, [groupId]);

  if (isLoading) {
    return (
      <div className='overflow-x-auto overflow-y-hidden w-full flex gap-4'>
        {Array.from({ length: images.length || 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className='min-w-[200px] max-w-[200px] h-24 cursor-pointer flex flex-col items-center'
          />
        ))}
        {images.length === 0 && (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className='w-24 h-24 border overflow-hidden flex-shrink-0 mt-16'
              />
            ))}
          </>
        )}
      </div>
    );
  }

  if (error) return <p>이미지 URL 로드 중 오류 발생: {error.message}</p>;

  return (
    <article className='flex flex-col items-start gap-4 p-4'>
      {showImages && (
        <>
          <ImageUploadCounter
            imageCount={images.length}
            maxImages={10}
          />
          <DraggableImageList />
          <ThumbnailImageList />
        </>
      )}
    </article>
  );
};

export default PostImage;
