'use client';

import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useImageDeleteLogic, useImageUploadLogic } from '@/hooks/queries/post/useImageHandlersHooks';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';

const ThumbnailImageList = () => {
  const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images } = useImageUploadStore();
  const { handleDelete } = useImageDeleteLogic(BUCKET_NAME, groupId);
  const { handleImageUpload } = useImageUploadLogic(BUCKET_NAME, groupId, userId, groupId);
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);

  return (
    <div className='flex w-full justify-start gap-4 overflow-x-auto overflow-y-hidden pt-4'>
      {images.length < 10 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload(null);
          }}
        >
          <label className='flex h-28 w-28 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <span className='text-2xl font-bold text-gray-400'>+</span>
          </label>
        </form>
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
                <img src='/svgs/Close_Circle.svg' />
              </button>
            </div>
          ),
      )}
    </div>
  );
};

export default ThumbnailImageList;
