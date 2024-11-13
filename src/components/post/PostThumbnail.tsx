'use client';

import PostLoadingSpinner from './PostLoadingSpinner';
import buckets from '@/constants/buckets';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useImageDeleteLogic, useImageUploadLogic } from '@/hooks/queries/post/useImageHandlersHooks';
import { IconCloseCircle } from '@/lib/icon/Icon_Close_Circle';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useState, useEffect } from 'react';

const PostThumbnailImageList = () => {
  const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, setImages } = useImageUploadStore();
  const { handleDelete } = useImageDeleteLogic(buckets.tourImages, groupId);
  const { handleImageUpload } = useImageUploadLogic(buckets.tourImages, groupId, userId, groupId);
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, buckets.tourImages, groupId);

  const [isUploading, setIsUploading] = useState(false);

  // 상태 변경 추적
  useEffect(() => {
    if (isUploading) {
      console.log('업로드 시작: 로딩 상태 설정 중...');
    } else {
      console.log('업로드 완료: 로딩 상태 해제');
    }
  }, [isUploading]);

  const handleNewImageUpload = async (files: FileList | null) => {
    if (files) {
      setIsUploading(true);
      console.log('🔥 업로드 시작 시 로딩 상태 설정');
      setImages([]);
      try {
        await handleImageUpload(files);
        console.log('🔥 업로드 완료 후 로딩 상태 해제');
      } catch (error) {
        console.error('업로드 실패', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className='flex w-full justify-start gap-4 overflow-x-auto overflow-y-hidden pt-4'>
      {isUploading ? (
        <PostLoadingSpinner />
      ) : (
        images.length < 10 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label className='flex h-28 w-28 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'>
              <input
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={(e) => handleNewImageUpload(e.target.files)}
              />
              <span>
                <IconPluslg />
              </span>
            </label>
          </form>
        )
      )}

      {images.map(
        (image, index) =>
          image.id !== undefined && (
            <div
              key={image.id}
              className='relative h-28 w-28 flex-shrink-0 overflow-hidden border'
            >
              <img
                src={imageUrls[index]}
                alt='미리보기 이미지'
                className='h-full w-full object-cover'
              />
              <button
                onClick={() => handleDelete(image.id)}
                className='absolute right-0 top-0 overflow-hidden rounded-full'
              >
                <IconCloseCircle />
              </button>
            </div>
          ),
      )}
    </div>
  );
};

export default PostThumbnailImageList;
