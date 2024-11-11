'use client';

interface ImageUploadStatusProps {
  imageCount: number;
  maxImages?: number;
}

const ImageUploadCounter = ({ imageCount, maxImages = 10 }: ImageUploadStatusProps) => (
  <div className='mb-2 text-center text-gray-600'>
    <span className='text-sm'>
      이미지 업로드: {imageCount} / {maxImages}
    </span>
  </div>
);

export default ImageUploadCounter;
