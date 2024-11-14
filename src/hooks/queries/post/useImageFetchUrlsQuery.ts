import queryKeys from '../queryKeys';
import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction';
import { ImagesAllWithoutPostId } from '@/types/projectType';
import { useQuery } from '@tanstack/react-query';

/** 이미지 미리보기 로직 */
export function useFetchImageUrls(
  uploadSessionId: string,
  images: ImagesAllWithoutPostId[],
  bucketName: string,
  folderName: string,
) {
  return useQuery({
    queryKey: queryKeys.image.imageUrl(uploadSessionId),
    queryFn: () => fetchImageUrls(images, bucketName, folderName),
    enabled: images.length > 0,
  });
}
