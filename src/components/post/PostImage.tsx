import DraggableImageList from './DraggableImageList';
import ImageUploadCounter from './ImageUploadCounter';
import Skeleton from './Skeleton';
import ThumbnailImageList from './ThumbnailImageList';
import { BUCKET_NAME } from '@/constants/constants';
import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const PostImage = () => {
  const { userId, groupId, uploadSessionId } = usePostDataStore();
  if (!groupId || !userId || !uploadSessionId) return <div>로딩 중...</div>;

  const folderName = groupId;
  const bucketName = BUCKET_NAME;
  const { images, resetImages } = useImageUploadStore();

  const {
    data: imageUrls,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['imageUrls', images, bucketName, folderName],
    queryFn: () => fetchImageUrls(images, bucketName, folderName),
    enabled: images.length > 0,
  });

  useEffect(() => {
    resetImages();
    console.log('이미지와 URL 초기화됨');

    return () => {
      resetImages();
    };
  }, [groupId]);

  if (isLoading) {
    return (
      <div className='overflow-x-auto overflow-y-hidden w-full flex gap-4'>
        {Array.from({ length: images.length || 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className='min-w-[200px] max-w-[200px] h-[200px] cursor-pointer flex flex-col items-center'
          />
        ))}
      </div>
    );
  }

  if (error) return <p>이미지 URL 로드 중 오류 발생</p>;

  return (
    <article className='flex flex-col items-center gap-4 p-4'>
      <ImageUploadCounter
        imageCount={images.length}
        maxImages={10}
      />
      <DraggableImageList />
      <ThumbnailImageList />
    </article>
  );
};

export default PostImage;
