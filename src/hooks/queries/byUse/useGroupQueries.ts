import { getGroupListByPage } from '@/services/client-action/groupActions';
import { getGroupSignedImageUrl, getUserCount } from '@/services/groupServices';
import { getGroupDetails } from '@/services/server-action/groupServerActions';
import browserClient from '@/utils/supabase/client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const useGroupDetailQuery = (group_id: string) => {
  return useQuery({
    queryKey: ['groupDetail', group_id],
    queryFn: () => getGroupDetails(group_id),
  });
};

const useGroupListInfiniteQuery = () => {
  return useInfiniteQuery({
    staleTime: 1000 * 60 * 10,
    queryKey: ['group_list'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await browserClient.auth.getUser();
      if (data.user?.id) {
        let groups = await getGroupListByPage({ pageParam, userId: data.user?.id });
        if (!groups) groups = [];
        const groupCounts = await getUserCount(groups);
        const groupImageUrls = await getGroupSignedImageUrl(groups);
        groups = groups.map((group, idx) => {
          return {
            ...group,
            group_data: { ...group.group_data, group_image_url: groupImageUrls[idx] ?? '' },
            userCount: groupCounts[idx],
          };
        });
        return groups;
      }
    },
    retry: 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage && lastPage.length === 6 ? lastPageParam + 1 : undefined;
    },
  });
};

export { useGroupDetailQuery, useGroupListInfiniteQuery };
