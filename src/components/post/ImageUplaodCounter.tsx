interface ImageUploadStatusProps {
  imageCount: number;
  maxImages?: number;
}

const ImageUplaodCounter = ({ imageCount, maxImages = 10 }: ImageUploadStatusProps) => (
  <div className='text-center text-gray-600 mb-2'>
    <span className='text-sm'>
      이미지 업로드: {imageCount} / {maxImages}
    </span>
  </div>
);

export default ImageUplaodCounter;
