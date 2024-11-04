import { useImageUploadStore } from '@/stores/useImageUploadStore';

interface ThumbnailImageListProps {
  imageUrls: string[];
  handleDelete: (id: number) => void;
  handleImageUpload: (files: FileList | null) => void;
}

const ThumbnailImageList = ({ imageUrls, handleDelete, handleImageUpload }: ThumbnailImageListProps) => {
  const { images } = useImageUploadStore();

  return (
    <div className='w-full flex flex-wrap justify-start gap-4 my-12 overflow-x-auto overflow-y-hidden'>
      {images.length < 10 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload(null);
          }}
        >
          <label className='flex items-center justify-center w-24 h-24 border cursor-pointer'>
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
              className='relative w-24 h-24 border overflow-hidden'
            >
              <img
                src={imageUrls[index]}
                alt='미리보기 이미지'
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => handleDelete(image.id)}
                className='absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full'
              >
                ×
              </button>
            </div>
          ),
      )}
    </div>
  );
};

export default ThumbnailImageList;
