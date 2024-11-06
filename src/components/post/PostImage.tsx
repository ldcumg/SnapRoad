import DraggableImageList from './DraggableImageList';
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
    // resetImages();
    // console.log('그룹이 변경될 때만 이미지와 URL 초기화됨');
  }, [groupId]);

  if (isLoading) return '';

  if (error) return <p>이미지 URL 로드 중 오류 발생: {error.message}</p>;

  return (
    <article className='flex flex-col items-start pb-7'>
      {showImages && (
        <>
          {/* <ImageUploadCounter
            imageCount={images.length}
            maxImages={10}
          /> */}
          <DraggableImageList />
          <ThumbnailImageList />
        </>
      )}
    </article>
  );
};

export default PostImage;
