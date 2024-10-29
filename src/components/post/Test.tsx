'use client';

import { useUploadImage } from '@/hooks/queries/byUse/useUploadImage';
import { downloadAllAsZip, downloadSingleFile } from '@/services/client-action/downloadAction';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ImageData {
  id: number;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
  userId?: string;
  createdAt: string;
}

interface ImageListProps {
  userId: string;
}

const Test = ({ userId }: ImageListProps) => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const formattedDate = formatDateToNumber(new Date().toString()) || '';
  const queryClient = useQueryClient();
  const { images, addImages, updateImage, deleteImage } = useImageUploadStore();

  // useUploadImage 훅을 사용하여 이미지 업로드 처리
  const uploadMutation = useUploadImage(bucketName, folderName, userId);
  const setCoverMutation = useMutation({
    mutationFn: async (id: number) => {
      await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId);
      await browserClient.from('images').update({ is_cover: true }).eq('id', id);
    },
    onMutate: async (id) => {
      useImageUploadStore.getState().updateImage(id, { isCover: true });
      useImageUploadStore.getState().images.forEach((image) => {
        if (image.id !== id) {
          useImageUploadStore.getState().updateImage(image.id, { isCover: false });
        }
      });
    },
    onError: (error) => {
      console.error('대표 이미지 설정 오류:', error);
    },
    onSuccess: () => {
      console.log('대표 이미지 설정 성공');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await browserClient.from('images').select('post_image_name').eq('id', id);
      if (error || !data || data.length === 0) throw new Error('이미지 이름을 가져오는 중 오류 발생');

      const filename = data[0].post_image_name;
      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);
      if (storageError) {
        console.error('스토리지에서 파일 삭제 중 오류 발생:', storageError.message);
        throw new Error('스토리지에서 파일 삭제 중 오류 발생');
      }

      const { error: dbError } = await browserClient.from('images').delete().eq('id', id);
      if (dbError) throw new Error('데이터베이스에서 이미지 삭제 중 오류 발생');

      return id;
    },
    onMutate: async (id) => {
      useImageUploadStore.getState().deleteImage(id);
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
    },
    onSuccess: (deletedId) => {
      console.log(`이미지 ${deletedId} 삭제 성공`);
    },
  });

  return (
    <section>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={(e) => uploadMutation.mutate(Array.from(e.target.files || []))}
      />
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

export default Test;
