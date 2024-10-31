'use client';

import { downloadSingleFile, downloadAllAsZip } from '@/services/client-action/downloadAction';
import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
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

const ImageUploadForm = ({ userId }: ImageListProps) => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const currentDate = new Date().toISOString();
  const formattedDate = formatDateToNumber(new Date().toString()) || '';
  const queryClient = useQueryClient();
  const { images, addImages, updateImage, deleteImage } = useImageUploadStore();

  const fetchSignedUrl = async (filename: string) => {
    const { data, error } = await browserClient.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${filename}`, 60 * 60);
    if (error) throw new Error('Signed URL 생성 실패');
    return data.signedUrl;
  };

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const exifResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
          await browserClient.storage.from(bucketName).upload(`${folderName}/${uniqueFileName}`, file);
          const signedUrl = await fetchSignedUrl(uniqueFileName);
          const response = await fetch(signedUrl);
          const blobUrl = URL.createObjectURL(await response.blob());
          const exifData = exifDataArray[index];
          const fileNameWithoutExtension = removeFileExtension(uniqueFileName);

          const { data, error } = await browserClient
            .from('images')
            .insert({
              post_image_name: fileNameWithoutExtension,
              post_image_url: signedUrl,
              created_at: currentDate,
              is_cover: false,
              post_lat: exifData.latitude,
              post_lng: exifData.longitude,
              origin_created_at: formatDateToNumber(exifData.dateTaken),
              user_id: userId,
            })
            .select();

          if (error) throw new Error(error.message);
          return {
            blobUrl,
            id: data[0].id,
            userId: data[0].user_id,
            isCover: data[0].is_cover,
            createdAt: currentDate,
            filename: uniqueFileName,
            latitude: exifData.latitude,
            longitude: exifData.longitude,
            dateTaken: exifData.dateTaken,
          };
        }),
      );

      addImages(uploadedImages);
      return uploadedImages;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
    onError: (error) => {
      console.error('이미지 업로드 에러:', error);
    },
  });

  const setCoverMutation = useMutation({
    mutationFn: async (id: number) => {
      // 모든 이미지의 대표 이미지를 해제
      await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId);
      // 선택한 이미지를 대표 이미지로 설정
      await browserClient.from('images').update({ is_cover: true }).eq('id', id);
    },
    onMutate: async (id) => {
      // UI에서 직접 반영
      useImageUploadStore.getState().updateImage(id, { isCover: true }); // 현재 선택한 ID가 대표 이미지로 설정
      useImageUploadStore.getState().images.forEach((image) => {
        if (image.id !== id) {
          useImageUploadStore.getState().updateImage(image.id, { isCover: false }); // 다른 이미지들은 대표 이미지 해제
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
      // 데이터베이스에서 파일 이름을 가져옵니다.
      const { data, error } = await browserClient.from('images').select('post_image_name').eq('id', id);
      if (error || !data || data.length === 0) throw new Error('이미지 이름을 가져오는 중 오류 발생');

      const filename = data[0].post_image_name;

      // 스토리지에서 파일 삭제
      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);
      if (storageError) {
        console.error('스토리지에서 파일 삭제 중 오류 발생:', storageError.message);
        throw new Error('스토리지에서 파일 삭제 중 오류 발생');
      }

      // 데이터베이스에서 이미지 삭제
      const { error: dbError } = await browserClient.from('images').delete().eq('id', id);
      if (dbError) throw new Error('데이터베이스에서 이미지 삭제 중 오류 발생');

      return id; // 삭제한 id를 반환하여 onSuccess에서 사용
    },
    onMutate: async (id) => {
      // 낙관적 업데이트: 상태에서 삭제
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
          {console.log(images)}
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

export default ImageUploadForm;
