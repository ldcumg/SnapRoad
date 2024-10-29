'use client';

import { useImageUploadForm } from '@/hooks/byUse/useImageUploadForm';
import { useDeleteImage } from '@/hooks/queries/byUse/useDeleteImageMutation';
import { useSetCoverImage } from '@/hooks/queries/byUse/useSetCoverImageMutation';
import { useUploadImage } from '@/hooks/queries/byUse/useUploadImageMutation';
import { downloadAllAsZip, downloadSingleFile } from '@/services/client-action/downloadAction';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import { SubmitHandler } from 'react-hook-form';

interface ImageListProps {
  userId: string;
  uploadSessionId: string;
}

const ImageManager = ({ userId, uploadSessionId }: ImageListProps) => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const formattedDate = formatDateToNumber(new Date().toString()) || '';
  const { images } = useImageUploadStore();

  const uploadMutation = useUploadImage(bucketName, folderName, userId);
  const deleteMutation = useDeleteImage(bucketName, folderName);
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useImageUploadForm();

  const onSubmit: SubmitHandler<{ files: File[] }> = (data) => {
    uploadMutation.mutate(data.files);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type='file'
          accept='image/*'
          multiple
          {...register('files', {
            onChange: (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 10) {
                setError('files', { message: '최대 10장의 이미지만 업로드할 수 있습니다.' });
              } else {
                clearErrors('files');
              }
            },
          })}
        />
        {errors.files && <p style={{ color: 'red' }}>{errors.files.message}</p>}
        <button type='submit'>사진 업로드</button>
      </form>

      {images.length > 0 && (
        <div className='flex flex-row gap-2 p-3'>
          {images.map((image) => (
            <div
              key={image.id}
              style={{ maxWidth: '300px', margin: '10px' }}
            >
              <img
                src={image.blobUrl}
                alt='업로드 이미지'
                style={{ width: '100%' }}
              />
              <p>파일명: {image.filename}</p>
              <p>위도: {image.latitude}</p>
              <p>경도: {image.longitude}</p>
              <p>촬영 날짜: {formatDateToNumber(image.dateTaken)}</p>
              <button onClick={() => downloadSingleFile(bucketName, image.filename, folderName)}>개별 다운로드</button>
              <button onClick={() => deleteMutation.mutate(image.id)}>삭제</button>
              <button
                onClick={() => setCoverMutation.mutate(image.id)}
                disabled={image.isCover}
              >
                {image.isCover ? '대표 이미지로 설정됨' : '대표 이미지 설정'}
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => downloadAllAsZip(bucketName, images, `images_${formattedDate}.zip`, folderName)}>
        ZIP 파일로 다운로드
      </button>
    </section>
  );
};

export default ImageManager;
