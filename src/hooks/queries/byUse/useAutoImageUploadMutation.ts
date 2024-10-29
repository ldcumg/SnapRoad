import { generateUniqueFileName } from '@/services/client-action/fileActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { formatDateToNumber } from '@/utils/dateUtils';
import { removeFileExtension } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUploadImage(bucketName: string, folderName: string, userId: string) {
  const queryClient = useQueryClient();
  const { addImages } = useImageUploadStore();
  const currentDate = new Date().toISOString();

  const fetchSignedUrl = async (filename: string) => {
    const { data, error } = await browserClient.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${filename}`, 60 * 60);
    if (error) throw new Error('Signed URL 생성 실패');
    return data.signedUrl;
  };

  return useMutation({
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
  });
}

export function useSetCoverImage(userId: string) {
  const { updateImage } = useImageUploadStore();

  return useMutation({
    mutationFn: async (id: number) => {
      await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId);
      await browserClient.from('images').update({ is_cover: true }).eq('id', id);
    },
    onMutate: (id: number) => {
      updateImage(id, { isCover: true });
    },
  });
}

export function useDeleteImage(bucketName: string, folderName: string) {
  const { deleteImage } = useImageUploadStore();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await browserClient.from('images').select('post_image_name').eq('id', id);
      if (error || !data || data.length === 0) throw new Error('이미지 이름을 가져오는 중 오류 발생');

      const filename = data[0].post_image_name;

      const { error: storageError } = await browserClient.storage
        .from(bucketName)
        .remove([`${folderName}/${filename}`]);
      if (storageError) throw new Error('스토리지에서 파일 삭제 중 오류 발생');

      await browserClient.from('images').delete().eq('id', id);
      return id;
    },
    onMutate: (id: number) => {
      deleteImage(id);
    },
  });
}
