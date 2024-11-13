'use client';

interface SortableImageProps {
  image: {
    id: number;
    [key: string]: any;
  };
  imageUrl: string;
  selectedCover: number | null;
}

const PostSortableImage = ({ image, imageUrl, selectedCover }: SortableImageProps) => {
  return (
    <div className='keen-slider__slide !h-[240px] !min-h-[240px] !min-w-[240px] !max-w-[240px] flex-1'>
      <div className='absolute bottom-2 right-2 z-10'>
        {selectedCover === image.id ? (
          <span className='rounded-xl bg-primary-400 px-2 py-1 text-xs text-white'>대표</span>
        ) : (
          <span
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className='rounded-xl px-2 py-1 text-xs text-white'
          >
            대표
          </span>
        )}
      </div>
      <img
        src={imageUrl}
        alt='업로드 이미지'
        className='h-full w-full object-cover'
      />
    </div>
  );
};
export default PostSortableImage;
