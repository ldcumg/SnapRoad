import queryKeys from '../queryKeys';
import { TEN_MINUTES_FOR_TANSTACK } from '@/constants/time';
import { getPostsImagesPerGroup, getPostsCoverImagesPerGroup } from '@/services/server-action/postAction';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

/** 그룹 게시물들의 이미지들 요청 쿼리 */
export const getGroupPostsImagesQuery = (groupId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.group.postsImages(groupId),
    queryFn: ({ queryKey, pageParam }) => getPostsImagesPerGroup({ queryKey, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      !!lastPage.length && lastPage.length === 21 ? lastPageParam + 1 : null,
    gcTime: TEN_MINUTES_FOR_TANSTACK,
  });
};

/** 그룹 게시물들의 대표 이미지들 요청 쿼리 */
export const getGroupPostsCoverImagesQuery = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.group.posts(groupId),
    queryFn: ({ queryKey }) => getPostsCoverImagesPerGroup({ queryKey }),
    gcTime: TEN_MINUTES_FOR_TANSTACK,
  });
};
