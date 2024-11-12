import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction';
import { ImagesAllWithoutPostId } from '@/types/projectType';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '../queryKeys';

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
