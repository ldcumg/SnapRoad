import { getGroupSignedImageUrls } from '@/services/groupServices';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { getGroupDetails, getRandomGroupId, getRandomThumbnail } from '@/services/server-action/groupServerActions';
import { GroupWithCounts } from '@/types/groupTypes';
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
        const userId = data.user.id;
        let { data: groups }: { data: GroupWithCounts[] | null } = await browserClient.rpc(
          'get_user_groups_with_count',
          {
            input_user_id: userId,
            page: pageParam,
          },
        );
        if (!groups) groups = [];
        const images = await getGroupSignedImageUrls(groups);
        if (images) {
          groups = groups.map((group, idx) => {
            return {
              ...group,
              group_image_url: images[idx].signedUrl,
            };
          });
        }
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

const useGroupRandomImageQuery = () => {
  return useQuery({
    queryKey: ['groupImages'],
    queryFn: async () => {
      const { data } = await browserClient.auth.getUser();
      let url = '';
      if (data.user?.id) {
        const userId = data.user.id;
        const randomGroupData = await getRandomGroupId(userId);
        if (randomGroupData) {
          const thumbnailData = await getRandomThumbnail(randomGroupData);
          if (thumbnailData) url = (await getSignedImgUrl('tour_images', 20, `/group_name/${thumbnailData}`)) as string;
        }
      }
      return url;
    },
  });
};

export { useGroupDetailQuery, useGroupListInfiniteQuery, useGroupRandomImageQuery };
