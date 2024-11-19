import queryKeys from '../queryKeys';
import { ONE_HOUR_FOR_TANSTACK } from '@/constants/time';
import {
  getGroupDetails,
  getGroupInfo,
  getInfiniteGroupData,
  getRandomPosts,
} from '@/services/server-action/groupServerActions';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const useGroupDetailQueryForUpdate = (group_id: string) => {
  return useQuery({
    queryKey: queryKeys.group.groupForUpdate(group_id),
    queryFn: () => getGroupDetails(group_id),
    enabled: !!group_id,
    staleTime: 0,
    gcTime: 0,
  });
};

const useGroupDetailQuery = (group_id: string) => {
  return useQuery({
    queryKey: queryKeys.group.groupDetail(group_id),
    queryFn: () => getGroupDetails(group_id),
  });
};

const useGroupListInfiniteQuery = () => {
  return useInfiniteQuery({
    staleTime: 1000 * 60 * 10,
    queryKey: queryKeys.group.groupList(),
    queryFn: ({ pageParam = 1 }) => getInfiniteGroupData({ pageParam }),
    retry: 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage && lastPage.length === 6 ? lastPageParam + 1 : undefined;
    },
  });
};

const useGroupRandomImageQuery = () => {
  return useQuery({
    queryKey: queryKeys.group.groupRandomPosts(),
    queryFn: () => getRandomPosts(),
  });
};

const useGroupInfoQuery = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.group.info(groupId),
    queryFn: ({ queryKey }) => getGroupInfo({ queryKey }),
    staleTime: ONE_HOUR_FOR_TANSTACK,
  });

export {
  useGroupDetailQueryForUpdate,
  useGroupDetailQuery,
  useGroupListInfiniteQuery,
  useGroupRandomImageQuery,
  useGroupInfoQuery,
};
