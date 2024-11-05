import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction';
import { ImagesAllWithoutPostId } from '@/types/projectType';
import { useQuery } from '@tanstack/react-query';

export function useFetchImageUrls(
  uploadSessionId: string,
  images: ImagesAllWithoutPostId[],
  bucketName: string,
  folderName: string,
) {
  return useQuery({
    queryKey: ['imageUrls', uploadSessionId],
    queryFn: () => fetchImageUrls(images, bucketName, folderName),
    enabled: images.length > 0,
  });
}
