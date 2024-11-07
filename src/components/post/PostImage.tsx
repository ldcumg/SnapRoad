import DraggableImageList from './DraggableImageList';
import ThumbnailImageList from './ThumbnailImageList';
import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useEffect, useRef } from 'react';

const PostImage = ({ showImages }: { showImages: boolean }) => {
  const { groupId = '', userId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, resetImages } = useImageUploadStore();
  const { data: imageUrls = [], isLoading, error } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);

  const previousGroupId = useRef(groupId);
  const previousUserId = useRef(userId);

  useEffect(() => {
    // if (previousGroupId.current !== groupId || previousUserId.current !== userId) {
    //   // 그룹 ID나 사용자 ID가 변경되었을 때만 초기화
    resetImages();
    //   console.log('그룹이나 사용자 ID가 변경될 때 이미지와 URL이 초기화');
    //   // 현재 그룹 ID와 사용자 ID를 이전 값으로 업데이트
    //   previousGroupId.current = groupId;
    //   previousUserId.current = userId;
    // }
  }, [userId]);

  if (isLoading) return '';

  if (error) return <p>이미지 URL 로드 중 오류 발생: {error.message}</p>;

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
