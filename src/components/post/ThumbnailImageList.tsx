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
    <div className='w-full flex justify-start gap-4 pt-4 overflow-x-auto overflow-y-hidden'>
      {images.length < 10 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload(null);
          }}
        >
          <label className='flex items-center justify-center w-28 h-28 border bg-gray-50 border-gray-100 cursor-pointer'>
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
              className='relative w-28 h-28 border overflow-hidden flex-shrink-0'
            >
              <img
                src={imageUrls[index]}
                alt='미리보기 이미지'
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => handleDelete(image.id)}
                className='absolute top-0 right-0 overflow-hidden rounded-full'
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
