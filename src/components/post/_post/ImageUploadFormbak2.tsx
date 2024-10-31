'use client';

import { downloadSingleFile, downloadAllAsZip } from '@/services/client-action/downloadAction';
import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { useImageStore } from '@/stores/imageStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const { images, addImages, clearImages } = useImageStore();

  //NOTE - 이미지 업로드 후 DB에서 사용자 ID에 맞는 모든 이미지 데이터 가져오기
  const { data: imageData = [], isLoading: imagesLoading } = useQuery<ImageData[]>({
    queryKey: ['images', userId],
    queryFn: async () => {
      const { data, error } = await browserClient.from('images').select('*').eq('user_id', userId);
      if (error) throw new Error('이미지 데이터를 불러오는 중 오류 발생');

      return data.map((item) => ({
        id: item.id,
        blobUrl: item.post_image_url,
        filename: item.post_image_name,
        latitude: item.post_lat ?? undefined,
        longitude: item.post_lng ?? undefined,
        dateTaken: item.origin_created_at,
        isCover: item.is_cover,
        userId: item.user_id,
        createdAt: item.created_at,
      }));
    },
    enabled: !!userId,
  });

  //NOTE - 이미지 업로드 및 메타데이터 저장
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

      return Promise.all(
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
    },
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }), 유저 아이디의 모든 데이터
    onSuccess: (newImages) => {
      // 새로 업로드된 이미지 데이터만 imageData에 추가
      setImageData((prevImages) => [...newImages, ...prevImages]);
    },
    onError: (error) => {
      console.error('이미지 업로드 에러:', error);
    },
  });

  const fetchSignedUrl = async (filename: string) => {
    const { data, error } = await browserClient.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${filename}`, 60 * 60);
    if (error) throw new Error('Signed URL 생성 실패');
    return data.signedUrl;
  };

  //NOTE - 대표 이미지 선택
  const setCoverMutation = useMutation({
    mutationFn: async (id: number) => {
      await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId);
      await browserClient.from('images').update({ is_cover: true }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
    onError: (error) => console.error('대표 이미지 설정 오류:', error),
  });

  //NOTE - 이미지 개별 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await browserClient.from('images').select('post_image_name').eq('id', id);
      if (error) throw new Error('이미지 이름을 가져오는 중 오류 발생');

      const filename = data[0].post_image_name;
      const storageError = await browserClient.storage.from(bucketName).remove([`${folderName}/${filename}`]);

      if (storageError) throw new Error('스토리지에서 파일 삭제 중 오류 발생');
      await browserClient.from('images').delete().eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images', userId] }),
    onError: (error) => console.error('이미지 삭제 오류:', error),
  });

  if (imagesLoading) return <div>이미지 데이터를 불러오는 중...</div>;

  return (
    <section>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={(e) => uploadMutation.mutate(Array.from(e.target.files || []))}
      />
      {imageData.length > 0 && (
        <div className='flex flex-row gap-2 p-3'>
          {imageData.map((image) => (
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
      <button onClick={() => downloadAllAsZip(bucketName, imageData, `images_${formattedDate}.zip`, folderName)}>
        ZIP 파일로 다운로드
      </button>
    </section>
  );
};

export default ImageUploadForm;
