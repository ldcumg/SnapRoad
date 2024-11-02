import queryKeys from '../queryKeys';
import { getGroupSignedImageUrls } from '@/services/groupServices';
import { getSignedImgUrls } from '@/services/server-action/getSignedImgUrls';
import { getGroupDetails, getGroupInfo } from '@/services/server-action/groupServerActions';
import { GroupWithCounts } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const useGroupDetailQueryForUpdate = (group_id?: string) => {
  return useQuery({
    queryKey: ['groupDetail', group_id],
    queryFn: () => (group_id ? getGroupDetails(group_id) : null),
  });
};

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

type PostData = {
  created_at: string;
  post_address: string;
  post_thumbnail_image: string;
  group_id: string;
};
type PostDataListType = PostData[] | null;

const useGroupRandomImageQuery = () => {
  return useQuery({
    queryKey: ['groupImages'],
    queryFn: async () => {
      const { data } = await browserClient.auth.getUser();
      let dataList: PostDataListType = [];
      if (data.user?.id) {
        const userId = data.user.id;
        const { data: postDataList }: { data: PostDataListType } = await browserClient.rpc(
          'get_user_posts_by_user_id',
          { input_user_id: userId },
        );
        if (postDataList?.length) {
          //TODO - tour_image버킷 폴더구조 변경 후 요청url변경필요
          const imgNameArray = postDataList.map((postData) => `${postData.group_id}/${postData.post_thumbnail_image}`);
          const signedUrls = await getSignedImgUrls('tour_images', 60 * 60, imgNameArray);
          if (signedUrls) {
            dataList = postDataList.map((data, idx) => ({
              ...data,
              post_thumbnail_image: signedUrls[idx].signedUrl,
            }));
          }
        }
      }
      return dataList;
    },
  });
};

const useGroupInfoQuery = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.group.info(groupId),
    queryFn: ({ queryKey }) => getGroupInfo({ queryKey }),
  });
};

export {
  useGroupDetailQueryForUpdate,
  useGroupDetailQuery,
  useGroupListInfiniteQuery,
  useGroupRandomImageQuery,
  useGroupInfoQuery,
};
