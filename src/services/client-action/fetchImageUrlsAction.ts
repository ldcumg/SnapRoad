import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { ImagesAllWithoutPostId } from '@/types/projectType';

export const fetchImageUrls = async (images: ImagesAllWithoutPostId[], bucketName: string, folderName: string) => {
  const urls = await Promise.all(
    images.map(async (image) => {
      try {
        const url = await fetchSignedUrl(bucketName, folderName, image.post_image_name!);
        return url;
      } catch (error) {
        console.error(`이미지의 URL을 가져오는 중 오류 발생 ${image.id}:`, error);
        return '';
      }
    }),
  );
  return urls;
};
