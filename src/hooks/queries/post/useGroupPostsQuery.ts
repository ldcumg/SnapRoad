import queryKeys from '../queryKeys';
import { getPostsImagesPerGroup, getPostsPerGroup } from '@/services/server-action/postAction';
import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query';

/** 그룹 게시물들 요청 쿼리 */
export const getGroupPostsQuery = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.group.posts(groupId),
    queryFn: ({ queryKey }) => getPostsPerGroup({ queryKey }),
  });
};

//TODO - infiniteQuery
/** 그룹 게시물들의 이미지 요청 쿼리 */
export const getGroupPostsImagesQuery = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.group.postsImages(groupId),
    queryFn: ({ queryKey }) => getPostsImagesPerGroup({ queryKey }),
  });
};
