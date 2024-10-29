import { getImages } from '@/services/client-action/_imagesAction';
import { Images } from '@/types/imagesType';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * 이미지 정보 받아오기
 * signed url이라 토큰이 있어서 이미지가 뜨지 않는 경우 발생하기 때문에
 * 올릴때/ 내릴때 다른 방식 필요
 */

export const useImagesQuery = (): UseQueryResult<Images[], Error> => {
  return useQuery<Images[], Error>({
    queryKey: ['images'],
    queryFn: getImages,
  });
};
